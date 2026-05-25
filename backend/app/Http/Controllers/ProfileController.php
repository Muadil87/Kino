<?php

namespace App\Http\Controllers;

use App\Models\ActivityEvent;
use App\Models\User;
use App\Models\UserBadge;
use App\Models\UserProfile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function meProgress(Request $request)
    {
        $user = $request->user();
        $profile = UserProfile::firstOrCreate(['user_id' => $user->id]);

        return response()->json([
            'data' => [
                'xp_total' => $profile->xp_total,
                'level' => $profile->level,
                'current_streak_days' => $profile->current_streak_days,
                'longest_streak_days' => $profile->longest_streak_days,
                'watched_count' => $user->history()->count(),
                'reviews_count' => $user->reviews()->count(),
                'favorites_count' => $user->favorites()->count(),
                'badges' => UserBadge::where('user_id', $user->id)->latest('earned_at')->get(),
            ],
        ]);
    }

    public function show(User $user)
    {
        $profile = UserProfile::firstOrCreate(['user_id' => $user->id]);

        $topMovies = $user->history()
            ->select('movies.id', 'movies.tmdb_id', 'movies.title', 'movies.poster_path')
            ->latest('histories.created_at')
            ->limit(6)
            ->get();

        $recentActivity = ActivityEvent::where('actor_user_id', $user->id)
            ->with(['movie:id,tmdb_id,title,poster_path', 'community:id,name,slug'])
            ->latest()
            ->limit(20)
            ->get();

        return response()->json([
            'data' => [
                'user' => ['id' => $user->id, 'name' => $user->name],
                'identity' => $profile,
                'stats' => [
                    'watched_count' => $user->history()->count(),
                    'reviews_count' => $user->reviews()->count(),
                    'favorites_count' => $user->favorites()->count(),
                ],
                'badges' => UserBadge::where('user_id', $user->id)->latest('earned_at')->get(),
                'top_movies' => $topMovies,
                'recent_activity' => $recentActivity,
            ],
        ]);
    }
}
