import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
