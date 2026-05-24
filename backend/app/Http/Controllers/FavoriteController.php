<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $movies = $request->user()
            ->favorites()
            ->orderByPivot('created_at', 'desc')
            ->get();

        return response()->json(['data' => $movies]);
    }

    public function store(Request $request)
    {
        $fields = $request->validate([
            'tmdb_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'poster_path' => 'nullable|string|max:255',
            'release_date' => 'nullable|string|max:50',
        ]);

        $movie = Movie::firstOrCreate(
            ['tmdb_id' => $fields['tmdb_id']],
            [
                'title' => $fields['title'],
                'poster_path' => $fields['poster_path'] ?? null,
                'release_date' => $fields['release_date'] ?? null,
            ]
        );

        $request->user()->favorites()->syncWithoutDetaching([$movie->id]);

        return response()->json([
            'message' => 'Movie added to favorites',
            'data' => $movie,
        ], 201);
    }

    public function destroy(Request $request, int $tmdbId)
    {
        $movie = Movie::where('tmdb_id', $tmdbId)->first();

        if (!$movie) {
            return response()->json(['message' => 'Movie not found'], 404);
        }

        $request->user()->favorites()->detach($movie->id);

        return response()->json(['message' => 'Movie removed from favorites']);
    }
}
