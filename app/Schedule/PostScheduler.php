<?php

namespace App\Jobs;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class PostScheduler implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        Log::info('📅 Iniciando verificación de posts programados...');

        $scheduledPosts = Post::where('status', 'scheduled')
            ->where('scheduled_at', '<=', now())
            ->get();

        foreach ($scheduledPosts as $post) {
            try {
                Log::info("📝 Procesando post ID {$post->id}");

                // Publicar en Discord
                if (in_array('discord', $post->platforms ?? [])) {
                    $this->publishToDiscord($post);
                    Log::info("✅ Post {$post->id} publicado en Discord.");
                }

                // Publicar en Mastodon
                if (in_array('mastodon', $post->platforms ?? [])) {
                    $this->publishToMastodon($post);
                    Log::info("✅ Post {$post->id} publicado en Mastodon.");
                }

                $post->status = 'published';
                $post->published_at = now();
                $post->save();
            } catch (\Exception $e) {
                Log::error("❌ Error publicando el post {$post->id}: " . $e->getMessage());
            }
        }

        Log::info('🏁 Finalizó procesamiento de posts programados.');
    }
    private function publishToDiscord(Post $post): array
    {
        $channelId = config('services.discord.channel_id');
        $token = config('services.discord.bot_token');

        if (!$channelId || !$token) {
            throw new \Exception('Faltan configuraciones de Discord.');
        }

        $imagePath = $post->image_path
            ? storage_path('app/public/' . $post->image_path)
            : null;

        $url = "https://discord.com/api/v10/channels/{$channelId}/messages";
        $discordToken = str_starts_with($token, 'Bot ') ? $token : 'Bot ' . $token;

        if ($imagePath && file_exists($imagePath)) {
            $response = Http::withHeaders([
                'Authorization' => $discordToken,
            ])
                ->attach('file', file_get_contents($imagePath), basename($imagePath))
                ->post($url, [
                    'content' => $post->content,
                ]);
        } else {
            $response = Http::withHeaders([
                'Authorization' => $discordToken,
                'Content-Type' => 'application/json',
            ])->post($url, [
                'content' => $post->content,
            ]);
        }

        if ($response->failed()) {
            throw new \Exception('Error en Discord: ' . $response->body());
        }

        return $response->json();
    }




    private function publishToMastodon(Post $post): array
    {
        $instance = config('services.mastodon.instance', 'https://mastodon.social');
        $accessToken = config('services.mastodon.access_token');

        if (!$accessToken) {
            throw new \Exception('MASTODON_ACCESS_TOKEN no configurado.');
        }

        if (!str_starts_with($instance, 'http')) {
            $instance = 'https://' . $instance;
        }

        $mediaId = null;
        $imagePath = $post->image_path
            ? storage_path('app/public/' . $post->image_path)
            : null;

        if ($imagePath && file_exists($imagePath)) {
            $mediaResponse = Http::withToken($accessToken)
                ->attach('file', file_get_contents($imagePath), basename($imagePath))
                ->post("{$instance}/api/v2/media");

            if ($mediaResponse->failed()) {
                throw new \Exception('Error subiendo imagen: ' . $mediaResponse->body());
            }

            $mediaId = $mediaResponse->json('id');
        }

        $statusData = [
            'status' => $post->content,
            'visibility' => 'public',
        ];

        if ($mediaId) {
            $statusData['media_ids'] = [$mediaId];
        }

        $postResponse = Http::withToken($accessToken)
            ->post("{$instance}/api/v1/statuses", $statusData);

        if ($postResponse->failed()) {
            throw new \Exception('Error publicando en Mastodon: ' . $postResponse->body());
        }

        return $postResponse->json();
    }
}
