import React from 'react'

export function MovieTrailerSection({ videos }) {
  if (!videos || videos.length === 0) return null

  // Prefer official trailer
  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') 
    || videos.find(v => v.type === 'Teaser' && v.site === 'YouTube')
    || videos[0] // Fallback to first video if no trailer/teaser found

  if (!trailer || trailer.site !== 'YouTube') return null

  const embedUrl = `https://www.youtube.com/embed/${trailer.key}`

  return (
    <div className="content-section">
      <h2 className="section-title">Trailer</h2>
      <div className="video-container">
        <iframe
          src={embedUrl}
          title={trailer.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
