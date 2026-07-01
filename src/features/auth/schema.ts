import { z } from "zod";

// 登录校验集中在 schema，客户端表单和未来 server action 可以复用同一份规则。
export const signInSchema = z.object({
  email: z.email("请输入有效邮箱"),
  password: z.string().min(8, "密码至少 8 位"),
  rememberMe: z.boolean(),
});

// 注册 schema 使用 refine 校验确认密码，避免业务代码里手写条件分支。
export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "显示名称至少 2 个字符").max(40),
    email: z.email("请输入有效邮箱"),
    password: z.string().min(8, "密码至少 8 位").max(128),
    confirmPassword: z.string().min(8, "请再次输入密码"),
    terms: z.boolean().refine(Boolean, "必须同意服务条款"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "两次输入的密码不一致",
  });

export const forgotPasswordSchema = z.object({
  email: z.email("请输入有效邮箱"),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
