import { z } from "zod";

// 个人资料更新只开放名称和头像 URL，邮箱仍交给认证系统管理。
export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "显示名称至少 2 个字符").max(40),
  image: z.union([z.url("请输入有效头像 URL"), z.literal("")]).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
