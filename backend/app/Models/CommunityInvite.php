<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityInvite extends Model
{
    use HasFactory;

    protected $fillable = ['community_id', 'inviter_id', 'invite_code', 'expires_at', 'max_uses', 'uses_count', 'is_active'];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];
}

