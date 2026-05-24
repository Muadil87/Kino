import React from 'react'
import { tmdbImage } from '../utils/image'
import './LandingHero.css'

const LandingHero = ({ onGetStarted, onExplore }) => {
  return (
    <div className="landing-hero">
      <img 
        src={tmdbImage("/tmU7GeKVybMWFButWEGl2M4GeiP.jpg", "w1280")}
        alt="The Godfather - Don Corleone's Study" 
        className="hero-bg-image"
        loading="eager"
        onError={(e) => { e.target.style.display = 'none' }} 
      />
      <div className="landing-content">
        <p className="hero-kicker">KINO Curated Experience</p>
        <h1 className="hero-title">
          Discover films with
          <span className="highlight-text"> intention.</span>
        </h1>
        <p className="hero-subtitle">
          A premium discovery platform for viewers who care about mood, craft,
          and storytelling. Build watchlists, save favorites, and explore what
          is defining cinema right now.
        </p>
        
        <div className="hero-actions">
          <button className="btn-primary" onClick={onGetStarted}>
            Join the Club
          </button>
          <button className="btn-secondary" onClick={onExplore || onGetStarted}>
            Explore Trending
          </button>
        </div>

        {/* Removed the iOS/Android text entirely! */}
      </div>
      
      {/* A dark gradient overlay to make text pop */}
      <div className="hero-overlay"></div>
    </div>
  )
}

export default LandingHero
