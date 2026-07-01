import { z } from "zod";

type ProfileValidationMessages = {
  nameMin: string;
  invalidImage: string;
};

type ChangePasswordValidationMessages = {
  currentPasswordRequired: string;
  passwordMin: string;
  confirmPasswordMin: string;
  passwordMismatch: string;
};

export function createUpdateProfileSchema(messages: ProfileValidationMessages) {
  // 个人资料更新只开放名称和头像 URL，邮箱仍交给认证系统管理。
  return z.object({
    name: z.string().trim().min(2, messages.nameMin).max(40),
    image: z.union([z.url(messages.invalidImage), z.literal("")]).optional(),
  });
}

export function createChangePasswordSchema(
  messages: ChangePasswordValidationMessages,
) {
  // 修改密码属于敏感操作：先校验当前密码是否填写，再校验新密码和确认密码一致。
  return z
    .object({
      currentPassword: z.string().min(1, messages.currentPasswordRequired),
      newPassword: z.string().min(8, messages.passwordMin).max(128),
      confirmPassword: z.string().min(8, messages.confirmPasswordMin),
      revokeOtherSessions: z.boolean(),
    })
    .refine((value) => value.newPassword === value.confirmPassword, {
      path: ["confirmPassword"],
      message: messages.passwordMismatch,
    });
}

export const updateProfileSchema = createUpdateProfileSchema({
  nameMin: "显示名称至少 2 个字符",
  invalidImage: "请输入有效头像 URL",
});

export const changePasswordSchema = createChangePasswordSchema({
  currentPasswordRequired: "请输入当前密码",
  passwordMin: "密码至少 8 位",
  confirmPasswordMin: "请再次输入密码",
  passwordMismatch: "两次输入的密码不一致",
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
