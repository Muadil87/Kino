# Recommendation System Documentation

## Overview
The recommendation system in Kino provides personalized movie suggestions based on the user's current watchlist. It utilizes a content-based filtering approach, leveraging the TMDB (The Movie Database) API to find movies similar to those the user has expressed interest in.

## "Personalized Suggestions" Definition
In the context of Kino's Watchlist, "personalized suggestions" are defined as:
*   **Content-Based:** Suggestions are derived directly from the attributes (genre, keywords, cast, etc.) of movies currently in the user's watchlist.
*   **Recency-Weighted:** The system prioritizes the most recently added movie to ensure recommendations reflect the user's latest interests.
*   **Deduplicated:** Movies already present in the user's watchlist are strictly filtered out from the suggestions to ensure discovery of *new* content.

## Recommendation Pipeline

The recommendation process follows these steps:

1.  **Trigger:**
    *   The pipeline is triggered automatically whenever the `movies` (watchlist) state changes. This includes adding or removing a movie.
    *   Implemented via a React `useEffect` hook monitoring the `movies` dependency.

2.  **Data Source Selection:**
    *   The system identifies the **last added movie** in the watchlist array (`movies[movies.length - 1]`).
    *   This movie serves as the "seed" for finding similar content.

3.  **Data Retrieval (TMDB API):**
    *   The system calls the `getSimilarMovies(id)` service function.
    *   **Endpoint:** `GET /movie/{movie_id}/similar` (TMDB API).
    *   This endpoint returns a list of movies that share similar keywords, genres, and themes with the seed movie.

4.  **Filtering & Ranking:**
    *   **Deduplication:** The raw list from TMDB is filtered to remove any movies that are *already* in the user's watchlist.
        *   Logic: `results.filter(rec => !watchlist.some(m => m.id === rec.id))`
    *   **Ranking:** The TMDB API returns results ranked by similarity score. The system preserves this order.
    *   **Truncation:** The top 6 results after filtering are selected for display (`slice(0, 6)`).

5.  **State Update & UI Rendering:**
    *   The final list of 6 movies is stored in the `recommendations` state.
    *   The UI renders these movies in a "Recommended for You" section below the watchlist.
    *   If the watchlist is empty, the recommendations are cleared.

## Technical Implementation Details
*   **Component:** `src/components/Watchlist.jsx`
*   **Service:** `src/services/tmdb.js`
*   **State Management:** React `useState` and `useEffect`.

## Future Improvements (Potential)
*   **Hybrid Filtering:** Combine multiple movies from the watchlist to generate a weighted recommendation query instead of relying solely on the last added movie.
*   **Collaborative Filtering:** Incorporate user ratings (if added) to find users with similar tastes.
