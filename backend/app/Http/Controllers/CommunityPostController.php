<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommunityPostCommentRequest;
use App\Http\Requests\StoreCommunityPostRequest;
use App\Jobs\SendTelegramNotificationJob;
use App\Models\Community;
use App\Models\CommunityPost;
use App\Models\CommunityPostComment;
use App\Models\CommunityTelegramLink;
use App\Models\Movie;
use App\Services\CinemaIdentityService;
use Illuminate\Http\Request;

class CommunityPostController extends Controller
{
    public function __construct(private readonly CinemaIdentityService $identity)
    {
    }

    public function index(Request $request, Community $community)
    {
        $this->authorize('viewAny', [CommunityPost::class, $community->id]);

        $posts = CommunityPost::where('community_id', $community->id)
            ->with(['user:id,name', 'movie:id,tmdb_id,title,poster_path', 'comments.user:id,name'])
            ->latest()
            ->paginate(max(10, min((int) $request->query('per_page', 20), 50)));

        return response()->json($posts);
    }

    public function store(StoreCommunityPostRequest $request, Community $community)
    {
        $this->authorize('create', [CommunityPost::class, $community->id]);
        $fields = $request->validated();

        $movieId = null;
        if (!empty($fields['tmdb_id']) && !empty($fields['title'])) {
            $movie = Movie::firstOrCreate(
                ['tmdb_id' => $fields['tmdb_id']],
                [
                    'title' => $fields['title'],
                    'poster_path' => $fields['poster_path'] ?? null,
                    'release_date' => $fields['release_date'] ?? null,
                ]
            );
            $movieId = $movie->id;
        }

        $post = CommunityPost::create([
            'community_id' => $community->id,
            'user_id' => $request->user()->id,
            'movie_id' => $movieId,
            'type' => $fields['type'] ?? 'discussion',
            'content' => $fields['content'],
        ]);

        $this->identity->recordActivity(
            $request->user(),
            'community_post_created',
            'community',
            $movieId,
            $community->id,
            ['post_id' => $post->id, 'type' => $post->type]
        );

        $tgLink = CommunityTelegramLink::where('community_id', $community->id)->where('is_active', true)->first();
        if ($tgLink) {
            SendTelegramNotificationJob::dispatch($tgLink->telegram_chat_id, "New {$post->type} in {$community->name} by {$request->user()->name}");
        }

        return response()->json(['data' => $post->load('user:id,name')], 201);
    }

    public function comment(StoreCommunityPostCommentRequest $request, Community $community, CommunityPost $post)
    {
        if ($post->community_id !== $community->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $this->authorize('comment', $post);
        $fields = $request->validated();

        $comment = CommunityPostComment::create([
            'post_id' => $post->id,
            'user_id' => $request->user()->id,
            'content' => $fields['content'],
        ]);

        $this->identity->recordActivity(
            $request->user(),
            'community_comment_created',
            'community',
            $post->movie_id,
            $community->id,
            ['post_id' => $post->id, 'comment_id' => $comment->id]
        );
        $this->identity->awardXp(
            $request->user(),
            'community_comment_created',
            "community_comment_created:user:{$request->user()->id}:comment:{$comment->id}",
            'community_post_comment',
            $comment->id
        );

        return response()->json(['data' => $comment->load('user:id,name')], 201);
    }

    public function destroy(Request $request, Community $community, CommunityPost $post)
    {
        if ($post->community_id !== $community->id) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $this->authorize('delete', $post);

        $post->delete();
        return response()->json(['message' => 'Post deleted']);
    }
}
