"use client";

import type { note } from "@/generated/prisma/client";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  createNoteAction,
  deleteNoteAction,
  updateNoteAction,
} from "@/features/notes/actions";
import { formatDateTime } from "@/lib/format";
import type { ActionResult } from "@/server/action-result";

const initialState: ActionResult = {
  ok: false,
  message: "",
};

type NotesManagerProps = {
  notes: note[];
  query: string;
};

export function NotesManager({ notes, query }: NotesManagerProps) {
  const [editingNote, setEditingNote] = useState<note | null>(null);
  const [createState, createAction, isCreating] = useActionState(
    createNoteAction,
    initialState,
  );
  const [updateState, updateAction, isUpdating] = useActionState(
    updateNoteAction,
    initialState,
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteNoteAction,
    initialState,
  );

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 rounded-lg border bg-background p-4">
        <form className="flex flex-col gap-3 sm:flex-row" action="/examples/notes">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input name="q" defaultValue={query} placeholder="搜索标题或内容" className="pl-8" />
          </div>
          <Button type="submit" variant="outline">
            搜索
          </Button>
        </form>

        <form action={createAction} className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="title">标题</Label>
            <Input id="title" name="title" placeholder="例如：第一个业务模块" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">内容</Label>
            <Textarea id="content" name="content" placeholder="写下这个 Note 的内容" />
          </div>
          {createState.message ? (
            <p className={createState.ok ? "text-sm text-primary" : "text-sm text-destructive"}>
              {createState.message}
            </p>
          ) : null}
          <Button type="submit" className="w-fit" disabled={isCreating}>
            <Plus data-icon="inline-start" />
            {isCreating ? "创建中" : "新建 Note"}
          </Button>
        </form>
      </div>

      <div className="rounded-lg border bg-background">
        {notes.length === 0 ? (
          <div className="grid min-h-52 place-items-center p-6 text-center">
            <div>
              <p className="font-medium">暂无 Note</p>
              <p className="mt-2 text-sm text-muted-foreground">
                创建第一个 Note 后，Codex 可以沿用这个模块继续扩展业务功能。
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead className="hidden md:table-cell">内容</TableHead>
                <TableHead className="hidden sm:table-cell">更新时间</TableHead>
                <TableHead className="w-28 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="hidden max-w-md truncate text-muted-foreground md:table-cell">
                    {item.content}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {formatDateTime(item.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={editingNote?.id === item.id}
                        onOpenChange={(open) => setEditingNote(open ? item : null)}
                      >
                        <DialogTrigger asChild>
                          <Button type="button" variant="ghost" size="icon-sm" aria-label="编辑 Note">
                            <Pencil />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>编辑 Note</DialogTitle>
                          </DialogHeader>
                          <form action={updateAction} className="grid gap-3">
                            <input type="hidden" name="id" value={item.id} />
                            <div className="grid gap-2">
                              <Label htmlFor={`edit-title-${item.id}`}>标题</Label>
                              <Input
                                id={`edit-title-${item.id}`}
                                name="title"
                                defaultValue={item.title}
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor={`edit-content-${item.id}`}>内容</Label>
                              <Textarea
                                id={`edit-content-${item.id}`}
                                name="content"
                                defaultValue={item.content}
                              />
                            </div>
                            {updateState.message ? (
                              <p
                                className={
                                  updateState.ok
                                    ? "text-sm text-primary"
                                    : "text-sm text-destructive"
                                }
                              >
                                {updateState.message}
                              </p>
                            ) : null}
                            <Button type="submit" disabled={isUpdating}>
                              {isUpdating ? "保存中" : "保存"}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="删除 Note"
                          disabled={isDeleting}
                        >
                          <Trash2 />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {deleteState.message ? (
        <p className={deleteState.ok ? "text-sm text-primary" : "text-sm text-destructive"}>
          {deleteState.message}
        </p>
      ) : null}
    </div>
  );
}
