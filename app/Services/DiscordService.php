<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class DiscordService
{
    protected $botToken;
    
    public function __construct()
    {
        $this->botToken = config('services.discord.bot_token');
    }

    public function publish($channelId, $content)
    {
        $response = Http::withToken($this->botToken)
            ->post("https://discord.com/api/v10/channels/{$channelId}/messages", [
                'content' => $content,
            ]);

        if ($response->failed()) {
            throw new \Exception('Error al publicar en Discord: ' . $response->body());
        }

        return $response->json();
    }
}
