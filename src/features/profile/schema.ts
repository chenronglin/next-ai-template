import { z } from "zod";

type ProfileValidationMessages = {
  nameMin: string;
  invalidImage: string;
};

export function createUpdateProfileSchema(messages: ProfileValidationMessages) {
  // 个人资料更新只开放名称和头像 URL，邮箱仍交给认证系统管理。
  return z.object({
    name: z.string().trim().min(2, messages.nameMin).max(40),
    image: z.union([z.url(messages.invalidImage), z.literal("")]).optional(),
  });
}

export const updateProfileSchema = createUpdateProfileSchema({
  nameMin: "显示名称至少 2 个字符",
  invalidImage: "请输入有效头像 URL",
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
