import { activityDetail, activityHeadline } from '../utils/activity'

export default function ActivityCard({ event }) {
  const detail = activityDetail(event)

  return (
    <article className="kino-panel post-card">
      <p className="social-feature-text">{activityHeadline(event)}</p>
      {detail && <p className="social-muted">{detail}</p>}
    </article>
  )
}
