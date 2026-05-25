<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommunityRequest;
use App\Http\Requests\UpdateCommunityRequest;
use App\Models\Community;
use App\Models\CommunityInvite;
use App\Models\CommunityMember;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class CommunityController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $joinedIds = CommunityMember::where('user_id', $userId)->where('status', 'active')->pluck('community_id');

        $joined = Community::whereIn('id', $joinedIds)->latest()->get();
        $discover = Community::whereNotIn('id', $joinedIds)->where('visibility', 'public')->latest()->take(20)->get();

        return response()->json(['data' => ['joined' => $joined, 'discover' => $discover]]);
    }

    public function store(StoreCommunityRequest $request)
    {
        $fields = $request->validated();

        $community = Community::create([
            'owner_id' => $request->user()->id,
            'name' => $fields['name'],
            'slug' => Str::slug($fields['name']) . '-' . Str::lower(Str::random(5)),
            'description' => $fields['description'] ?? null,
            'visibility' => $fields['visibility'] ?? 'private',
            'poster_url' => $fields['poster_url'] ?? null,
        ]);

        CommunityMember::create([
            'community_id' => $community->id,
            'user_id' => $request->user()->id,
            'role' => 'owner',
            'status' => 'active',
            'joined_at' => now(),
        ]);

        return response()->json(['data' => $community], 201);
    }

    public function show(Request $request, Community $community)
    {
        $this->authorize('view', $community);

        return response()->json(['data' => $community]);
    }

    public function update(UpdateCommunityRequest $request, Community $community)
    {
        $this->authorize('update', $community);
        $fields = $request->validated();

        $community->update($fields);
        return response()->json(['data' => $community]);
    }

    public function destroy(Request $request, Community $community)
    {
        $this->authorize('delete', $community);
        $community->delete();
        return response()->json(['message' => 'Community deleted']);
    }

    public function join(Request $request, Community $community)
    {
        $this->authorize('join', $community);

        CommunityMember::updateOrCreate(
            ['community_id' => $community->id, 'user_id' => $request->user()->id],
            ['status' => 'active', 'joined_at' => now(), 'role' => 'member']
        );

        return response()->json(['message' => 'Joined community']);
    }

    public function leave(Request $request, Community $community)
    {
        $this->authorize('leave', $community);

        CommunityMember::where('community_id', $community->id)
            ->where('user_id', $request->user()->id)
            ->update(['status' => 'left']);

        return response()->json(['message' => 'Left community']);
    }

    public function members(Request $request, Community $community)
    {
        $this->authorize('viewMembers', $community);

        $members = CommunityMember::where('community_id', $community->id)
            ->where('status', 'active')
            ->with('user:id,name,email')
            ->paginate((int) $request->query('per_page', 24));

        return response()->json($members);
    }

    public function createInvite(Request $request, Community $community)
    {
        $this->authorize('createInvite', $community);

        $code = Str::upper(Str::random(8));
        $invite = CommunityInvite::create([
            'community_id' => $community->id,
            'inviter_id' => $request->user()->id,
            'invite_code' => $code,
            'expires_at' => now()->addDays(7),
            'max_uses' => 50,
            'uses_count' => 0,
            'is_active' => true,
        ]);

        return response()->json(['data' => $invite], 201);
    }

    public function joinByCode(Request $request, string $code)
    {
        $invite = CommunityInvite::where('invite_code', $code)->where('is_active', true)->first();
        if (!$invite) {
            return response()->json(['message' => 'Invite not found'], 404);
        }
        if ($invite->expires_at && Carbon::parse($invite->expires_at)->isPast()) {
            return response()->json(['message' => 'Invite expired'], 422);
        }
        if ($invite->max_uses && $invite->uses_count >= $invite->max_uses) {
            return response()->json(['message' => 'Invite exhausted'], 422);
        }

        CommunityMember::updateOrCreate(
            ['community_id' => $invite->community_id, 'user_id' => $request->user()->id],
            ['status' => 'active', 'joined_at' => now(), 'role' => 'member']
        );
        $invite->increment('uses_count');

        return response()->json(['message' => 'Joined community']);
    }

    public function leaderboard(Request $request, Community $community)
    {
        $this->authorize('viewLeaderboard', $community);
        $memberIds = CommunityMember::where('community_id', $community->id)->where('status', 'active')->pluck('user_id');
        $perPage = max(5, min((int) $request->query('per_page', 15), 50));
        $rows = \DB::table('histories')
            ->join('users', 'users.id', '=', 'histories.user_id')
            ->selectRaw('users.id, users.name, COUNT(histories.id) as watched_count')
            ->whereIn('histories.user_id', $memberIds)
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('watched_count')
            ->paginate($perPage);
        return response()->json($rows);
    }

    public function stats(Request $request, Community $community)
    {
        $this->authorize('viewStats', $community);
        $memberIds = CommunityMember::where('community_id', $community->id)->where('status', 'active')->pluck('user_id');
        $watched = \DB::table('histories')->whereIn('user_id', $memberIds)->count();
        $members = $memberIds->count();
        return response()->json(['data' => ['members' => $members, 'watched_count' => $watched]]);
    }
}
