<?php

namespace App\Policies;

use App\Models\CommunityChallenge;
use App\Models\CommunityMember;
use App\Models\User;

class CommunityChallengePolicy
{
    public function viewAny(User $user, int $communityId): bool
    {
        return $this->isActiveMember($user->id, $communityId);
    }

    public function create(User $user, int $communityId): bool
    {
        return $this->isAdmin($user->id, $communityId);
    }

    public function join(User $user, CommunityChallenge $challenge): bool
    {
        return $this->isActiveMember($user->id, $challenge->community_id);
    }

    public function updateProgress(User $user, CommunityChallenge $challenge): bool
    {
        return $this->isActiveMember($user->id, $challenge->community_id);
    }

    private function isActiveMember(int $userId, int $communityId): bool
    {
        return CommunityMember::where('community_id', $communityId)
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->exists();
    }

    private function isAdmin(int $userId, int $communityId): bool
    {
        return CommunityMember::where('community_id', $communityId)
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->whereIn('role', ['owner', 'admin'])
            ->exists();
    }
}

