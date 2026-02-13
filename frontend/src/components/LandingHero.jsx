import React from 'react'
import './LandingHero.css'

export default function LandingHero({ onGetStarted }) {
  return (
    <div className="landing-hero">
      <div className="landing-hero-overlay"></div>
      <div className="landing-hero-content">
        <h1 className="landing-title">
          Track films you've watched.<br />
          Save those you want to see.<br />
          Tell your friends what's good.
        </h1>
        <div className="landing-cta">
          <button className="get-started-btn" onClick={onGetStarted}>Get started — it's free!</button>
        </div>
        <p className="landing-subtext">
          The social network for film lovers. Also available on <span className="device-link">iOS</span> and <span className="device-link">Android</span>.
        </p>
      </div>
    </div>
  )
}
