import { z } from "zod";

// Notes CRUD 的输入规则集中在这里，Server Action 不接受未经过 schema 的表单值。
export const noteCreateSchema = z.object({
  title: z.string().trim().min(1, "标题不能为空").max(80, "标题最多 80 个字符"),
  content: z.string().trim().min(1, "内容不能为空").max(2000, "内容最多 2000 个字符"),
});

export const noteUpdateSchema = noteCreateSchema.extend({
  id: z.string().min(1, "缺少 Note ID"),
});

export const noteDeleteSchema = z.object({
  id: z.string().min(1, "缺少 Note ID"),
});

export const noteSearchSchema = z.object({
  q: z.string().trim().max(80).optional().default(""),
});

export type NoteCreateInput = z.infer<typeof noteCreateSchema>;
export type NoteUpdateInput = z.infer<typeof noteUpdateSchema>;
