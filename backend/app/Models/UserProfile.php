<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'xp_total',
        'level',
        'current_streak_days',
        'longest_streak_days',
        'favorite_genres_cache',
        'top_movies_cache',
        'taste_summary',
    ];

    protected $casts = [
        'favorite_genres_cache' => 'array',
        'top_movies_cache' => 'array',
    ];
}
