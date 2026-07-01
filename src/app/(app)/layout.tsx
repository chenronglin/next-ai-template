import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/server/require-user";

export default async function ProtectedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();

  return <AppShell user={session.user}>{children}</AppShell>;
}
