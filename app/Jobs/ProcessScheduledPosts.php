<?php

namespace App\Jobs;

use App\Models\Schedule;
use App\Models\Post;
use App\Services\DiscordService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Carbon\CarbonInterface;


class ProcessScheduledPosts implements ShouldQueue
{
    use Queueable;

    protected DiscordService $discordService;


    public function __construct(DiscordService $discordService)
    {
        $this->discordService = $discordService;
    }

    public function handle(): void
    {
        Log::info('=== INICIO ProcessScheduledPosts ===');

        $nowCostaRica = Carbon::now('America/Costa_Rica');
        $nowUTC = Carbon::now('UTC');

        Log::info("Hora actual - CR: {$nowCostaRica}, UTC: {$nowUTC}");

        $this->processIndividualScheduledPosts($nowUTC);
        $this->processAutomaticSchedules($nowCostaRica);

        Log::info('=== FIN ProcessScheduledPosts ===');
    }

    private function processIndividualScheduledPosts(CarbonInterface $nowUTC): void
    {
        Log::info('--- Procesando posts programados individualmente ---');

        $scheduledPosts = Post::where('status', 'scheduled')
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '<=', $nowUTC)
            ->get();

        Log::info("Total encontrados: {$scheduledPosts->count()}");

        foreach ($scheduledPosts as $post) {
            try {
                $this->publishToSocialMedia($post);

                $post->update([
                    'status' => 'published',
                    'published_at' => $nowUTC,
                    'published_by_schedule' => false
                ]);

                Log::info("Post ID {$post->id} publicado exitosamente.");
            } catch (\Exception $e) {
                Log::error("Error publicando post ID {$post->id}: " . $e->getMessage());

                $post->update([
                    'status' => 'failed',
                    'error_message' => $e->getMessage()
                ]);
            }
        }
    }

    private function processAutomaticSchedules(CarbonInterface $nowCostaRica): void
    {
        Log::info('--- Procesando horarios automáticos ---');

        $dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        $currentDay = $dayNames[$nowCostaRica->dayOfWeek];
        $currentTime = $nowCostaRica->format('H:i:00');

        $timeRangeStart = $nowCostaRica->copy()->subMinutes(2)->format('H:i:s');
        $timeRangeEnd = $nowCostaRica->copy()->addMinutes(2)->format('H:i:s');

        $schedules = Schedule::where('day_of_week', $currentDay)
            ->whereBetween('time', [$timeRangeStart, $timeRangeEnd])
            ->get();

        Log::info("Horarios encontrados: {$schedules->count()} en {$currentDay} entre {$timeRangeStart} y {$timeRangeEnd}");

        foreach ($schedules as $schedule) {
            $alreadyProcessed = Post::where('user_id', $schedule->user_id)
                ->where('published_by_schedule', true)
                ->where('published_at', '>', $nowCostaRica->copy()->subMinutes(5)->utc())
                ->exists();

            if ($alreadyProcessed) {
                Log::info("Horario ID {$schedule->id} ya procesado recientemente.");
                continue;
            }

            $queuedPosts = Post::where('user_id', $schedule->user_id)
                ->where('status', 'queued')
                ->orderBy('created_at')
                ->get();

            if ($queuedPosts->isEmpty()) {
                Log::info("Sin posts en cola para usuario {$schedule->user_id} en {$schedule->time}.");
                continue;
            }

            foreach ($queuedPosts as $queuedPost) {
                try {
                    $this->publishToSocialMedia($queuedPost);

                    $queuedPost->update([
                        'status' => 'published',
                        'published_at' => Carbon::now('UTC'),
                        'published_by_schedule' => true,
                        'schedule_id' => $schedule->id
                    ]);

                    Log::info("Post ID {$queuedPost->id} publicado por horario ID {$schedule->id}.");
                } catch (\Exception $e) {
                    Log::error("Error publicando automático ID {$queuedPost->id}: " . $e->getMessage());

                    $queuedPost->update([
                        'status' => 'failed',
                        'error_message' => $e->getMessage(),
                        'schedule_id' => $schedule->id
                    ]);
                }
            }
        }
    }

    private function publishToSocialMedia(Post $post): void
    {
        Log::info("=== Publicando post ID {$post->id} para usuario {$post->user_id} ===");

        $platforms = is_string($post->platforms)
            ? json_decode($post->platforms, true)
            : $post->platforms;

        if (!is_array($platforms)) {
            throw new \Exception('Plataformas no válidas');
        }

        $published = [];
        $errors = [];

        foreach ($platforms as $platform) {
            try {
                $this->publishToPlatform($post, $platform);
                $published[] = $platform;
                Log::info("Publicado en: {$platform}");
            } catch (\Exception $e) {
                $errors[] = "Error en {$platform}: " . $e->getMessage();
                Log::error($e->getMessage());
            }
        }

        if (empty($published)) {
            throw new \Exception('Error en todas las plataformas: ' . implode('; ', $errors));
        }

        if (!empty($errors)) {
            Log::warning("Errores parciales: " . implode('; ', $errors));
        }
    }

    private function publishToPlatform(Post $post, string $platform): mixed
    {
        return match ($platform) {
            'discord' => $this->publishToDiscord($post),
            'mastodon' => $this->publishToMastodon($post),
            default => throw new \Exception("Plataforma no soportada: {$platform}"),
        };
    }

    private function publishToDiscord(Post $post): array
    {
        $channelId = config('services.discord.channel_id');

        if (!$channelId) {
            throw new \Exception('DISCORD_CHANNEL_ID no configurado.');
        }

        return $this->discordService->publish($channelId, $post->content);
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

        $response = Http::withToken($accessToken)
            ->post("{$instance}/api/v1/statuses", [
                'status' => $post->content,
                'visibility' => 'public',
            ]);

        if ($response->failed()) {
            throw new \Exception('Error HTTP ' . $response->status() . ': ' . $response->body());
        }

        return $response->json();
    }
}
