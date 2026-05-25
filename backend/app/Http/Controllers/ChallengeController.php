<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommunityChallengeRequest;
use App\Http\Requests\UpdateChallengeProgressRequest;
use App\Models\ChallengeParticipant;
use App\Models\Community;
use App\Models\CommunityChallenge;
use App\Services\CinemaIdentityService;
use Illuminate\Http\Request;

class ChallengeController extends Controller
{
    public function __construct(private readonly CinemaIdentityService $identity)
    {
    }

    public function index(Request $request, Community $community)
    {
        $this->authorize('viewAny', [CommunityChallenge::class, $community->id]);
        $items = CommunityChallenge::where('community_id', $community->id)
            ->latest()
            ->paginate(max(10, min((int) $request->query('per_page', 20), 50)));
        return response()->json($items);
    }

    public function store(StoreCommunityChallengeRequest $request, Community $community)
    {
        $this->authorize('create', [CommunityChallenge::class, $community->id]);
        $fields = $request->validated();

        $challenge = CommunityChallenge::create([
            'community_id' => $community->id,
            ...$fields,
        ]);

        $this->identity->recordActivity(
            $request->user(),
            'challenge_started',
            'community',
            null,
            $community->id,
            ['challenge_id' => $challenge->id, 'title' => $challenge->title]
        );

        return response()->json(['data' => $challenge], 201);
    }

    public function join(Request $request, CommunityChallenge $challenge)
    {
        $this->authorize('join', $challenge);

        $participant = ChallengeParticipant::updateOrCreate(
            ['challenge_id' => $challenge->id, 'user_id' => $request->user()->id],
            ['progress_count' => 0]
        );
        return response()->json(['data' => $participant]);
    }

    public function progress(UpdateChallengeProgressRequest $request, CommunityChallenge $challenge)
    {
        $this->authorize('updateProgress', $challenge);
        $fields = $request->validated();

        $participant = ChallengeParticipant::where('challenge_id', $challenge->id)
            ->where('user_id', $request->user()->id)
            ->first();
        if (!$participant) {
            return response()->json(['message' => 'Join challenge first'], 422);
        }

        $completedAt = $fields['progress_count'] >= $challenge->target_count ? now() : null;
        $participant->update([
            'progress_count' => $fields['progress_count'],
            'completed_at' => $completedAt,
        ]);

        if ($completedAt && !$participant->getOriginal('completed_at')) {
            $this->identity->recordActivity(
                $request->user(),
                'challenge_completed',
                'community',
                null,
                $challenge->community_id,
                ['challenge_id' => $challenge->id]
            );
            $this->identity->awardXp(
                $request->user(),
                'challenge_completed',
                "challenge_completed:user:{$request->user()->id}:challenge:{$challenge->id}",
                'community_challenge',
                $challenge->id
            );
        }

        return response()->json(['data' => $participant]);
    }
}
