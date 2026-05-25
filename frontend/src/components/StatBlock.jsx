export default function StatBlock({ label, value }) {
  return (
    <div className="kino-panel social-panel-dark stat-block">
      <p className="social-kpi-label">{label}</p>
      <p className="social-kpi-value">{value}</p>
    </div>
  )
}
