<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateProfileAvatarRequest;
use App\Http\Requests\UpdateProfileCoverRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\ActivityEvent;
use App\Models\User;
use App\Models\UserBadge;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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

    public function me(Request $request)
    {
        return response()->json([
            'data' => $this->buildProfilePayload($request->user()),
        ]);
    }

    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();
        $profile = UserProfile::firstOrCreate(['user_id' => $user->id]);
        $fields = $request->validated();

        if (array_key_exists('name', $fields)) {
            $user->name = $fields['name'];
        }
        if (array_key_exists('email', $fields)) {
            $user->email = $fields['email'];
        }
        $user->save();

        $profile->fill([
            'bio' => $fields['bio'] ?? $profile->bio,
            'favorite_genres' => $fields['favorite_genres'] ?? $profile->favorite_genres,
            'favorite_movie' => $fields['favorite_movie'] ?? $profile->favorite_movie,
            'favorite_movie_poster_path' => $fields['favorite_movie_poster_path'] ?? $profile->favorite_movie_poster_path,
            'favorite_movie_year' => $fields['favorite_movie_year'] ?? $profile->favorite_movie_year,
            'favorite_director' => $fields['favorite_director'] ?? $profile->favorite_director,
            'favorite_director_image_path' => $fields['favorite_director_image_path'] ?? $profile->favorite_director_image_path,
        ]);
        $profile->save();

        return response()->json([
            'message' => 'Profile updated successfully.',
            'data' => $this->buildProfilePayload($user->fresh()),
        ]);
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        $user = $request->user();
        $fields = $request->validated();

        if (!Hash::check($fields['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
                'errors' => ['current_password' => ['Current password is incorrect.']],
            ], 422);
        }

        $user->password = $fields['password'];
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully.',
        ]);
    }

    public function updateAvatar(UpdateProfileAvatarRequest $request)
    {
        $user = $request->user();
        $profile = UserProfile::firstOrCreate(['user_id' => $user->id]);

        $path = $request->file('avatar')->store('avatars', 'public');
        $profile->avatar_url = '/storage/' . $path;
        $profile->save();

        return response()->json([
            'message' => 'Profile picture updated successfully.',
            'data' => [
                'avatar_url' => $profile->avatar_url,
            ],
        ]);
    }

    public function updateCover(UpdateProfileCoverRequest $request)
    {
        $user = $request->user();
        $profile = UserProfile::firstOrCreate(['user_id' => $user->id]);

        $path = $request->file('cover')->store('covers', 'public');
        $profile->cover_url = '/storage/' . $path;
        $profile->save();

        return response()->json([
            'message' => 'Profile background updated successfully.',
            'data' => [
                'cover_url' => $profile->cover_url,
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

    private function buildProfilePayload(User $user): array
    {
        $profile = UserProfile::firstOrCreate(['user_id' => $user->id]);

        $watchlist = $user->watchlist()
            ->select('movies.id', 'movies.tmdb_id', 'movies.title', 'movies.poster_path', 'movies.release_date')
            ->latest('watchlists.created_at')
            ->get();

        $favorites = $user->favorites()
            ->select('movies.id', 'movies.tmdb_id', 'movies.title', 'movies.poster_path', 'movies.release_date')
            ->latest('favorites.created_at')
            ->get();

        $watched = $user->history()
            ->select('movies.id', 'movies.tmdb_id', 'movies.title', 'movies.poster_path', 'movies.release_date', 'histories.watched_on')
            ->latest('histories.created_at')
            ->get()
            ->map(function ($movie) {
                return [
                    'id' => $movie->id,
                    'tmdb_id' => $movie->tmdb_id,
                    'title' => $movie->title,
                    'poster_path' => $movie->poster_path,
                    'release_date' => $movie->release_date,
                    'date_watched' => $movie->watched_on,
                ];
            });

        $reviews = $user->reviews()
            ->with('movie:id,tmdb_id,title,poster_path,release_date')
            ->latest()
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'content' => $review->content,
                    'rating' => $review->rating,
                    'created_at' => $review->created_at,
                    'movie' => $review->movie,
                ];
            });

        $ratedMovies = $user->movieRatings()
            ->with('movie:id,tmdb_id,title,poster_path,release_date')
            ->orderByDesc('rating')
            ->latest('updated_at')
            ->get()
            ->map(fn ($item) => [
                'id' => $item->movie?->id,
                'tmdb_id' => $item->movie?->tmdb_id,
                'title' => $item->movie?->title,
                'poster_path' => $item->movie?->poster_path,
                'release_date' => $item->movie?->release_date,
                'rating' => $item->rating,
            ])
            ->filter(fn ($movie) => !empty($movie['id']))
            ->values();

        $topMoviesSource = $watched->count() > 0
            ? $watched->values()
            : $ratedMovies;

        $topMovies = $topMoviesSource
            ->take(4)
            ->map(fn ($movie) => [
                'id' => $movie['id'],
                'tmdb_id' => $movie['tmdb_id'],
                'title' => $movie['title'],
                'poster_path' => $movie['poster_path'],
                'release_date' => $movie['release_date'],
                'rating' => $movie['rating'] ?? null,
            ])
            ->values();

        $recentActivity = ActivityEvent::where('actor_user_id', $user->id)
            ->with(['movie:id,tmdb_id,title,poster_path', 'community:id,name,slug'])
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn ($event) => [
                'id' => $event->id,
                'event_type' => $event->event_type,
                'movie' => $event->movie,
                'community' => $event->community,
                'metadata' => $event->metadata ?? [],
                'created_at' => $event->created_at,
            ]);

        $completionChecks = [
            'bio' => filled($profile->bio),
            'avatar' => filled($profile->avatar_url),
            'cover' => filled($profile->cover_url),
            'favorite_genres' => !empty($profile->favorite_genres ?? []),
            'favorite_movie' => filled($profile->favorite_movie),
            'favorite_director' => filled($profile->favorite_director),
            'watched' => $watched->count() > 0,
            'reviewed' => $reviews->count() > 0,
        ];

        $completionCompleted = collect($completionChecks)->filter()->count();
        $completionTotal = count($completionChecks);
        $completionPercent = $completionTotal > 0
            ? (int) round(($completionCompleted / $completionTotal) * 100)
            : 0;

        $personalRatingAverage = round((float) $ratedMovies->avg('rating'), 1);
        $reviewRatingAverage = round((float) $reviews->avg('rating'), 1);
        $ratingAverage = $ratedMovies->count() > 0 ? $personalRatingAverage : $reviewRatingAverage;

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
            ],
            'profile' => [
                'avatar_url' => $profile->avatar_url,
                'cover_url' => $profile->cover_url,
                'bio' => $profile->bio,
                'favorite_genres' => $profile->favorite_genres ?? [],
                'favorite_movie' => $profile->favorite_movie,
                'favorite_movie_poster_path' => $profile->favorite_movie_poster_path,
                'favorite_movie_year' => $profile->favorite_movie_year,
                'favorite_director' => $profile->favorite_director,
                'favorite_director_image_path' => $profile->favorite_director_image_path,
            ],
            'stats' => [
                'watched_count' => $watched->count(),
                'watchlist_count' => $watchlist->count(),
                'favorites_count' => $favorites->count(),
                'reviews_count' => $reviews->count(),
                'rating_average' => $ratingAverage,
            ],
            'library' => [
                'watched' => $watched->values(),
                'watchlist' => $watchlist->values(),
                'favorites' => $favorites->values(),
                'reviews' => $reviews->values(),
                'rated' => $ratedMovies->values(),
            ],
            'identity' => [
                'top_movies' => $topMovies,
                'recent_activity' => $recentActivity,
                'profile_completion' => [
                    'percent' => $completionPercent,
                    'completed_items' => $completionCompleted,
                    'total_items' => $completionTotal,
                    'checklist' => $completionChecks,
                ],
            ],
        ];
    }
}
