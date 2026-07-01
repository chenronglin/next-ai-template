import type { Metadata } from "next";

import { NotesManager } from "@/features/notes/components/notes-manager";
import { getNotes } from "@/features/notes/queries";
import { noteSearchSchema } from "@/features/notes/schema";
import { requireUser } from "@/server/require-user";

export const metadata: Metadata = {
  title: "Notes CRUD",
};

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await requireUser();
  const params = await searchParams;
  const parsed = noteSearchSchema.parse({
    q: params.q ?? "",
  });
  const notes = await getNotes(session.user.id, parsed.q);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold">Notes CRUD</h1>
        <p className="mt-2 text-muted-foreground">
          这个模块展示 Prisma 查询、Server Actions、Zod 校验和 shadcn/ui 表格。
        </p>
      </div>
      <NotesManager notes={notes} query={parsed.q} />
    </div>
  );
}
