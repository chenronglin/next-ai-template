import "server-only";

import {
  defaultLocale,
  getPathLocale,
  resolveLocale,
  type Locale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { env } from "@/lib/env";
import { sendEmail } from "@/lib/email";

type AuthEmailInput = {
  to: string;
  name: string;
  url: string;
};

type AuthEmailTemplate = {
  subject: string;
  title: string;
  body: string;
  button: string;
};

export async function sendVerificationEmail(input: AuthEmailInput) {
  const { dictionary, locale } = await getAuthEmailDictionary(input.url);
  const template = dictionary.auth.emails.verification;

  await sendTemplatedAuthEmail({
    ...input,
    locale,
    brand: dictionary.common.brand,
    template,
    footer: dictionary.auth.emails.footer,
  });
}

export async function sendPasswordResetEmail(input: AuthEmailInput) {
  const { dictionary, locale } = await getAuthEmailDictionary(input.url);
  const template = dictionary.auth.emails.passwordReset;

  await sendTemplatedAuthEmail({
    ...input,
    locale,
    brand: dictionary.common.brand,
    template,
    footer: dictionary.auth.emails.footer,
  });
}

export async function sendDeleteAccountEmail(input: AuthEmailInput) {
  const { dictionary, locale } = await getAuthEmailDictionary(input.url);
  const template = dictionary.auth.emails.deleteAccount;

  await sendTemplatedAuthEmail({
    ...input,
    locale,
    brand: dictionary.common.brand,
    template,
    footer: dictionary.auth.emails.footer,
  });
}

async function sendTemplatedAuthEmail({
  to,
  name,
  url,
  locale,
  brand,
  template,
  footer,
}: AuthEmailInput & {
  locale: Locale;
  brand: string;
  template: AuthEmailTemplate;
  footer: string;
}) {
  const body = template.body.replace("{name}", name || to);

  await sendEmail({
    to,
    subject: template.subject,
    debugUrl: url,
    html: renderAuthEmail({
      brand,
      title: template.title,
      body,
      button: template.button,
      footer,
      locale,
      url,
    }),
  });
}

async function getAuthEmailDictionary(url: string) {
  const locale = getLocaleFromAuthUrl(url);
  const dictionary = await getDictionary(locale);

  return { dictionary, locale };
}

function getLocaleFromAuthUrl(value: string): Locale {
  try {
    const authUrl = new URL(value, env.BETTER_AUTH_URL);
    const callbackURL = authUrl.searchParams.get("callbackURL");

    if (callbackURL) {
      const callback = new URL(callbackURL, env.NEXT_PUBLIC_APP_URL);
      return resolveLocale(getPathLocale(callback.pathname));
    }

    return resolveLocale(getPathLocale(authUrl.pathname));
  } catch {
    // 邮件语言推断失败时回落默认语言，不能因为本地化失败阻断关键认证邮件。
    return defaultLocale;
  }
}

function renderAuthEmail({
  brand,
  title,
  body,
  button,
  footer,
  locale,
  url,
}: {
  brand: string;
  title: string;
  body: string;
  button: string;
  footer: string;
  locale: Locale;
  url: string;
}) {
  const escapedUrl = escapeHtml(url);

  // 邮件客户端对 CSS 支持差异很大，因此这里使用保守的内联样式，保证 Resend 发送后主体可读。
  return `<!doctype html>
<html lang="${escapeHtml(locale)}">
  <body style="margin:0;background:#f6f7f9;color:#111827;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:28px;">
            <tr>
              <td style="font-size:14px;font-weight:700;color:#4f46e5;padding-bottom:16px;">${escapeHtml(
                brand,
              )}</td>
            </tr>
            <tr>
              <td style="font-size:22px;font-weight:700;line-height:1.35;padding-bottom:12px;">${escapeHtml(
                title,
              )}</td>
            </tr>
            <tr>
              <td style="font-size:15px;line-height:1.7;color:#374151;padding-bottom:24px;">${escapeHtml(
                body,
              )}</td>
            </tr>
            <tr>
              <td style="padding-bottom:24px;">
                <a href="${escapedUrl}" style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;border-radius:6px;padding:10px 14px;font-size:14px;font-weight:700;">${escapeHtml(
                  button,
                )}</a>
              </td>
            </tr>
            <tr>
              <td style="font-size:12px;line-height:1.6;color:#6b7280;">${escapeHtml(
                footer,
              )}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
