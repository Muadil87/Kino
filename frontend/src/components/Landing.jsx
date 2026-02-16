import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import LandingHero from './LandingHero';
import MovieCard from './MovieCard';
import './Landing.css';

import SkeletonCard from './SkeletonCard';

const Landing = ({ movies, onGetStarted }) => {
  const trendingRef = useRef(null);
  const location = useLocation();

  const scrollToTrending = () => {
    trendingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle hash navigation (e.g. from Navbar)
  useEffect(() => {
    if (location.hash === '#trending') {
      // Small timeout to ensure render is complete
      setTimeout(scrollToTrending, 100);
    }
  }, [location]);

  return (
    <div className="landing-page">
      <LandingHero onGetStarted={onGetStarted} onExplore={scrollToTrending} />
      
      <section ref={trendingRef} id="trending" className="section landing-trending-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Trending Now</h2>
            <p className="section-subtitle">Catch up on the hottest movies everyone is watching.</p>
          </div>
          
          {movies && movies.length > 0 ? (
            <div className="movie-grid">
              {movies.slice(0, 12).map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="movie-grid">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Landing;
