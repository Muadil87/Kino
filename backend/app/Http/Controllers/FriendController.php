<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFriendRequest;
use App\Models\Friendship;
use App\Models\User;
use Illuminate\Http\Request;

class FriendController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $friends = Friendship::query()
            ->where('status', 'accepted')
            ->where(function ($q) use ($userId) {
                $q->where('requester_id', $userId)->orWhere('addressee_id', $userId);
            })
            ->with(['requester:id,name,email', 'addressee:id,name,email'])
            ->latest()
            ->get()
            ->map(function (Friendship $f) use ($userId) {
                return $f->requester_id === $userId ? $f->addressee : $f->requester;
            });

        return response()->json(['data' => $friends]);
    }

    public function requests(Request $request)
    {
        $userId = $request->user()->id;
        $incoming = Friendship::where('addressee_id', $userId)
            ->where('status', 'pending')
            ->with('requester:id,name,email')
            ->latest()
            ->paginate(max(10, min((int) $request->query('per_page', 20), 50)));

        return response()->json($incoming);
    }

    public function store(StoreFriendRequest $request)
    {
        $fields = $request->validated();

        $target = null;
        if (!empty($fields['user_id'])) {
            $target = User::find($fields['user_id']);
        } elseif (!empty($fields['email'])) {
            $target = User::where('email', $fields['email'])->first();
        }

        if (!$target) {
            return response()->json(['message' => 'Target user not found'], 404);
        }

        $me = $request->user();
        if ($target->id === $me->id) {
            return response()->json(['message' => 'Cannot friend yourself'], 422);
        }

        $existing = Friendship::where(function ($q) use ($me, $target) {
            $q->where('requester_id', $me->id)->where('addressee_id', $target->id);
        })->orWhere(function ($q) use ($me, $target) {
            $q->where('requester_id', $target->id)->where('addressee_id', $me->id);
        })->first();

        if ($existing) {
            return response()->json(['message' => 'Friend request already exists'], 409);
        }

        $friendship = Friendship::create([
            'requester_id' => $me->id,
            'addressee_id' => $target->id,
            'status' => 'pending',
        ]);

        return response()->json(['data' => $friendship], 201);
    }

    public function accept(Request $request, int $id)
    {
        $friendship = Friendship::where('id', $id)
            ->where('addressee_id', $request->user()->id)
            ->where('status', 'pending')
            ->first();

        if (!$friendship) {
            return response()->json(['message' => 'Friend request not found'], 404);
        }

        $friendship->update(['status' => 'accepted']);
        return response()->json(['message' => 'Friend request accepted']);
    }

    public function decline(Request $request, int $id)
    {
        $friendship = Friendship::where('id', $id)
            ->where('addressee_id', $request->user()->id)
            ->where('status', 'pending')
            ->first();

        if (!$friendship) {
            return response()->json(['message' => 'Friend request not found'], 404);
        }

        $friendship->update(['status' => 'declined']);
        return response()->json(['message' => 'Friend request declined']);
    }

    public function block(Request $request, int $id)
    {
        $friendship = Friendship::where('id', $id)->first();
        if (!$friendship || ($friendship->requester_id !== $request->user()->id && $friendship->addressee_id !== $request->user()->id)) {
            return response()->json(['message' => 'Friendship not found'], 404);
        }
        $friendship->update(['status' => 'blocked']);
        return response()->json(['message' => 'Friend blocked']);
    }

    public function destroy(Request $request, int $id)
    {
        $friendship = Friendship::where('id', $id)->first();
        if (!$friendship || ($friendship->requester_id !== $request->user()->id && $friendship->addressee_id !== $request->user()->id)) {
            return response()->json(['message' => 'Friendship not found'], 404);
        }
        $friendship->delete();
        return response()->json(['message' => 'Friend removed']);
    }
}
