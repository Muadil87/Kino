import React from 'react';
import MovieCard from './MovieCard';
import './Watchlist.css';

const Watchlist = ({ movies }) => {
  // Mock data for new sections
  const recentActivities = [
    { id: 1, text: 'You added "The Ethereal Frame" to your watchlist', date: '2 hours ago' },
    { id: 2, text: 'You marked "Neon Horizons" as watched', date: 'Yesterday' },
  ];

  const personalizedSuggestions = movies.slice(3, 6);

  return (
    <div className="watchlist-page">
      <header className="page-header">
        <h1 className="page-title">My Watchlist</h1>
        <p className="page-subtitle">Films you're planning to see.</p>
      </header>

      <section className="section">
        <h2 className="section-title">Current Watchlist</h2>
        <div className="movie-grid">
          {movies.slice(0, 3).map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <div className="watchlist-grid-layout">
        <div className="main-content">
          <section className="section">
            <h2 className="section-title">Personalized Suggestions</h2>
            <div className="movie-grid compact">
              {personalizedSuggestions.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>

          <section className="section">
            <h2 className="section-title">Recommended for You</h2>
            <p className="empty-state">Add more films to get better recommendations!</p>
          </section>
        </div>

        <aside className="sidebar">
          <section className="section">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <p className="activity-text">{activity.text}</p>
                  <span className="activity-date">{activity.date}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Watchlist;
