import { describe, it, expect } from 'vitest'
import { compactMetricsStyles } from '../ui/layoutMetrics'
import React from 'react'
import { render, screen } from '@testing-library/react'
import MovieDetail from '../components/MovieDetail'

const sampleMovie = {
  id: 1,
  title: 'Sample',
  release_date: '2024-01-01',
  vote_average: 6.2,
  vote_count: 1240,
  poster_path: '/x.jpg',
  backdrop_path: '/b.jpg',
  overview: 'Overview',
  original_language: 'en',
  runtime: 111,
  genres: [{ name: 'Comedy' }],
}

describe('compactMetricsStyles', () => {
  it('returns 8px gap across breakpoints (±1px tolerance)', () => {
    const widths = [375, 768, 1280]
    widths.forEach(w => {
      const s = compactMetricsStyles(w)
      const gap = parseInt(String(s.container.gap).replace('px', ''), 10)
      expect(Math.abs(gap - 8)).toBeLessThanOrEqual(1)
    })
  })

  it('icons are 16 × 16 px', () => {
    const s = compactMetricsStyles(1024)
    expect(s.icon.width).toBe(16)
    expect(s.icon.height).toBe(16)
  })
})

describe('MovieDetail compact metrics placement', () => {
  it('renders labels with badges directly beneath, aligned horizontally with 8px gap', () => {
    render(
      <MovieDetail
        movies={[sampleMovie]}
        onToggleFavorite={() => {}}
        onToggleWatchlist={() => {}}
        isFavorite={() => false}
        isInWatchlist={() => false}
      />
    )

    const container = screen.getByText('Rating').closest('.compact-metrics')
    expect(container).toBeTruthy()
    const style = container.style
    expect(parseInt(style.gap || '8', 10)).toBeGreaterThanOrEqual(7)
    expect(parseInt(style.gap || '8', 10)).toBeLessThanOrEqual(9)

    const labels = screen.getAllByText(/Rating|Votes|Language/)
    labels.forEach(label => {
      const item = label.closest('.metric-item')
      const badge = item.querySelector('.metric-badge')
      expect(item).toBeTruthy()
      expect(badge).toBeTruthy()
      const svg = badge.querySelector('svg')
      expect(svg.getAttribute('width')).toBe('16')
      expect(svg.getAttribute('height')).toBe('16')
    })
  })
})
