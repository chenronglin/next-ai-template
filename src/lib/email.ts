import "server-only";

import { Resend } from "resend";

import { env } from "@/lib/env";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  debugUrl?: string;
};

let resendClient: Resend | null = null;

function getResendClient() {
  if (!env.RESEND_API_KEY) {
    return null;
  }

  if (!resendClient) {
    // Resend Client 只依赖 API Key，可以在模块级缓存，避免每封邮件重复创建实例。
    resendClient = new Resend(env.RESEND_API_KEY);
  }

  return resendClient;
}

export async function sendEmail({ to, subject, html, debugUrl }: SendEmailInput) {
  const resend = getResendClient();

  if (!resend) {
    if (env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY 未配置，生产环境无法发送认证邮件");
    }

    // 本地开发不强制配置真实邮件服务，避免模板开箱流程因为缺少第三方密钥直接中断。
    console.info(
      `[auth-email] 未配置 RESEND_API_KEY，已跳过真实发送：to=${to} subject=${subject}${
        debugUrl ? ` url=${debugUrl}` : ""
      }`,
    );
    return;
  }

  const result = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (result.error) {
    // 只把 Resend 的错误消息向上抛出，不记录 API Key 或邮件正文，避免日志泄漏敏感信息。
    throw new Error(result.error.message);
  }
}
