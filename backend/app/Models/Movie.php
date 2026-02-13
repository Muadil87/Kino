<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;

    // Allow these fields to be mass-assigned
    protected $fillable = [
        'tmdb_id',
        'title',
        'poster_path',
        'release_date'
    ];

    // A movie has many reviews
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // A movie can be on many users' watchlists
    public function users()
    {
        return $this->belongsToMany(User::class, 'watchlists');
    }
}