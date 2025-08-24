<?php

namespace App\Jobs;

use App\Models\Schedule;
use App\Models\Post;
use App\Services\DiscordService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ProcessScheduledPosts implements ShouldQueue
{
    use Queueable;

    protected $discordService;

    public function __construct()
    {
        $this->discordService = new DiscordService();
    }

    public function handle(): void
    {
        Log::info('=== INICIO ProcessScheduledPosts ===');
        
        // Usar timezone de Costa Rica para todas las operaciones
        $nowCostaRica = Carbon::now('America/Costa_Rica');
        $nowUTC = Carbon::now('UTC');
        
        Log::info('ProcessScheduledPosts ejecutándose:');
        Log::info('- Hora Costa Rica: ' . $nowCostaRica->toDateTimeString());
        Log::info('- Hora UTC: ' . $nowUTC->toDateTimeString());
        
        // Procesar posts programados individualmente
        $this->processIndividualScheduledPosts($nowUTC);
        
        // Procesar horarios automáticos (usando hora de Costa Rica)
        $this->processAutomaticSchedules($nowCostaRica);
        
        Log::info('=== FIN ProcessScheduledPosts ===');
    }

    private function processIndividualScheduledPosts($nowUTC)
    {
        Log::info('--- Procesando posts programados individualmente ---');
        
        // Los posts programados se almacenan en UTC, así que comparamos con UTC
        $scheduledPosts = Post::where('status', 'scheduled')
                             ->where('scheduled_at', '<=', $nowUTC)
                             ->whereNotNull('scheduled_at')
                             ->get();

        Log::info('Posts programados individualmente encontrados: ' . $scheduledPosts->count());

        foreach ($scheduledPosts as $post) {
            $scheduledAtCostaRica = $post->scheduled_at->setTimezone('America/Costa_Rica');
            Log::info('Procesando post ID: ' . $post->id . ' programado para: ' . 
                     $scheduledAtCostaRica->format('Y-m-d H:i:s') . ' (Costa Rica)');
            
            try {
                $this->publishToSocialMedia($post);
                
                $post->update([
                    'status' => 'published',
                    'published_at' => $nowUTC,
                    'published_by_schedule' => false // No fue por horario automático
                ]);
                
                Log::info('Post ID: ' . $post->id . ' publicado exitosamente (programado individualmente)');
            } catch (\Exception $e) {
                Log::error('Error publicando post ID ' . $post->id . ': ' . $e->getMessage());
                
                $post->update([
                    'status' => 'failed',
                    'error_message' => $e->getMessage()
                ]);
            }
        }
    }

    private function processAutomaticSchedules($nowCostaRica)
    {
        Log::info('--- Procesando horarios automáticos ---');
        
        // Mapeo de días de la semana (Carbon usa domingo = 0, lunes = 1, etc.)
        $dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        $currentDay = $dayNames[$nowCostaRica->dayOfWeek];
        $currentTime = $nowCostaRica->format('H:i:00');

        Log::info('Procesando horarios automáticos:');
        Log::info('- Día actual: ' . $currentDay);
        Log::info('- Hora actual: ' . $currentTime);
        Log::info('- DayOfWeek (Carbon): ' . $nowCostaRica->dayOfWeek);

        // Buscar horarios que coincidan con el día y hora actual (con margen de ±2 minutos)
        $timeRangeStart = $nowCostaRica->copy()->subMinutes(2)->format('H:i:s');
        $timeRangeEnd = $nowCostaRica->copy()->addMinutes(2)->format('H:i:s');
        
        Log::info('Buscando horarios entre: ' . $timeRangeStart . ' y ' . $timeRangeEnd);

        $schedules = Schedule::where('day_of_week', $currentDay)
                           ->whereBetween('time', [$timeRangeStart, $timeRangeEnd])
                           ->get();

        Log::info('Horarios automáticos encontrados: ' . $schedules->count());

        foreach ($schedules as $schedule) {
            Log::info('Procesando horario ID: ' . $schedule->id . ' para usuario: ' . $schedule->user_id . 
                     ' el ' . $currentDay . ' a las ' . $schedule->time);
            
            // Verificar si ya se procesó este horario en los últimos minutos para evitar duplicados
            $recentlyProcessed = Post::where('user_id', $schedule->user_id)
                                   ->where('schedule_id', $schedule->id)
                                   ->where('published_at', '>', $nowCostaRica->copy()->subMinutes(5)->utc())
                                   ->exists();
            
            if ($recentlyProcessed) {
                Log::info('Horario ID: ' . $schedule->id . ' ya fue procesado recientemente. Saltando...');
                continue;
            }
            
            // Buscar el post más antiguo en cola del usuario
            $queuedPost = Post::where('user_id', $schedule->user_id)
                             ->where('status', 'queued')
                             ->orderBy('created_at', 'asc') // El más antiguo primero
                             ->first();

            Log::info('Buscando posts en cola para usuario: ' . $schedule->user_id);
            Log::info('Posts en cola encontrados: ' . Post::where('user_id', $schedule->user_id)->where('status', 'queued')->count());

            if ($queuedPost) {
                try {
                    Log::info('Post en cola encontrado ID: ' . $queuedPost->id . ' - Contenido: ' . substr($queuedPost->content, 0, 50) . '...');
                    
                    $this->publishToSocialMedia($queuedPost);
                    
                    $queuedPost->update([
                        'status' => 'published',
                        'published_at' => Carbon::now('UTC'), // Siempre guardar en UTC
                        'published_by_schedule' => true, // Campo para tracking
                        'schedule_id' => $schedule->id // IMPORTANTE: Guardar el schedule_id
                    ]);
                    
                    Log::info('Post automático ID: ' . $queuedPost->id . ' publicado exitosamente por horario ID: ' . $schedule->id);
                } catch (\Exception $e) {
                    Log::error('Error publicando post automático ID ' . ($queuedPost->id ?? 'desconocido') . ': ' . $e->getMessage());
                    Log::error('Stack trace: ' . $e->getTraceAsString());
                    
                    $queuedPost->update([
                        'status' => 'failed',
                        'error_message' => $e->getMessage(),
                        'schedule_id' => $schedule->id
                    ]);
                }
            } else {
                Log::info('No hay posts en cola para el usuario: ' . $schedule->user_id . ' en horario: ' . $schedule->time);
            }
        }
    }

    private function publishToSocialMedia(Post $post)
    {
        Log::info('=== Iniciando publicación en redes sociales ===');
        Log::info('Post ID: ' . $post->id);
        Log::info('Usuario ID: ' . $post->user_id);
        Log::info('Contenido: ' . substr($post->content, 0, 100) . '...');
        Log::info('Plataformas: ' . json_encode($post->platforms));
        
        // Decodificar las plataformas si están en JSON
        $platforms = is_string($post->platforms) ? json_decode($post->platforms, true) : $post->platforms;
        
        $publishedPlatforms = [];
        $errors = [];
        
        if (is_array($platforms)) {
            foreach ($platforms as $platform) {
                Log::info('Intentando publicar en: ' . $platform);
                
                try {
                    $result = $this->publishToPlatform($post, $platform);
                    $publishedPlatforms[] = $platform;
                    Log::info('Publicado exitosamente en: ' . $platform);
                } catch (\Exception $e) {
                    $errors[] = "Error en {$platform}: " . $e->getMessage();
                    Log::error('Error publicando en ' . $platform . ': ' . $e->getMessage());
                }
            }
        }
        
        // Si no se pudo publicar en ninguna plataforma, lanzar excepción
        if (empty($publishedPlatforms) && !empty($errors)) {
            throw new \Exception('Error publicando en todas las plataformas: ' . implode('; ', $errors));
        }
        
        // Si hubo errores parciales, registrarlos pero no fallar el job
        if (!empty($errors)) {
            Log::warning('Errores parciales al publicar post ID ' . $post->id . ': ' . implode('; ', $errors));
        }
        
        Log::info('Post publicado exitosamente. Plataformas exitosas: ' . implode(', ', $publishedPlatforms));
    }
    
    private function publishToPlatform(Post $post, string $platform)
    {
        switch($platform) {
            case 'discord':
                return $this->publishToDiscord($post);
                
            case 'mastodon':
                return $this->publishToMastodon($post);
                
            default:
                throw new \Exception('Plataforma no soportada: ' . $platform);
        }
    }

    private function publishToDiscord(Post $post)
    {
        Log::info('Publicando en Discord...');
        
        try {
            $channelId = config('services.discord.channel_id');
            
            if (!$channelId) {
                throw new \Exception('Canal de Discord no configurado (DISCORD_CHANNEL_ID)');
            }
            
            $result = $this->discordService->publish($channelId, $post->content);
            
            Log::info('Post publicado en Discord exitosamente. Message ID: ' . ($result['id'] ?? 'desconocido'));
            return $result;
            
        } catch (\Exception $e) {
            Log::error('Error específico de Discord: ' . $e->getMessage());
            throw $e;
        }
    }

    private function publishToMastodon(Post $post)
    {
        Log::info('Publicando en Mastodon...');
        
        try {
            $instance = config('services.mastodon.instance', 'https://mastodon.social');
            $accessToken = config('services.mastodon.access_token');
            
            if (!$accessToken) {
                throw new \Exception('Token de acceso de Mastodon no configurado (MASTODON_ACCESS_TOKEN)');
            }
            
            // Asegurarse de que la instancia tenga el protocolo
            if (!str_starts_with($instance, 'http')) {
                $instance = 'https://' . $instance;
            }
            
            $response = Http::withToken($accessToken)
                ->post("{$instance}/api/v1/statuses", [
                    'status' => $post->content,
                    'visibility' => 'public', // public, unlisted, private, direct
                ]);

            if ($response->failed()) {
                $errorBody = $response->body();
                Log::error('Error HTTP en Mastodon: ' . $errorBody);
                throw new \Exception('Error HTTP ' . $response->status() . ' al publicar en Mastodon: ' . $errorBody);
            }

            $result = $response->json();
            Log::info('Post publicado en Mastodon exitosamente. Toot ID: ' . ($result['id'] ?? 'desconocido'));
            
            return $result;
            
        } catch (\Exception $e) {
            Log::error('Error específico de Mastodon: ' . $e->getMessage());
            throw $e;
        }
    }
}