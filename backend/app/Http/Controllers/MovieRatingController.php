<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\UserMovieRating;
use App\Services\CinemaIdentityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class MovieRatingController extends Controller
{
    public function __construct(private readonly CinemaIdentityService $identity)
    {
    }

    public function show(Request $request, int $tmdbId)
    {
        if (!Schema::hasTable('user_movie_ratings')) {
            return response()->json(['data' => ['rating' => null]]);
        }

        $movie = Movie::where('tmdb_id', $tmdbId)->first();
        if (!$movie) {
            return response()->json(['data' => ['rating' => null]]);
        }

        $rating = UserMovieRating::where('user_id', $request->user()->id)
            ->where('movie_id', $movie->id)
            ->first();

        return response()->json([
            'data' => [
                'rating' => $rating?->rating,
            ],
        ]);
    }

    public function upsert(Request $request, int $tmdbId)
    {
        if (!Schema::hasTable('user_movie_ratings')) {
            return response()->json([
                'message' => 'Movie ratings are temporarily unavailable until migrations are up to date.',
            ], 503);
        }

        $fields = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:255',
            'poster_path' => 'nullable|string|max:255',
            'release_date' => 'nullable|string|max:50',
        ]);

        $movie = Movie::firstOrCreate(
            ['tmdb_id' => $tmdbId],
            [
                'title' => $fields['title'],
                'poster_path' => $fields['poster_path'] ?? null,
                'release_date' => $fields['release_date'] ?? null,
            ]
        );

        $rating = UserMovieRating::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'movie_id' => $movie->id,
            ],
            [
                'rating' => $fields['rating'],
            ]
        );

        $this->identity->recordActivity(
            $request->user(),
            'movie_rated',
            'friends',
            $movie->id,
            null,
            ['rating' => $rating->rating]
        );

        return response()->json([
            'message' => 'Movie rating saved',
            'data' => [
                'rating' => $rating->rating,
            ],
        ]);
    }
}
