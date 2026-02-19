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
    </div>
  )
};

export default Dashboard;
