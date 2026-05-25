<?php

namespace App\Policies;

use App\Models\CommunityMember;
use App\Models\MovieRecommendation;
use App\Models\User;

class MovieRecommendationPolicy
{
    public function update(User $user, MovieRecommendation $recommendation): bool
    {
        if ($recommendation->to_user_id === $user->id) {
            return true;
        }

        if (!$recommendation->community_id) {
            return false;
        }

        return CommunityMember::where('community_id', $recommendation->community_id)
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->exists();
    }
}

