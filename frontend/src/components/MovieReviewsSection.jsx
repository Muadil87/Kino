import React, { useState } from 'react'

export function MovieReviewsSection({ reviews, isLoading }) {
  const [expandedMap, setExpandedMap] = useState({})

  if (isLoading && !reviews) return <div className="loading-message">Loading reviews...</div>
  if (!reviews || reviews.length === 0) return null

  const toggleExpand = (id) => {
    setExpandedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Take top 5 reviews
  const displayReviews = reviews.slice(0, 5)

  return (
    <div className="content-section">
      <h2 className="section-title">Reviews</h2>
      <div className="reviews-list">
        {displayReviews.map(review => {
          const isExpanded = expandedMap[review.id]
          const content = review.content
          const shouldTruncate = content.length > 300
          const displayContent = !isExpanded && shouldTruncate 
            ? content.slice(0, 300) + '...' 
            : content

          return (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <span className="review-author">A review by {review.author}</span>
                {review.author_details?.rating && (
                  <span className="meta-badge badge-rating" style={{fontSize: '0.8rem'}}>
                    ★ {review.author_details.rating}/10
                  </span>
                )}
              </div>
              <div className="review-content">
                <p>{displayContent}</p>
                {shouldTruncate && (
                  <button 
                    className="btn-secondary" 
                    style={{marginTop: '0.5rem', padding: '0.2rem 0.5rem', fontSize: '0.8rem'}}
                    onClick={() => toggleExpand(review.id)}
                  >
                    {isExpanded ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
