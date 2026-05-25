export const formatEventType = (type) => {
  const label = String(type || '').replaceAll('_', ' ').trim()
  if (!label) return 'activity'
  return label
}

export const activityHeadline = (event) => {
  const actor = event?.actor?.name || 'Member'
  return `${actor} · ${formatEventType(event?.event_type)}`
}
