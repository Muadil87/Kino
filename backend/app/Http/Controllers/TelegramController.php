<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConfirmTelegramLinkRequest;
use App\Http\Requests\LinkCommunityTelegramRequest;
use App\Models\Community;
use App\Models\CommunityTelegramLink;
use App\Models\UserTelegramLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class TelegramController extends Controller
{
    public function startLink(Request $request)
    {
        $token = Str::random(24);
        Cache::put("tg:user:start:{$token}", ['user_id' => $request->user()->id], now()->addMinutes(15));
        $botUsername = config('services.telegram.bot_username');
        $deepLink = $botUsername ? "https://t.me/{$botUsername}?start=link_{$token}" : null;

        return response()->json(['data' => ['token' => $token, 'deep_link' => $deepLink]]);
    }

    public function confirmLink(ConfirmTelegramLinkRequest $request)
    {
        $fields = $request->validated();
        $cached = Cache::pull("tg:user:confirmed:{$fields['token']}");
        if (!$cached || (int) $cached['user_id'] !== (int) $request->user()->id) {
            return response()->json(['message' => 'Link token not confirmed in Telegram'], 422);
        }

        $link = UserTelegramLink::updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'telegram_user_id' => (string) $cached['telegram_user_id'],
                'telegram_username' => $cached['telegram_username'] ?? null,
                'linked_at' => now(),
                'is_active' => true,
            ]
        );

        return response()->json(['data' => $link]);
    }

    public function unlink(Request $request)
    {
        UserTelegramLink::where('user_id', $request->user()->id)->delete();
        return response()->json(['message' => 'Telegram account unlinked']);
    }

    public function linkCommunityGroup(LinkCommunityTelegramRequest $request, Community $community)
    {
        $this->authorize('createInvite', $community);
        $fields = $request->validated();
        $cached = Cache::pull("tg:group:confirmed:{$fields['code']}");
        if (!$cached) {
            return response()->json(['message' => 'Telegram group code not confirmed'], 422);
        }

        $link = CommunityTelegramLink::updateOrCreate(
            ['community_id' => $community->id],
            [
                'telegram_chat_id' => (string) $cached['telegram_chat_id'],
                'telegram_chat_title' => $cached['telegram_chat_title'] ?? null,
                'linked_by_user_id' => $request->user()->id,
                'is_active' => true,
            ]
        );

        return response()->json(['data' => $link]);
    }

    public function unlinkCommunityGroup(Request $request, Community $community)
    {
        $this->authorize('createInvite', $community);
        CommunityTelegramLink::where('community_id', $community->id)->delete();
        return response()->json(['message' => 'Community Telegram unlinked']);
    }
}
