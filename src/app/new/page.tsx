import type { Metadata } from "next";
import NewPageContent from "@/components/NewPageContent";

export const metadata: Metadata = {
  title: "New & Upcoming",
  description: "Discover new releases and upcoming movies and TV shows",
};

export default function NewPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-zinc-900 dark:text-white">
          New & Upcoming
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Discover new releases and upcoming titles on your streaming platforms
        </p>
      </div>
      <NewPageContent />
    </div>
  );
}
