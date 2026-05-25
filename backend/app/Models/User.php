<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    // ... existing code ...

    // Relationship: A user has many reviews
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // Relationship: A user has many movies in their watchlist
    // We use 'belongsToMany' because a user connects to movies THROUGH the watchlists table
    public function watchlist()
    {
        return $this->belongsToMany(Movie::class, 'watchlists', 'user_id', 'movie_id')->withTimestamps();
    }

    public function favorites()
    {
        return $this->belongsToMany(Movie::class, 'favorites', 'user_id', 'movie_id')->withTimestamps();
    }

    public function history()
    {
        return $this->belongsToMany(Movie::class, 'histories', 'user_id', 'movie_id')
            ->withPivot('watched_on')
            ->withTimestamps();
    }

    public function sentFriendRequests(): HasMany
    {
        return $this->hasMany(Friendship::class, 'requester_id');
    }

    public function receivedFriendRequests(): HasMany
    {
        return $this->hasMany(Friendship::class, 'addressee_id');
    }

    public function ownedCommunities(): HasMany
    {
        return $this->hasMany(Community::class, 'owner_id');
    }

    public function communityMemberships(): HasMany
    {
        return $this->hasMany(CommunityMember::class, 'user_id');
    }

    public function telegramLink(): HasOne
    {
        return $this->hasOne(UserTelegramLink::class, 'user_id');
    }

    public function activityEvents(): HasMany
    {
        return $this->hasMany(ActivityEvent::class, 'actor_user_id');
    }

    public function profile(): HasOne
    {
        return $this->hasOne(UserProfile::class, 'user_id');
    }

    public function badges(): HasMany
    {
        return $this->hasMany(UserBadge::class, 'user_id');
    }
}
