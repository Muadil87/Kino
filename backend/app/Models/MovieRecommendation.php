<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovieRecommendation extends Model
{
    use HasFactory;

    protected $fillable = ['from_user_id', 'to_user_id', 'community_id', 'movie_id', 'note', 'status'];

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_user_id');
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
