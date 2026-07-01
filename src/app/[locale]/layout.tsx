import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocaleDocumentSync } from "@/components/layout/locale-document-sync";
import { getDictionary } from "@/i18n/dictionaries";
import {
  getLocaleFromRouteParams,
  isLocale,
  locales,
  type LocaleRouteParams,
} from "@/i18n/config";

export function generateStaticParams() {
  // 预先声明当前支持的语言段，后续增加语种时只需要扩展 i18n 配置常量。
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: LocaleRouteParams;
}): Promise<Metadata> {
  const locale = await getLocaleFromRouteParams(params);
  // 元数据跟随语言字典生成，避免英文页面继续暴露中文标题或描述。
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: LocaleRouteParams;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    // 非法语言段直接进入 404，避免未知 locale 继续渲染默认语言造成重复内容。
    notFound();
  }

  return (
    <>
      {/* 语言段只负责校验 locale 和同步文档语言；脚本、html、body 必须保留在静态根 layout。 */}
      <LocaleDocumentSync locale={locale} />
      {children}
    </>
  );
}
