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
        <h1 className="hero-title">
          Curate Your <span className="highlight-text">Cinema.</span>
        </h1>
        <p className="hero-subtitle">
          The ultimate destination for film enthusiasts. <br />
          Discover hidden gems, build your collection, and share your taste.
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
