import { activityHeadline } from '../utils/activity'

export default function ActivityCard({ event }) {
  return (
    <article className="kino-panel post-card">
      <p className="post-author">{activityHeadline(event)}</p>
      {event?.movie?.title && <p className="social-feature-text">{event.movie.title}</p>}
      {event?.community?.name && <p className="social-muted">Community: {event.community.name}</p>}
    </article>
  )
}
