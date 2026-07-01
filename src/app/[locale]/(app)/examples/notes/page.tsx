import type { Metadata } from "next";

import { NotesManager } from "@/features/notes/components/notes-manager";
import { getNotes } from "@/features/notes/queries";
import { noteSearchSchema } from "@/features/notes/schema";
import { getLocaleFromRouteParams, type LocaleRouteParams } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { requireUser } from "@/server/require-user";

export async function generateMetadata({
  params,
}: {
  params: LocaleRouteParams;
}): Promise<Metadata> {
  const locale = await getLocaleFromRouteParams(params);
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.notes.metadataTitle,
  };
}

export default async function NotesPage({
  params,
  searchParams,
}: {
  params: LocaleRouteParams;
  searchParams: Promise<{ q?: string }>;
}) {
  const locale = await getLocaleFromRouteParams(params);
  const [dictionary, session] = await Promise.all([
    getDictionary(locale),
    requireUser(locale),
  ]);
  const queryParams = await searchParams;
  const parsed = noteSearchSchema.parse({
    q: queryParams.q ?? "",
  });
  const notes = await getNotes(session.user.id, parsed.q);
  const messages = dictionary.notes;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold">{messages.title}</h1>
        <p className="mt-2 text-muted-foreground">{messages.description}</p>
      </div>
      <NotesManager
        notes={notes}
        query={parsed.q}
        locale={locale}
        messages={messages}
      />
    </div>
  );
}
