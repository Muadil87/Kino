export default function CinematicSection({ overline, title, subtitle, action, children, className = '' }) {
  return (
    <section className={`trending-section reveal-section ${className}`.trim()}>
      <div className="section-header">
        <div>
          {overline && <p className="kino-overline">{overline}</p>}
          <h2 className="section-title">{title}</h2>
        </div>
        <div>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
          {action}
        </div>
      </div>
      {children}
    </section>
  )
}
