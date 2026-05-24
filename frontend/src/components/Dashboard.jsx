import React from 'react';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';
import './Dashboard.css';

const Dashboard = ({ movies }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="dashboard-container">
        <section className="trending-section">
          <div className="section-header">
            <h2 className="section-title">Trending</h2>
            <div className="skeleton" style={{ width: '300px', height: '1.2em', marginTop: '0.5rem' }}></div>
          </div>
          <div className="movie-grid">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <section className="trending-section">
        <div className="section-header">
          <div>
            <p className="kino-overline">Mood Discovery</p>
            <h2 className="section-title">Pick a Tonight Mood</h2>
          </div>
          <p className="section-subtitle">Jump into curated tones and discover films that match your headspace.</p>
        </div>
        <div className="mood-row">
          {['Noir Tension', 'Quiet Character Study', 'Adrenaline Rush', 'Warm Nostalgia', 'Mind-Bending'].map((mood) => (
            <button key={mood} className="mood-pill" type="button">{mood}</button>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="trending-section">
        <div className="section-header">
          <h2 className="section-title">Trending</h2>
          <p className="section-subtitle">Discover the most popular movies everyone is talking about.</p>
        </div>
        <div className="movie-grid">
          {movies.slice(0, 12).map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Staff Picks Section */}
      <section className="staff-picks-section">
        <div className="section-header">
          <h2 className="section-title">Staff Picks</h2>
          <p className="section-subtitle">Curated selection of must-watch films handpicked for you.</p>
        </div>
        <div className="picks-grid">
           {movies.slice(4, 7).map((movie) => (
             <MovieCard key={movie.id} movie={movie} />
           ))}
        </div>
      </section>

      <section className="staff-picks-section">
        <div className="section-header">
          <h2 className="section-title">Editorial Spotlight</h2>
          <p className="section-subtitle">A rotating column of visually iconic and critically loved films.</p>
        </div>
        <div className="movie-grid">
          {movies.slice(8, 14).map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  )
};

export default Dashboard;
