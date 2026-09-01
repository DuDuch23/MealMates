export default function StatCard({ title, value, icon }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-surface-raised p-4">
      {icon && <div className="text-primary">{icon}</div>}
      <div>
        <h4 className="text-sm text-gray-400">{title}</h4>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  )
}
