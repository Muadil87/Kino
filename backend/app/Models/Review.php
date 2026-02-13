<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'movie_id',
        'content',
        'rating'
    ];

    // A review belongs to ONE user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A review belongs to ONE movie
    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }
}