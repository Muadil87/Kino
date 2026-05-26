export const formatEventType = (type) => {
  const label = String(type || '').replaceAll('_', ' ').trim()
  if (!label) return 'activity'
  return label
}

const safeMovieTitle = (event) => event?.movie?.title || 'a movie'

export const activityHeadline = (event) => {
  const actor = event?.actor?.name || 'Member'
  const type = event?.event_type
  const movieTitle = safeMovieTitle(event)

  switch (type) {
    case 'review_created':
      return `${actor} reviewed ${movieTitle}`
    case 'watchlist_added':
      return `${actor} added ${movieTitle} to watchlist`
    case 'favorite_added':
      return `${actor} favorited ${movieTitle}`
    case 'movie_watched':
      return `${actor} watched ${movieTitle}`
    case 'movie_rated':
      return `${actor} rated ${movieTitle}`
    case 'movie_recommended':
      return `${actor} recommended ${movieTitle}`
    case 'community_post_created':
      return `${actor} shared a community post`
    case 'community_comment_created':
      return `${actor} commented in community`
    case 'challenge_started':
      return `${actor} started a challenge`
    case 'challenge_completed':
      return `${actor} completed a challenge`
    default:
      return `${actor} ${formatEventType(type)}`
  }
}

export const activityDetail = (event) => {
  const type = event?.event_type

  if (type === 'review_created' && event?.metadata?.rating) {
    return `Rating: ${event.metadata.rating}/5`
  }

  if (type === 'movie_recommended' && event?.metadata?.to_user_id) {
    return 'New recommendation shared'
  }

  if (type === 'movie_rated' && event?.metadata?.rating) {
    return `Rating: ${event.metadata.rating}/5`
  }

  if (event?.community?.name) {
    return `Community: ${event.community.name}`
  }

  return ''
}
