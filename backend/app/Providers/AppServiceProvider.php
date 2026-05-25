<?php

namespace App\Providers;

use App\Models\Community;
use App\Models\CommunityChallenge;
use App\Models\CommunityPost;
use App\Models\MovieRecommendation;
use App\Policies\CommunityChallengePolicy;
use App\Policies\CommunityPolicy;
use App\Policies\CommunityPostPolicy;
use App\Policies\MovieRecommendationPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Community::class, CommunityPolicy::class);
        Gate::policy(CommunityPost::class, CommunityPostPolicy::class);
        Gate::policy(CommunityChallenge::class, CommunityChallengePolicy::class);
        Gate::policy(MovieRecommendation::class, MovieRecommendationPolicy::class);
    }
}
