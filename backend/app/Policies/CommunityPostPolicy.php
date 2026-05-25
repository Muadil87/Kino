<?php

namespace App\Policies;

use App\Models\CommunityMember;
use App\Models\CommunityPost;
use App\Models\User;

class CommunityPostPolicy
{
    public function viewAny(User $user, int $communityId): bool
    {
        return $this->isActiveMember($user->id, $communityId);
    }

    public function create(User $user, int $communityId): bool
    {
        return $this->isActiveMember($user->id, $communityId);
    }

    public function comment(User $user, CommunityPost $post): bool
    {
        return $this->isActiveMember($user->id, $post->community_id);
    }

    public function delete(User $user, CommunityPost $post): bool
    {
        if ($post->user_id === $user->id) {
            return true;
        }

        return CommunityMember::where('community_id', $post->community_id)
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->whereIn('role', ['owner', 'admin'])
            ->exists();
    }

    private function isActiveMember(int $userId, int $communityId): bool
    {
        return CommunityMember::where('community_id', $communityId)
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->exists();
    }
}

