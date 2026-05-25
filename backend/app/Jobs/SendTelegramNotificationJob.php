<?php

namespace App\Jobs;

use App\Services\TelegramService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendTelegramNotificationJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $chatId,
        public string $message
    ) {}

    public function handle(TelegramService $telegram): void
    {
        $telegram->sendMessage($this->chatId, $this->message);
    }
}

