import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getGenres, getMoviesByGenre, searchMovies } from '../services/tmdb';
import { tmdbImage } from '../utils/image';
import './Collections.css';

const Collections = ({ isLoggedIn }) => {
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [userCollections, setUserCollections] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('kino_user_collections') || '[]');
    } catch {
      return [];
    }
  });
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [privacy, setPrivacy] = useState('public');
  
  // Movie Search State
  const [movieQuery, setMovieQuery] = useState('');
  const [movieResults, setMovieResults] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genreList = await getGenres();

        if (!genreList) return;

        const genresWithImages = await Promise.all(
          genreList.map(async (genre) => {
            try {
              const movies = await getMoviesByGenre(genre.id);
              let image = null;
              if (movies && movies.length > 0) {
                const moviesWithBackdrop = movies.filter(m => m.backdrop_path);
                if (moviesWithBackdrop.length > 0) {
                  const randomIndex = Math.floor(Math.random() * Math.min(moviesWithBackdrop.length, 20));
                  const randomMovie = moviesWithBackdrop[randomIndex];
                  image = tmdbImage(randomMovie.backdrop_path, "w500");
                }
              }
              
              return { ...genre, image };
            } catch (e) {
              return { ...genre, image: null };
            }
          })
        );

        setGenres(genresWithImages);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateCollection = (e) => {
    e.preventDefault();
    
    const newCollection = {
      id: `user-${Date.now()}`,
      name: collectionName,
      description,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      privacy,
      movies: selectedMovies,
      createdAt: new Date().toISOString()
    };
    
    const updated = [newCollection, ...userCollections];
    setUserCollections(updated);
    localStorage.setItem('kino_user_collections', JSON.stringify(updated));

    resetForm();
  };

  const resetForm = () => {
    setCollectionName('');
    setDescription('');
    setTags('');
    setPrivacy('public');
    setMovieQuery('');
    setMovieResults([]);
    setSelectedMovies([]);
    setShowModal(false);
  };

  const handleMovieSearch = (e) => {
    const query = e.target.value;
    setMovieQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setMovieResults([]);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchMovies(query);
        setMovieResults(results ? results.slice(0, 5) : []); // Limit to 5 results
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce
  };

  const addMovieToCollection = (movie) => {
    if (!selectedMovies.some(m => m.id === movie.id)) {
      setSelectedMovies([...selectedMovies, movie]);
    }
    setMovieQuery('');
    setMovieResults([]);
  };

  const removeMovieFromCollection = (movieId) => {
    setSelectedMovies(selectedMovies.filter(m => m.id !== movieId));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowModal(false);
    }
  };

  return (
    <div className="collections-page">
      <div className="collections-header">
        <div className="header-content">
          <div>
            <h1>Collections</h1>
            <p>Explore cinema by genre and mood.</p>
          </div>
          {isLoggedIn && (
            <button 
              className="btn-create" 
              onClick={() => setShowModal(true)}
            >
              Create Collection
            </button>
          )}
        </div>
      </div>

      <div className="collections-grid">
        {/* User Collections - Only visible if logged in */}
        {isLoggedIn && userCollections.map((collection) => (
          <Link 
            key={collection.id} 
            to={`/collections/${collection.id}/${encodeURIComponent(collection.name)}`}
            className="collection-card user-collection"
          >
            {collection.movies && collection.movies.length > 0 && collection.movies[0].poster_path ? (
               <img 
                 src={tmdbImage(collection.movies[0].poster_path, "w500")}
                 alt={collection.name} 
                 className="card-bg" 
               />
            ) : (
              <div className="card-bg-placeholder" style={{ background: 'linear-gradient(135deg, #1e2029 0%, #17181d 100%)' }}>
                 <div style={{ 
                   position: 'absolute', 
                   top: '50%', 
                   left: '50%', 
                   transform: 'translate(-50%, -50%)', 
                   fontSize: '3rem', 
                   opacity: 0.1,
                   filter: 'grayscale(100%)' 
                 }}>📁</div>
              </div>
            )}
            
            <div className="card-overlay">
              <h3>{collection.name}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {collection.movies ? collection.movies.length : 0} items • {collection.privacy}
              </p>
            </div>
          </Link>
        ))}

        {loading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="collection-card" style={{ border: 'none' }}>
              <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: '12px' }}></div>
            </div>
          ))
        ) : (
          genres.map((genre) => (
            <Link 
              key={genre.id} 
              to={`/collections/${genre.id}/${encodeURIComponent(genre.name)}`}
              className="collection-card"
            >
              {genre.image ? (
                <img src={genre.image} alt={genre.name} className="card-bg" />
              ) : (
                <div className="card-bg-placeholder"></div>
              )}
              
              <div className="card-overlay">
                <h3>{genre.name}</h3>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Create Collection Modal */}
      {showModal && (
        <div 
          className="modal-backdrop" 
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          // Make div focusable to catch keydown events if clicked
          tabIndex={-1} 
        >
          <div className="modal-content" role="dialog" aria-modal="true">
            <div className="modal-header">
              <h2>New Collection</h2>
            </div>
            <form onSubmit={handleCreateCollection} className="collection-form">
              <div className="modal-body-grid">
                {/* Left Column */}
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      value={collectionName} 
                      onChange={(e) => setCollectionName(e.target.value)}
                      required 
                      autoFocus
                      placeholder="My Awesome List"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="tags">Tags</label>
                    <input 
                      type="text" 
                      id="tags" 
                      value={tags} 
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="horror, 80s, favorites..."
                    />
                    <small className="form-hint">Press Enter to create a tag</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="privacy">Who can view</label>
                    <div className="select-wrapper">
                      <select 
                        id="privacy" 
                        value={privacy} 
                        onChange={(e) => setPrivacy(e.target.value)}
                      >
                        <option value="public">Anyone — Public list</option>
                        <option value="friends">Friends only</option>
                        <option value="private">Just me — Private</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-check">
                    <input type="checkbox" id="ranked" />
                    <label htmlFor="ranked">Ranked list</label>
                  </div>
                </div>

                {/* Right Column */}
                <div className="form-column">
                  <div className="form-group full-height">
                    <label htmlFor="description">Description</label>
                    <textarea 
                      id="description" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a description..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Add a Film Section */}
              <div className="add-film-section">
                <label>Add Movies</label>
                <div className="add-film-input-wrapper">
                  <div className="add-film-input">
                    <span className="search-icon">🔍</span>
                    <input 
                      type="text" 
                      placeholder="Search for a movie..." 
                      value={movieQuery}
                      onChange={handleMovieSearch}
                    />
                    {isSearching && <div className="spinner-small"></div>}
                  </div>
                  
                  {/* Search Results Dropdown */}
                  {movieResults.length > 0 && (
                    <div className="search-results-dropdown">
                      {movieResults.map(movie => (
                        <div 
                          key={movie.id} 
                          className="search-result-item"
                          onClick={() => addMovieToCollection(movie)}
                        >
                          <img 
                            src={tmdbImage(movie.poster_path, "w92")} 
                            alt={movie.title} 
                          />
                          <div className="result-info">
                            <span className="result-title">{movie.title}</span>
                            <span className="result-year">{movie.release_date ? movie.release_date.split('-')[0] : ''}</span>
                          </div>
                          <span className="plus-icon">+</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Movies List */}
                {selectedMovies.length > 0 && (
                  <div className="selected-movies-list">
                    {selectedMovies.map(movie => (
                      <div key={movie.id} className="selected-movie-chip">
                        <span>{movie.title}</span>
                        <button 
                          type="button" 
                          className="remove-movie-btn"
                          onClick={() => removeMovieFromCollection(movie.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">Create Collection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collections;
