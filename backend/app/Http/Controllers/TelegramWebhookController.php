<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TelegramWebhookController extends Controller
{
    public function __invoke(Request $request)
    {
        $expected = config('services.telegram.webhook_secret');
        $given = $request->header('X-Telegram-Bot-Api-Secret-Token');
        if ($expected && $expected !== $given) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $message = $request->input('message', []);
        $text = trim((string) ($message['text'] ?? ''));
        $chat = $message['chat'] ?? [];
        $from = $message['from'] ?? [];

        if (str_starts_with($text, '/start link_')) {
            $token = substr($text, strlen('/start link_'));
            $pending = Cache::get("tg:user:start:{$token}");
            if ($pending) {
                Cache::put("tg:user:confirmed:{$token}", [
                    'user_id' => $pending['user_id'],
                    'telegram_user_id' => $from['id'] ?? null,
                    'telegram_username' => $from['username'] ?? null,
                ], now()->addMinutes(15));
            }
        }

        if (str_starts_with($text, '/link ')) {
            $code = trim(substr($text, strlen('/link ')));
            if ($code !== '' && !empty($chat['id'])) {
                Cache::put("tg:group:confirmed:{$code}", [
                    'telegram_chat_id' => (string) $chat['id'],
                    'telegram_chat_title' => $chat['title'] ?? null,
                ], now()->addMinutes(15));
            }
        }

        return response()->json(['ok' => true]);
    }
}

