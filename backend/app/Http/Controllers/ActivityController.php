<?php

namespace App\Http\Controllers;

use App\Models\ActivityEvent;
use App\Models\Community;
use App\Models\CommunityMember;
use App\Models\Friendship;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function feed(Request $request)
    {
        $userId = $request->user()->id;
        $scope = $request->query('scope', 'home');
        $friendIds = Friendship::query()
            ->where('status', 'accepted')
            ->where(function ($q) use ($userId) {
                $q->where('requester_id', $userId)->orWhere('addressee_id', $userId);
            })
            ->get()
            ->map(fn ($f) => $f->requester_id === $userId ? $f->addressee_id : $f->requester_id);

        $communityIds = CommunityMember::where('user_id', $userId)->where('status', 'active')->pluck('community_id');

        $query = ActivityEvent::query();

        if ($scope === 'friends') {
            $query->whereIn('actor_user_id', $friendIds);
        } elseif ($scope === 'community') {
            $query->whereIn('community_id', $communityIds);
        } elseif ($scope === 'me') {
            $query->where('actor_user_id', $userId);
        } else {
            $query->where(function ($q) use ($friendIds, $communityIds, $userId) {
                $q->whereIn('actor_user_id', $friendIds)
                    ->orWhereIn('community_id', $communityIds)
                    ->orWhere('actor_user_id', $userId);
            });
        }

        $events = $query
            ->with(['actor:id,name', 'movie:id,tmdb_id,title,poster_path', 'community:id,name,slug'])
            ->latest()
            ->paginate(max(10, min((int) $request->query('per_page', 30), 50)));

        return response()->json($events);
    }

    public function community(Request $request, Community $community)
    {
        $this->authorize('viewStats', $community);

        $events = ActivityEvent::where('community_id', $community->id)
            ->with(['actor:id,name', 'movie:id,tmdb_id,title,poster_path'])
            ->latest()
            ->paginate(max(10, min((int) $request->query('per_page', 30), 50)));

        return response()->json($events);
    }
}
