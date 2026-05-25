<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_profiles', function (Blueprint $table) {
            $table->string('avatar_url')->nullable()->after('longest_streak_days');
            $table->text('bio')->nullable()->after('avatar_url');
            $table->json('favorite_genres')->nullable()->after('bio');
            $table->string('favorite_movie')->nullable()->after('favorite_genres');
            $table->string('favorite_director')->nullable()->after('favorite_movie');
        });
    }

    public function down(): void
    {
        Schema::table('user_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'avatar_url',
                'bio',
                'favorite_genres',
                'favorite_movie',
                'favorite_director',
            ]);
        });
    }
};
