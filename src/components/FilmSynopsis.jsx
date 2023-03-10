export default function FilmSynopsis({ synopsis }) {
  return (
    <div className="mb-6 text-zinc-900 dark:text-white">
      <h3 className="mb-1 md:text-lg">Synopsis</h3>
      <p className="font-light">{synopsis ? synopsis : 'N/A'}</p>
    </div>
  )
}
