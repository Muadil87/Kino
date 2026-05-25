<?php

namespace App\Http\Controllers;

use App\Jobs\SendTelegramNotificationJob;
use App\Models\CommunityTelegramLink;
use App\Models\Movie;
use App\Services\CinemaIdentityService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    public function __construct(private readonly CinemaIdentityService $identity)
    {
    }

    public function index(Request $request)
    {
        $movies = $request->user()
            ->history()
            ->orderByPivot('watched_on', 'desc')
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
            'watched_on' => 'nullable|date',
        ]);

        $movie = Movie::firstOrCreate(
            ['tmdb_id' => $fields['tmdb_id']],
            [
                'title' => $fields['title'],
                'poster_path' => $fields['poster_path'] ?? null,
                'release_date' => $fields['release_date'] ?? null,
            ]
        );

        $watchedOn = $fields['watched_on'] ?? Carbon::now()->toDateString();

        $request->user()->history()->syncWithoutDetaching([$movie->id => ['watched_on' => $watchedOn]]);
        $request->user()->history()->updateExistingPivot($movie->id, ['watched_on' => $watchedOn]);

        $this->identity->recordMovieWatchAcrossContexts($request->user(), $movie->id, $watchedOn);
        $this->identity->awardXp(
            $request->user(),
            'movie_watched',
            "movie_watched:user:{$request->user()->id}:movie:{$movie->id}:date:{$watchedOn}",
            'movie',
            $movie->id,
            ['watched_on' => $watchedOn]
        );
        $this->identity->updateWatchStreak($request->user(), $watchedOn);
        $this->identity->syncBadges($request->user());

        $communityIds = $request->user()->communityMemberships()
            ->where('status', 'active')
            ->pluck('community_id');

        foreach ($communityIds as $communityId) {
            $tg = CommunityTelegramLink::where('community_id', $communityId)->where('is_active', true)->first();
            if ($tg) {
                SendTelegramNotificationJob::dispatch($tg->telegram_chat_id, "🎬 {$request->user()->name} completed {$movie->title}");
            }
        }

        return response()->json([
            'message' => 'Movie added to history',
            'data' => $movie,
            'watched_on' => $watchedOn,
        ], 201);
    }

    public function destroy(Request $request, int $tmdbId)
    {
        $movie = Movie::where('tmdb_id', $tmdbId)->first();

        if (!$movie) {
            return response()->json(['message' => 'Movie not found'], 404);
        }

        $request->user()->history()->detach($movie->id);

        return response()->json(['message' => 'Movie removed from history']);
    }
}
