"use client";

export default function NewError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Algo salio mal
      </h2>
      <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
        {error.message || "Ha ocurrido un error inesperado."}
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-black"
      >
        Reintentar
      </button>
    </div>
  );
}
