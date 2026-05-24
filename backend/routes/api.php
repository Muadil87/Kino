<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\ReviewController;
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
