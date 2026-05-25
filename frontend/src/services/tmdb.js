import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const hasApiKey = Boolean(API_KEY);

// Create a configured instance of axios for TMDB
const tmdbClient = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        language: 'en-US'
    }
});

const ensureApiKey = () => {
    if (!hasApiKey) {
        throw new Error('TMDB API key missing. Set VITE_TMDB_API_KEY in frontend/.env');
    }
};

// Helper functions to get data
export const getTrendingMovies = async () => {
    ensureApiKey();
    const response = await tmdbClient.get('/trending/movie/week');
    return response.data.results;
};

export const getPopularMovies = async (page = 1) => {
    ensureApiKey();
    const response = await tmdbClient.get('/movie/popular', {
        params: { page }
    });
    return response.data;
};

export const discoverMovies = async ({
    page = 1,
    sortBy = 'popularity.desc',
    withGenres,
    releaseDateGte,
    releaseDateLte,
    voteAverageGte,
    query,
} = {}) => {
    ensureApiKey();

    if (query && query.trim()) {
        const response = await tmdbClient.get('/search/movie', {
            params: {
                query: query.trim(),
                page,
                include_adult: false,
                ...(releaseDateGte ? { primary_release_date_gte: releaseDateGte } : {}),
                ...(releaseDateLte ? { primary_release_date_lte: releaseDateLte } : {}),
            },
        });
        return response.data;
    }

    const response = await tmdbClient.get('/discover/movie', {
        params: {
            page,
            sort_by: sortBy,
            include_adult: false,
            include_video: false,
            ...(withGenres ? { with_genres: withGenres } : {}),
            ...(releaseDateGte ? { 'primary_release_date.gte': releaseDateGte } : {}),
            ...(releaseDateLte ? { 'primary_release_date.lte': releaseDateLte } : {}),
            ...(voteAverageGte ? { 'vote_average.gte': voteAverageGte } : {}),
        },
    });

    return response.data;
};

export const getNowPlayingMovies = async (page = 1) => {
    ensureApiKey();
    const response = await tmdbClient.get('/movie/now_playing', {
        params: { page }
    });
    return response.data;
};

export const getUpcomingMovies = async (page = 1) => {
    ensureApiKey();
    const response = await tmdbClient.get('/movie/upcoming', {
        params: { page }
    });
    return response.data;
};

export const searchMovies = async (query) => {
    ensureApiKey();
    const response = await tmdbClient.get('/search/movie', {
        params: { query }
    });
    return response.data.results;
};

export const getMovieDetails = async (id) => {
    ensureApiKey();
    const response = await tmdbClient.get(`/movie/${id}`);
    return response.data;
};

export const searchPeople = async (query) => {
    ensureApiKey();
    const response = await tmdbClient.get('/search/person', {
        params: { query }
    });
    return response.data.results;
};

export const getMovieCredits = async (id) => {
    ensureApiKey();
    const response = await tmdbClient.get(`/movie/${id}/credits`);
    return response.data;
};

export const getMovieVideos = async (id) => {
    ensureApiKey();
    const response = await tmdbClient.get(`/movie/${id}/videos`);
    return response.data.results;
};

export const getSimilarMovies = async (id) => {
    ensureApiKey();
    const response = await tmdbClient.get(`/movie/${id}/similar`);
    return response.data.results;
};

export const getMovieReviews = async (id) => {
    ensureApiKey();
    const response = await tmdbClient.get(`/movie/${id}/reviews`);
    return response.data.results;
};

// 1. Get the list of official Genres (Action, Horror, Comedy, etc.) 
export const getGenres = async () => { 
  ensureApiKey();
  const response = await tmdbClient.get('/genre/movie/list'); 
  return response.data.genres; 
}; 

// 2. Get a list of movies for a specific genre (so we can steal a cover image) 
export const getMoviesByGenre = async (genreId) => { 
  ensureApiKey();
  const response = await tmdbClient.get('/discover/movie', { 
    params: { 
      with_genres: genreId, 
      sort_by: 'popularity.desc', // Get the most popular ones 
      include_adult: false 
    } 
  }); 
  return response.data.results; 
};

export const getMovieProviders = async (id) => {
    ensureApiKey();
    const response = await tmdbClient.get(`/movie/${id}/watch/providers`);
    return response.data.results;
};
