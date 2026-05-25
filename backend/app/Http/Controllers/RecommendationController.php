<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRecommendationRequest;
use App\Models\CommunityMember;
use App\Models\Movie;
use App\Models\MovieRecommendation;
use App\Services\CinemaIdentityService;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function __construct(private readonly CinemaIdentityService $identity)
    {
    }

    public function store(StoreRecommendationRequest $request)
    {
        $fields = $request->validated();

        if (!empty($fields['community_id'])) {
            $isMember = CommunityMember::where('community_id', $fields['community_id'])
                ->where('user_id', $request->user()->id)
                ->where('status', 'active')
                ->exists();
            if (!$isMember) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
        }

        $movie = Movie::firstOrCreate(
            ['tmdb_id' => $fields['tmdb_id']],
            [
                'title' => $fields['title'],
                'poster_path' => $fields['poster_path'] ?? null,
                'release_date' => $fields['release_date'] ?? null,
            ]
        );

        $recommendation = MovieRecommendation::create([
            'from_user_id' => $request->user()->id,
            'to_user_id' => $fields['to_user_id'] ?? null,
            'community_id' => $fields['community_id'] ?? null,
            'movie_id' => $movie->id,
            'note' => $fields['note'] ?? null,
            'status' => 'sent',
        ]);

        $this->identity->recordActivity(
            $request->user(),
            'movie_recommended',
            $fields['community_id'] ? 'community' : 'friends',
            $movie->id,
            $fields['community_id'] ?? null,
            ['recommendation_id' => $recommendation->id, 'to_user_id' => $fields['to_user_id'] ?? null]
        );

        return response()->json(['data' => $recommendation], 201);
    }

    public function inbox(Request $request)
    {
        $userId = $request->user()->id;
        $communityIds = CommunityMember::where('user_id', $userId)->where('status', 'active')->pluck('community_id');

        $items = MovieRecommendation::query()
            ->where(function ($q) use ($userId, $communityIds) {
                $q->where('to_user_id', $userId)->orWhereIn('community_id', $communityIds);
            })
            ->with(['fromUser:id,name', 'movie:id,tmdb_id,title,poster_path', 'community:id,name,slug'])
            ->latest()
            ->paginate(max(10, min((int) $request->query('per_page', 30), 50)));

        return response()->json($items);
    }

    public function update(Request $request, MovieRecommendation $recommendation)
    {
        $fields = $request->validate([
            'status' => 'required|in:seen,accepted,dismissed',
        ]);

        $this->authorize('update', $recommendation);

        $recommendation->update(['status' => $fields['status']]);
        return response()->json(['data' => $recommendation]);
    }
}
