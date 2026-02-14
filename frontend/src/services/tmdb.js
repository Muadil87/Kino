import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Create a configured instance of axios for TMDB
const tmdbClient = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        language: 'en-US'
    }
});

// Helper functions to get data
export const getTrendingMovies = async () => {
    const response = await tmdbClient.get('/trending/movie/week');
    return response.data.results;
};

export const getPopularMovies = async () => {
    const response = await tmdbClient.get('/movie/popular');
    return response.data.results;
};

export const searchMovies = async (query) => {
    const response = await tmdbClient.get('/search/movie', {
        params: { query }
    });
    return response.data.results;
};

export const getMovieDetails = async (id) => {
    const response = await tmdbClient.get(`/movie/${id}`);
    return response.data;
};

export const getMovieCredits = async (id) => {
    const response = await tmdbClient.get(`/movie/${id}/credits`);
    return response.data;
};

export const getMovieVideos = async (id) => {
    const response = await tmdbClient.get(`/movie/${id}/videos`);
    return response.data.results;
};

export const getSimilarMovies = async (id) => {
    const response = await tmdbClient.get(`/movie/${id}/similar`);
    return response.data.results;
};

export const getMovieReviews = async (id) => {
    const response = await tmdbClient.get(`/movie/${id}/reviews`);
    return response.data.results;
};
