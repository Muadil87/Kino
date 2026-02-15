/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Watchlist from '../components/Watchlist';
import { getSimilarMovies } from '../services/tmdb';
import { BrowserRouter } from 'react-router-dom';

// Mock getSimilarMovies
vi.mock('../services/tmdb', () => ({
  getSimilarMovies: vi.fn(),
}));

const mockMovies = [
  { id: 1, title: 'Movie 1', poster_path: '/p1.jpg', release_date: '2023-01-01' },
  { id: 2, title: 'Movie 2', poster_path: '/p2.jpg', release_date: '2023-01-02' },
];

const mockRecommendations = [
  { id: 3, title: 'Rec 1', poster_path: '/r1.jpg', release_date: '2023-02-01' },
  { id: 4, title: 'Rec 2', poster_path: '/r2.jpg', release_date: '2023-02-02' },
  { id: 5, title: 'Rec 3', poster_path: '/r3.jpg', release_date: '2023-02-03' },
  { id: 6, title: 'Rec 4', poster_path: '/r4.jpg', release_date: '2023-02-04' },
  { id: 7, title: 'Rec 5', poster_path: '/r5.jpg', release_date: '2023-02-05' },
  { id: 8, title: 'Rec 6', poster_path: '/r6.jpg', release_date: '2023-02-06' },
  { id: 1, title: 'Movie 1', poster_path: '/p1.jpg', release_date: '2023-01-01' }, // Duplicate
];

describe('Watchlist Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and displays recommendations', async () => {
    getSimilarMovies.mockResolvedValue(mockRecommendations);

    render(
      <BrowserRouter>
        <Watchlist movies={mockMovies} />
      </BrowserRouter>
    );

    // Wait for recommendations to load
    await waitFor(() => {
      expect(getSimilarMovies).toHaveBeenCalledWith(2);
    });

    expect(screen.getByText('Recommended for You')).toBeInTheDocument();
    expect(screen.getByText('Rec 1')).toBeInTheDocument();
    
    // Check duplicate filtering
    const movie1Elements = screen.getAllByText('Movie 1');
    // Movie 1 is in the watchlist (rendered once)
    // Movie 1 is in recommendations (should be filtered out)
    // So it should appear exactly once (in watchlist)
    expect(movie1Elements.length).toBe(1);
  });
});
