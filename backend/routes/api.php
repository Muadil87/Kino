<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\CommunityPostController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TelegramController;
use App\Http\Controllers\TelegramWebhookController;
use App\Http\Controllers\WatchlistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Routes (Anyone can access)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Only logged-in users with a valid Token can access)
Route::middleware('auth:sanctum')->group(function () {
    
    // Get the currently logged in user info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/watchlist', [WatchlistController::class, 'index']);
    Route::post('/watchlist', [WatchlistController::class, 'store']);
    Route::delete('/watchlist/{tmdbId}', [WatchlistController::class, 'destroy']);
    Route::get('/me/profile-progress', [ProfileController::class, 'meProgress']);
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{tmdbId}', [FavoriteController::class, 'destroy']);
    Route::get('/history', [HistoryController::class, 'index']);
    Route::post('/history', [HistoryController::class, 'store']);
    Route::delete('/history/{tmdbId}', [HistoryController::class, 'destroy']);

    Route::post('/movies/{tmdbId}/reviews', [ReviewController::class, 'store']);
    Route::delete('/reviews/{reviewId}', [ReviewController::class, 'destroy']);
});

Route::get('/movies/{tmdbId}/reviews', [ReviewController::class, 'index']);
Route::get('/profiles/{user}', [ProfileController::class, 'show']);
Route::post('/telegram/webhook', TelegramWebhookController::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/friends', [FriendController::class, 'index']);
    Route::get('/friends/requests', [FriendController::class, 'requests']);
    Route::post('/friends/requests', [FriendController::class, 'store']);
    Route::post('/friends/requests/{id}/accept', [FriendController::class, 'accept']);
    Route::post('/friends/requests/{id}/decline', [FriendController::class, 'decline']);
    Route::post('/friends/{id}/block', [FriendController::class, 'block']);
    Route::delete('/friends/{id}', [FriendController::class, 'destroy']);

    Route::get('/communities', [CommunityController::class, 'index']);
    Route::post('/communities', [CommunityController::class, 'store']);
    Route::get('/communities/{community}', [CommunityController::class, 'show']);
    Route::patch('/communities/{community}', [CommunityController::class, 'update']);
    Route::delete('/communities/{community}', [CommunityController::class, 'destroy']);
    Route::post('/communities/{community}/join', [CommunityController::class, 'join']);
    Route::post('/communities/{community}/leave', [CommunityController::class, 'leave']);
    Route::get('/communities/{community}/members', [CommunityController::class, 'members']);
    Route::post('/communities/{community}/invites', [CommunityController::class, 'createInvite']);
    Route::post('/community-invites/{code}/join', [CommunityController::class, 'joinByCode']);
    Route::get('/communities/{community}/leaderboard', [CommunityController::class, 'leaderboard']);
    Route::get('/communities/{community}/stats', [CommunityController::class, 'stats']);

    Route::get('/communities/{community}/posts', [CommunityPostController::class, 'index']);
    Route::post('/communities/{community}/posts', [CommunityPostController::class, 'store']);
    Route::post('/communities/{community}/posts/{post}/comments', [CommunityPostController::class, 'comment']);
    Route::delete('/communities/{community}/posts/{post}', [CommunityPostController::class, 'destroy']);

    Route::post('/recommendations', [RecommendationController::class, 'store']);
    Route::get('/recommendations/inbox', [RecommendationController::class, 'inbox']);
    Route::patch('/recommendations/{recommendation}', [RecommendationController::class, 'update']);

    Route::get('/activity/feed', [ActivityController::class, 'feed']);
    Route::get('/communities/{community}/activity', [ActivityController::class, 'community']);

    Route::get('/communities/{community}/challenges', [ChallengeController::class, 'index']);
    Route::post('/communities/{community}/challenges', [ChallengeController::class, 'store']);
    Route::post('/challenges/{challenge}/join', [ChallengeController::class, 'join']);
    Route::patch('/challenges/{challenge}/progress', [ChallengeController::class, 'progress']);

    Route::post('/settings/telegram/link/start', [TelegramController::class, 'startLink']);
    Route::post('/settings/telegram/link/confirm', [TelegramController::class, 'confirmLink']);
    Route::delete('/settings/telegram/link', [TelegramController::class, 'unlink']);
    Route::post('/communities/{community}/telegram/link', [TelegramController::class, 'linkCommunityGroup']);
    Route::delete('/communities/{community}/telegram/link', [TelegramController::class, 'unlinkCommunityGroup']);
});
