import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMoviesByGenre } from '../services/tmdb';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';
import './Collections.css';

const CollectionDetail = ({ isLoggedIn }) => {
  const { id, name } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backdrop, setBackdrop] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        // Check if it's a user collection
        if (id.startsWith('user-')) {
          if (!isLoggedIn) {
            navigate('/login');
            return;
          }
          const userCollections = JSON.parse(localStorage.getItem('kino_user_collections') || '[]');
          const collection = userCollections.find(c => c.id === id);
          
          if (collection) {
            setMovies(collection.movies || []);
            setDescription(collection.description || `A curated list of ${collection.movies.length} movies.`);
            
            // Set backdrop from first movie if available
            if (collection.movies && collection.movies.length > 0) {
              const movieWithBackdrop = collection.movies.find(m => m.backdrop_path);
              if (movieWithBackdrop) {
                setBackdrop(`https://image.tmdb.org/t/p/original${movieWithBackdrop.backdrop_path}`);
              }
            }
          }
        } else {
          // It's a genre
          const results = await getMoviesByGenre(id);
          setMovies(results || []);
          setDescription('Explore the best movies in this genre.');
          
          // Select a random backdrop from the results
          if (results && results.length > 0) {
            const moviesWithBackdrop = results.filter(m => m.backdrop_path);
            if (moviesWithBackdrop.length > 0) {
              const randomMovie = moviesWithBackdrop[Math.floor(Math.random() * moviesWithBackdrop.length)];
              setBackdrop(`https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}`);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching collection movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [id]);

  if (loading) {
    return (
      <div className="collection-detail-page">
        {/* Skeleton Hero */}
        <div className="collection-hero skeleton" style={{ backgroundImage: 'none' }}></div>
        
        {/* Skeleton Grid */}
        <div className="section" style={{ padding: '0 5%' }}>
          <div className="movie-grid">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="collection-detail-page">
      {/* Hero Header */}
      <div 
        className="collection-hero" 
        style={{ 
          backgroundImage: backdrop ? `url(${backdrop})` : 'none',
          backgroundColor: backdrop ? 'transparent' : 'var(--background-secondary)'
        }}
      >
        <div className="collection-hero-content">
          <h1 className="genre-title">{decodeURIComponent(name)}</h1>
          <p className="genre-subtitle">{description}</p>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="section" style={{ padding: '0 5%' }}>
        <div className="movie-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {movies.length === 0 && !loading && (
          <div className="empty-state">
            <h3>No movies found</h3>
            <p>This collection is empty. Go back and add some movies!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;
