import { Skeleton } from "@/components/ui/skeleton";

export default function NotesLoading() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
