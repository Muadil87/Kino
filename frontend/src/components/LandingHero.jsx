import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, CirclePlay, Compass, MessageSquare, Star, CheckCircle2 } from 'lucide-react'
import { tmdbImage } from '../utils/image'
import './LandingHero.css'

const heroPosters = [
  {
    id: 157336,
    title: 'Interstellar',
    rating: '4.6',
    image: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  },
  {
    id: 693134,
    title: 'Dune: Part Two',
    rating: '4.7',
    image: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
  },
  {
    id: 238,
    title: 'The Godfather',
    rating: '4.8',
    image: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
  },
  {
    id: 244786,
    title: 'Whiplash',
    rating: '4.5',
    image: '/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    rating: '4.8',
    image: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  },
  {
    id: 414906,
    title: 'The Batman',
    rating: '4.4',
    image: '/74xTEgt7R36Fpooo50r9T25onhq.jpg',
  },
]

const posterSlots = ['poster-card-left', 'poster-card-main', 'poster-card-right', 'poster-card-far']

const tasteAvatars = [
  '/b6qUu00iIIkXX13szFy7d0CyNcg.jpg',
  '/3dXw30IwuLxIh4WEFmPYf4JfCyP.jpg',
  '/5XBzD5WuTyVQZeS4VI25z2moMeY.jpg',
  '/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg',
]

export default function LandingHero({ onGetStarted, onExplore }) {
  const [posterOffset, setPosterOffset] = useState(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return undefined

    const id = window.setInterval(() => {
      setPosterOffset((current) => (current + 1) % heroPosters.length)
    }, 5200)

    return () => window.clearInterval(id)
  }, [])

  const visiblePosters = useMemo(() => {
    return posterSlots.map((className, index) => ({
      ...heroPosters[(posterOffset + index) % heroPosters.length],
      className,
    }))
  }, [posterOffset])

  return (
    <section className="landing-hero" aria-label="KINO cinematic landing hero">
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-spotlight" aria-hidden="true" />

      <div className="landing-hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker"><span /> KINO Curated Experience</p>
          <h1 className="hero-title">
            Cinema worth
            <strong> remembering.</strong>
          </h1>
          <p className="hero-subtitle">
            Track films, build watchlists, rate what matters, and discover cinema
            through taste, not algorithms.
          </p>

          <div className="hero-actions">
            <button type="button" className="hero-primary-btn" onClick={onGetStarted}>
              <CirclePlay size={18} fill="currentColor" />
              Start Your Watchlist
            </button>
            <button type="button" className="hero-secondary-btn" onClick={onExplore || onGetStarted}>
              <Compass size={18} />
              Explore Cinema
            </button>
          </div>

          <div className="hero-feature-row" aria-label="KINO features">
            <span><CheckCircle2 size={16} />Track</span>
            <span><Star size={16} />Rate</span>
            <span><MessageSquare size={16} />Review</span>
            <span><Bookmark size={16} />Watchlist</span>
          </div>

          <div className="hero-social-proof">
            <div className="hero-avatar-stack" aria-hidden="true">
              {tasteAvatars.map((avatar) => (
                <img key={avatar} src={tmdbImage(avatar, 'w185')} alt="" />
              ))}
            </div>
            <p><strong>10K+ cinephiles</strong><span>building their taste on KINO</span></p>
          </div>
        </div>

        <div className="hero-poster-stage">
          {visiblePosters.map((poster) => (
            <Link
              key={`${poster.className}-${poster.id}`}
              to={`/movie/${poster.id}`}
              className={`hero-poster-card ${poster.className}`}
              aria-label={`Open ${poster.title}`}
            >
              <img src={tmdbImage(poster.image, 'w500')} alt="" />
              <div className="poster-rating"><Star size={14} fill="currentColor" /> {poster.rating}</div>
              <div className="poster-save"><Bookmark size={21} /></div>
            </Link>
          ))}
          <div className="stage-ring stage-ring-one" />
          <div className="stage-ring stage-ring-two" />
        </div>
      </div>
    </section>
  )
}
