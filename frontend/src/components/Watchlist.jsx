import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';
import { getSimilarMovies } from '../services/tmdb';
import './Watchlist.css';

const Watchlist = ({ watchlist, history, onRemoveFromWatchlist, onRemoveFromHistory, onMoveToHistory }) => {
  const [activeTab, setActiveTab] = useState('watchlist'); // 'watchlist' or 'history'
  const [recommendations, setRecommendations] = useState([]);

  // Decide which list to show
  const currentList = activeTab === 'watchlist' ? watchlist : history;

  const handleMarkWatched = (movie) => {
    if (onMoveToHistory) {
      onMoveToHistory(movie);
      // alert(`Moved '${movie.title}' to History!`); // Optional: Handled by UI or parent
    }
  };

  const handleRemove = (movie) => {
    if (activeTab === 'watchlist' && onRemoveFromWatchlist) {
      onRemoveFromWatchlist(movie);
    } else if (activeTab === 'history' && onRemoveFromHistory) {
      onRemoveFromHistory(movie);
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      // Only fetch recommendations based on watchlist for now
      if (!watchlist || watchlist.length === 0) {
        setRecommendations([]);
        return;
      }

      try {
        // Get the most recently added movie (last in the array)
        const lastAddedMovie = watchlist[watchlist.length - 1];
        if (!lastAddedMovie?.id) return;

        const similar = await getSimilarMovies(lastAddedMovie.id);
        
        // Filter out movies already in watchlist or history
        const filtered = similar.filter(
          rec => !watchlist.some(m => m.id === rec.id) && (!history || !history.some(h => h.id === rec.id))
        );

        setRecommendations(filtered.slice(0, 12));
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [watchlist, history]);

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <h1 className="page-title">My Library</h1>
        
        {/* THE TABS */}
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`} 
            onClick={() => setActiveTab('watchlist')}
          >
            Watchlist <span className="count">({(watchlist || []).length})</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} 
            onClick={() => setActiveTab('history')}
          >
            History <span className="count">({(history || []).length})</span>
          </button>
        </div>
      </div>

      <div className="watchlist-content">
        {/* <h2 className="section-title">{activeTab === 'watchlist' ? "Current Watchlist" : "Watched History"}</h2> */}
        
        {(!currentList || currentList.length === 0) ? (
          <div className="empty-state">
            <h3>{activeTab === 'watchlist' ? "Your Watchlist is Empty" : "No History Yet"}</h3>
            <p>
              {activeTab === 'watchlist' 
                ? "Browse movies and add them to your list to keep track of what you want to watch." 
                : "Movies you mark as watched will appear here."}
            </p>
            {activeTab === 'watchlist' && (
              <Link to="/dashboard" className="btn-primary favorites-empty-btn">
                Browse Movies
              </Link>
            )}
          </div>
        ) : (
          <div className="movie-grid">
            {currentList.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onRemove={handleRemove}
                onMarkWatched={activeTab === 'watchlist' ? handleMarkWatched : null}
              />
            ))}
          </div>
        )}
      </div>

      {/* Only show recommendations on Watchlist tab */}
      {activeTab === 'watchlist' && (
        <div className="watchlist-content recommendations-section">
          <h2 className="section-title">Recommended for You</h2>
          {recommendations.length > 0 ? (
            <div className="movie-grid compact">
              {recommendations.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="empty-state recommendations-empty">
              <p>Add more films to get better recommendations!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
