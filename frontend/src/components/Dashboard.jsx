import React, { useMemo, useState } from 'react';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';
import './Dashboard.css';

const MOODS = [
  { name: 'Noir Tension', genres: [53, 80, 9648] },
  { name: 'Quiet Character Study', genres: [18] },
  { name: 'Adrenaline Rush', genres: [28, 12] },
  { name: 'Warm Nostalgia', genres: [10751, 16, 35] },
  { name: 'Mind-Bending', genres: [878, 14, 9648] },
]

const Dashboard = ({ movies }) => {
  const [activeMood, setActiveMood] = useState(MOODS[0].name)

  const moodMovies = useMemo(() => {
    const mood = MOODS.find((m) => m.name === activeMood) || MOODS[0]
    const filtered = (movies || []).filter((movie) =>
      (movie.genre_ids || []).some((id) => mood.genres.includes(id)),
    )
    return filtered.length > 0 ? filtered : movies
  }, [activeMood, movies])

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
          {MOODS.map((mood) => (
            <button
              key={mood.name}
              className={`mood-pill ${activeMood === mood.name ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveMood(mood.name)}
            >
              {mood.name}
            </button>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="trending-section">
        <div className="section-header">
          <h2 className="section-title">Trending</h2>
          <p className="section-subtitle">
            {activeMood} picks from what is trending right now.
          </p>
        </div>
        <div className="movie-grid">
          {moodMovies.slice(0, 12).map(movie => (
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
           {moodMovies.slice(2, 5).map((movie) => (
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
          {moodMovies.slice(6, 12).map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  )
};

export default Dashboard;
