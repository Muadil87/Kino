<?php

namespace App\Policies;

use App\Models\Community;
use App\Models\CommunityMember;
use App\Models\User;

class CommunityPolicy
{
    public function view(User $user, Community $community): bool
    {
        if ($community->visibility === 'public') {
            return true;
        }

        return $this->isActiveMember($user->id, $community->id);
    }

    public function update(User $user, Community $community): bool
    {
        return $this->isAdmin($user->id, $community->id);
    }

    public function delete(User $user, Community $community): bool
    {
        return $community->owner_id === $user->id;
    }

    public function join(User $user, Community $community): bool
    {
        return $community->visibility === 'public' || $this->isActiveMember($user->id, $community->id);
    }

    public function leave(User $user, Community $community): bool
    {
        return $this->isActiveMember($user->id, $community->id);
    }

    public function viewMembers(User $user, Community $community): bool
    {
        return $this->isActiveMember($user->id, $community->id);
    }

    public function createInvite(User $user, Community $community): bool
    {
        return $this->isAdmin($user->id, $community->id);
    }

    public function viewLeaderboard(User $user, Community $community): bool
    {
        return $this->isActiveMember($user->id, $community->id);
    }

    public function viewStats(User $user, Community $community): bool
    {
        return $this->isActiveMember($user->id, $community->id);
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

