<?php

namespace App\Services;

use App\Models\ActivityEvent;
use App\Models\CommunityMember;
use App\Models\User;
use App\Models\UserBadge;
use App\Models\UserProfile;
use App\Models\XpTransaction;
use Illuminate\Support\Facades\DB;

class CinemaIdentityService
{
    public const XP_MAP = [
        'movie_watched' => 10,
        'review_created' => 20,
        'community_comment_created' => 5,
        'challenge_completed' => 50,
    ];

    public function recordActivity(
        User $actor,
        string $eventType,
        string $visibilityScope = 'friends',
        ?int $movieId = null,
        ?int $communityId = null,
        array $metadata = []
    ): ActivityEvent {
        return ActivityEvent::create([
            'actor_user_id' => $actor->id,
            'community_id' => $communityId,
            'movie_id' => $movieId,
            'event_type' => $eventType,
            'visibility_scope' => $visibilityScope,
            'metadata' => $metadata,
        ]);
    }

    public function awardXp(User $user, string $action, string $idempotencyKey, ?string $sourceType = null, ?int $sourceId = null, array $metadata = []): ?XpTransaction
    {
        $xp = self::XP_MAP[$action] ?? 0;
        if ($xp <= 0) {
            return null;
        }

        return DB::transaction(function () use ($user, $action, $idempotencyKey, $sourceType, $sourceId, $xp, $metadata) {
            $already = XpTransaction::where('idempotency_key', $idempotencyKey)->first();
            if ($already) {
                return $already;
            }

            $tx = XpTransaction::create([
                'user_id' => $user->id,
                'action' => $action,
                'source_type' => $sourceType,
                'source_id' => $sourceId,
                'xp' => $xp,
                'idempotency_key' => $idempotencyKey,
                'metadata' => $metadata,
            ]);

            $profile = UserProfile::firstOrCreate(['user_id' => $user->id]);
            $profile->xp_total += $xp;
            $profile->level = $this->levelFromXp($profile->xp_total);
            $profile->save();

            $this->syncBadges($user);

            return $tx;
        });
    }

    public function recordMovieWatchAcrossContexts(User $user, int $movieId, string $watchedOn): void
    {
        $this->recordActivity($user, 'movie_watched', 'friends', $movieId, null, ['watched_on' => $watchedOn]);

        $communityIds = CommunityMember::where('user_id', $user->id)
            ->where('status', 'active')
            ->pluck('community_id');

        foreach ($communityIds as $communityId) {
            $this->recordActivity(
                $user,
                'movie_watched',
                'community',
                $movieId,
                $communityId,
                ['watched_on' => $watchedOn]
            );
        }
    }

    public function syncBadges(User $user): void
    {
        $watchCount = $user->history()->count();
        $reviewCount = $user->reviews()->count();
        $profile = UserProfile::firstOrCreate(['user_id' => $user->id]);

        $badges = [];
        if ($watchCount >= 1) {
            $badges[] = 'first_watch';
        }
        if ($watchCount >= 10) {
            $badges[] = 'cinephile_10';
        }
        if ($reviewCount >= 1) {
            $badges[] = 'first_review';
        }
        if ($profile->current_streak_days >= 7) {
            $badges[] = 'streak_7';
        }

        foreach ($badges as $badgeCode) {
            UserBadge::firstOrCreate(
                ['user_id' => $user->id, 'badge_code' => $badgeCode],
                ['earned_at' => now(), 'metadata' => []]
            );
        }
    }

    public function updateWatchStreak(User $user, string $watchedOn): void
    {
        $profile = UserProfile::firstOrCreate(['user_id' => $user->id]);

        $lastWatch = $user->history()
            ->orderByPivot('watched_on', 'desc')
            ->first();

        if (!$lastWatch || !$lastWatch->pivot?->watched_on) {
            $profile->current_streak_days = 1;
            $profile->longest_streak_days = max($profile->longest_streak_days, 1);
            $profile->save();
            return;
        }

        $lastDate = \Carbon\Carbon::parse($lastWatch->pivot->watched_on)->startOfDay();
        $newDate = \Carbon\Carbon::parse($watchedOn)->startOfDay();
        $diff = $lastDate->diffInDays($newDate, false);

        if ($diff === 0) {
            return;
        }

        if ($diff === 1) {
            $profile->current_streak_days += 1;
        } else {
            $profile->current_streak_days = 1;
        }

        $profile->longest_streak_days = max($profile->longest_streak_days, $profile->current_streak_days);
        $profile->save();
    }

    private function levelFromXp(int $xp): int
    {
        return max(1, (int) floor($xp / 100) + 1);
    }
}
