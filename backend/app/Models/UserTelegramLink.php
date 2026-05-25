<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserTelegramLink extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'telegram_user_id', 'telegram_username', 'linked_at', 'is_active'];

    protected $casts = [
        'linked_at' => 'datetime',
        'is_active' => 'boolean',
    ];
}

