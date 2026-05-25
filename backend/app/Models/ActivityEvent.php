<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityEvent extends Model
{
    use HasFactory;

    protected $fillable = ['actor_user_id', 'community_id', 'movie_id', 'event_type', 'visibility_scope', 'metadata'];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_user_id');
    }

    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }

    public function community()
    {
        return $this->belongsTo(Community::class);
    }
}
