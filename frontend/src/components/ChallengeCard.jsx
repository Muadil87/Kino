export default function ChallengeCard({ challenge }) {
  return (
    <article className="kino-panel challenge-card">
      <h4>{challenge.title}</h4>
      <p>{challenge.description || 'No description.'}</p>
      <p className="post-author">Target: {challenge.target_count} movies · {challenge.month_key || 'Open'}</p>
    </article>
  )
}

