/** Carte fantôme affichée pendant le chargement des offres. */
export default function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col gap-3 rounded-2xl bg-surface-raised p-3">
      <div className="h-40 w-full rounded-xl bg-gray-600 md:h-52 lg:h-60" />
      <div className="h-5 w-4/5 rounded bg-gray-600" />
      <div className="h-6 w-28 rounded-full bg-gray-600" />
    </div>
  )
}
