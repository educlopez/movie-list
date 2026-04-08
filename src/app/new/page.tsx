import type { Metadata } from "next";
import NewPageContent from "@/components/NewPageContent";

export const metadata: Metadata = {
  title: "Novedades",
  description: "Descubre nuevos estrenos y próximas películas y series",
};

export default function NewPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-zinc-900 dark:text-white">
          Novedades
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Descubre nuevos estrenos y próximos títulos en tus plataformas de streaming
        </p>
      </div>
      <NewPageContent />
    </div>
  );
}
