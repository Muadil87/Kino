<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityTelegramLink extends Model
{
    use HasFactory;

    protected $fillable = ['community_id', 'telegram_chat_id', 'telegram_chat_title', 'linked_by_user_id', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}

