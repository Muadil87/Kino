<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_profiles', function (Blueprint $table) {
            $table->string('favorite_movie_poster_path')->nullable()->after('favorite_movie');
            $table->unsignedSmallInteger('favorite_movie_year')->nullable()->after('favorite_movie_poster_path');
            $table->string('favorite_director_image_path')->nullable()->after('favorite_director');
        });
    }

    public function down(): void
    {
        Schema::table('user_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'favorite_movie_poster_path',
                'favorite_movie_year',
                'favorite_director_image_path',
            ]);
        });
    }
};
