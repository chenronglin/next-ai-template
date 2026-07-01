import { z } from "zod";

type NoteValidationMessages = {
  titleRequired: string;
  titleMax: string;
  contentRequired: string;
  contentMax: string;
  missingId: string;
};

export function createNoteCreateSchema(messages: NoteValidationMessages) {
  // Notes CRUD 的输入规则集中在这里，Server Action 不接受未经过 schema 的表单值。
  return z.object({
    title: z.string().trim().min(1, messages.titleRequired).max(80, messages.titleMax),
    content: z
      .string()
      .trim()
      .min(1, messages.contentRequired)
      .max(2000, messages.contentMax),
  });
}

export function createNoteUpdateSchema(messages: NoteValidationMessages) {
  return createNoteCreateSchema(messages).extend({
    id: z.string().min(1, messages.missingId),
  });
}

export function createNoteDeleteSchema(messages: NoteValidationMessages) {
  return z.object({
    id: z.string().min(1, messages.missingId),
  });
}

export const noteCreateSchema = createNoteCreateSchema({
  titleRequired: "标题不能为空",
  titleMax: "标题最多 80 个字符",
  contentRequired: "内容不能为空",
  contentMax: "内容最多 2000 个字符",
  missingId: "缺少 Note ID",
});

export const noteUpdateSchema = createNoteUpdateSchema({
  titleRequired: "标题不能为空",
  titleMax: "标题最多 80 个字符",
  contentRequired: "内容不能为空",
  contentMax: "内容最多 2000 个字符",
  missingId: "缺少 Note ID",
});

export const noteDeleteSchema = createNoteDeleteSchema({
  titleRequired: "标题不能为空",
  titleMax: "标题最多 80 个字符",
  contentRequired: "内容不能为空",
  contentMax: "内容最多 2000 个字符",
  missingId: "缺少 Note ID",
});

export const noteSearchSchema = z.object({
  q: z.string().trim().max(80).optional().default(""),
});

export type NoteCreateInput = z.infer<typeof noteCreateSchema>;
export type NoteUpdateInput = z.infer<typeof noteUpdateSchema>;
