import { z } from "zod";

type AuthValidationMessages = {
  invalidEmail: string;
  passwordMin: string;
  nameMin: string;
  confirmPasswordMin: string;
  termsRequired: string;
  passwordMismatch: string;
};

// 登录校验集中在 schema 工厂中，调用方按当前 locale 注入错误文案，避免英文界面出现中文 toast。
export function createSignInSchema(
  messages: Pick<AuthValidationMessages, "invalidEmail" | "passwordMin">,
) {
  return z.object({
    email: z.email(messages.invalidEmail),
    password: z.string().min(8, messages.passwordMin),
    rememberMe: z.boolean(),
  });
}

// 注册 schema 使用 refine 校验确认密码，避免业务代码里手写条件分支。
export function createSignUpSchema(messages: AuthValidationMessages) {
  return z
    .object({
      name: z.string().trim().min(2, messages.nameMin).max(40),
      email: z.email(messages.invalidEmail),
      password: z.string().min(8, messages.passwordMin).max(128),
      confirmPassword: z.string().min(8, messages.confirmPasswordMin),
      terms: z.boolean().refine(Boolean, messages.termsRequired),
    })
    .refine((value) => value.password === value.confirmPassword, {
      path: ["confirmPassword"],
      message: messages.passwordMismatch,
    });
}

export function createForgotPasswordSchema(
  messages: Pick<AuthValidationMessages, "invalidEmail">,
) {
  return z.object({
    email: z.email(messages.invalidEmail),
  });
}

export function createResetPasswordSchema(
  messages: Pick<
    AuthValidationMessages,
    "passwordMin" | "confirmPasswordMin" | "passwordMismatch"
  >,
) {
  // 重置密码必须同时校验 token 和两次输入；token 缺失时不调用 Better Auth，避免无效请求进入认证层。
  return z
    .object({
      token: z.string().min(1),
      password: z.string().min(8, messages.passwordMin).max(128),
      confirmPassword: z.string().min(8, messages.confirmPasswordMin),
    })
    .refine((value) => value.password === value.confirmPassword, {
      path: ["confirmPassword"],
      message: messages.passwordMismatch,
    });
}

export const signInSchema = createSignInSchema({
  invalidEmail: "请输入有效邮箱",
  passwordMin: "密码至少 8 位",
});

export const signUpSchema = createSignUpSchema({
  invalidEmail: "请输入有效邮箱",
  passwordMin: "密码至少 8 位",
  nameMin: "显示名称至少 2 个字符",
  confirmPasswordMin: "请再次输入密码",
  termsRequired: "必须同意服务条款",
  passwordMismatch: "两次输入的密码不一致",
});

export const forgotPasswordSchema = createForgotPasswordSchema({
  invalidEmail: "请输入有效邮箱",
});

export const resetPasswordSchema = createResetPasswordSchema({
  passwordMin: "密码至少 8 位",
  confirmPasswordMin: "请再次输入密码",
  passwordMismatch: "两次输入的密码不一致",
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
