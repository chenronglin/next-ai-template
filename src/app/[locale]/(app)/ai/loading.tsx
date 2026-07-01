import { Skeleton } from "@/components/ui/skeleton";

export default function AiLoading() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
