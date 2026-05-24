<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(int $tmdbId)
    {
        $movie = Movie::where('tmdb_id', $tmdbId)->first();

        if (!$movie) {
            return response()->json([
                'data' => [],
            ]);
        }

        $reviews = $movie->reviews()->with('user:id,name')->latest()->get();

        return response()->json([
            'data' => $reviews,
        ]);
    }

    public function store(Request $request, int $tmdbId)
    {
        $fields = $request->validate([
            'content' => 'required|string|max:2000',
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

        $review = Review::create([
            'user_id' => $request->user()->id,
            'movie_id' => $movie->id,
            'content' => $fields['content'],
            'rating' => $fields['rating'],
        ]);

        return response()->json([
            'message' => 'Review created',
            'data' => $review->load('user:id,name'),
        ], 201);
    }

    public function destroy(Request $request, int $reviewId)
    {
        $review = Review::where('id', $reviewId)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$review) {
            return response()->json([
                'message' => 'Review not found',
            ], 404);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted',
        ]);
    }
}
