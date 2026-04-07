export default function CardSkeleton({ count = 7 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div className="flex-none" key={`skeleton-${i.toString()}`}>
          <div className="h-[225px] w-[150px] animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-2 h-3 w-[120px] animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-1 h-3 w-[80px] animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}
