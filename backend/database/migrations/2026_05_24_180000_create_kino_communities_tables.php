<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('friendships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requester_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('addressee_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['pending', 'accepted', 'blocked', 'declined'])->default('pending');
            $table->timestamps();
            $table->unique(['requester_id', 'addressee_id']);
        });

        Schema::create('communities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('visibility', ['private', 'friends_only', 'public'])->default('private');
            $table->string('poster_url')->nullable();
            $table->timestamps();
        });

        Schema::create('community_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_id')->constrained('communities')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('role', ['owner', 'admin', 'member'])->default('member');
            $table->enum('status', ['active', 'left', 'removed', 'pending'])->default('active');
            $table->timestamp('joined_at')->nullable();
            $table->timestamps();
            $table->unique(['community_id', 'user_id']);
        });

        Schema::create('community_invites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_id')->constrained('communities')->cascadeOnDelete();
            $table->foreignId('inviter_id')->constrained('users')->cascadeOnDelete();
            $table->string('invite_code')->unique();
            $table->timestamp('expires_at')->nullable();
            $table->unsignedInteger('max_uses')->nullable();
            $table->unsignedInteger('uses_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('community_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_id')->constrained('communities')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('movie_id')->nullable()->constrained('movies')->nullOnDelete();
            $table->enum('type', ['discussion', 'recommendation', 'progress', 'challenge'])->default('discussion');
            $table->text('content');
            $table->timestamps();
        });

        Schema::create('community_post_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('community_posts')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('content');
            $table->timestamps();
        });

        Schema::create('community_challenges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_id')->constrained('communities')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('month_key', 7)->nullable();
            $table->unsignedInteger('target_count')->default(4);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->enum('status', ['draft', 'active', 'completed'])->default('draft');
            $table->timestamps();
        });

        Schema::create('challenge_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('challenge_id')->constrained('community_challenges')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedInteger('progress_count')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->unique(['challenge_id', 'user_id']);
        });

        Schema::create('user_telegram_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('telegram_user_id')->unique();
            $table->string('telegram_username')->nullable();
            $table->timestamp('linked_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['user_id']);
        });

        Schema::create('community_telegram_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_id')->constrained('communities')->cascadeOnDelete();
            $table->string('telegram_chat_id');
            $table->string('telegram_chat_title')->nullable();
            $table->foreignId('linked_by_user_id')->constrained('users')->cascadeOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['community_id']);
        });

        Schema::create('activity_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('actor_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('community_id')->nullable()->constrained('communities')->nullOnDelete();
            $table->foreignId('movie_id')->nullable()->constrained('movies')->nullOnDelete();
            $table->string('event_type');
            $table->string('visibility_scope')->default('friends');
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['actor_user_id', 'created_at']);
            $table->index(['community_id', 'created_at']);
        });

        Schema::create('movie_recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('from_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('to_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('community_id')->nullable()->constrained('communities')->nullOnDelete();
            $table->foreignId('movie_id')->constrained('movies')->cascadeOnDelete();
            $table->text('note')->nullable();
            $table->enum('status', ['sent', 'seen', 'accepted', 'dismissed'])->default('sent');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movie_recommendations');
        Schema::dropIfExists('activity_events');
        Schema::dropIfExists('community_telegram_links');
        Schema::dropIfExists('user_telegram_links');
        Schema::dropIfExists('challenge_participants');
        Schema::dropIfExists('community_challenges');
        Schema::dropIfExists('community_post_comments');
        Schema::dropIfExists('community_posts');
        Schema::dropIfExists('community_invites');
        Schema::dropIfExists('community_members');
        Schema::dropIfExists('communities');
        Schema::dropIfExists('friendships');
    }
};

