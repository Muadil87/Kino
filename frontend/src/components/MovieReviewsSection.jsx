import React, { useState } from 'react'
import './MovieReviewsSection.css'

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

  // Take top 4 reviews for a balanced grid
  const displayReviews = reviews.slice(0, 4)

  return (
    <div className="reviews-section">
      <h2 className="section-title">Critique</h2>
      
      {displayReviews.length > 0 ? (
        <div className="reviews-grid">
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
                  <div className="review-author">
                    <span>Written by</span> {review.author}
                  </div>
                  {review.author_details?.rating && (
                    <div className="review-rating">
                      ★ {review.author_details.rating}/10
                    </div>
                  )}
                </div>
                
                <div className="review-content">
                  <p>{displayContent}</p>
                  {shouldTruncate && (
                    <button 
                      className="review-expand-btn" 
                      onClick={() => toggleExpand(review.id)}
                    >
                      {isExpanded ? 'Collapse' : 'Read Full Review'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="no-reviews">No editorial reviews available.</div>
      )}
    </div>
  )
}
