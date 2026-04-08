import type { Metadata } from "next";
import WatchlistContent from "@/components/WatchlistContent";

export const metadata: Metadata = {
  title: "Mi Lista",
  description:
    "Tu lista personal de peliculas y series guardadas para ver mas tarde",
};

export default function WatchlistPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-zinc-900 dark:text-white">
          Mi Lista
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Tus peliculas y series guardadas para ver mas tarde
        </p>
      </div>
      <WatchlistContent />
    </div>
  );
}
