<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBadge extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'badge_code',
        'metadata',
        'earned_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'earned_at' => 'datetime',
    ];
}
