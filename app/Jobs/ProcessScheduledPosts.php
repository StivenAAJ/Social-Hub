<?php

namespace App\Jobs;

use App\Models\Schedule;
use App\Models\Post;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ProcessScheduledPosts implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        $now = Carbon::now('UTC');
        Log::info('ProcessScheduledPosts ejecutándose a las: ' . $now->toDateTimeString());
        
        // Procesar posts programados que ya llegó su hora (con margen de 1 minuto hacia atrás)
        $scheduledPosts = Post::where('status', 'scheduled')
                             ->where('scheduled_at', '<=', $now->addMinute()) // Dar margen de 1 minuto
                             ->get();

        Log::info('Posts programados encontrados: ' . $scheduledPosts->count());

        foreach ($scheduledPosts as $post) {
            Log::info('Procesando post ID: ' . $post->id . ' programado para: ' . $post->scheduled_at);
            
            // Aquí publicas a redes sociales
            $this->publishToSocialMedia($post);
            
            $post->update([
                'status' => 'published',
                'published_at' => $now
            ]);
            
            Log::info('Post ID: ' . $post->id . ' publicado exitosamente');
        }

        // Procesar horarios automáticos
        $dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        $currentDay = $dayNames[$now->dayOfWeek];
        $currentTime = $now->format('H:i:00');

        $schedules = Schedule::where('day_of_week', $currentDay)
                           ->where('time', $currentTime)
                           ->get();

        foreach ($schedules as $schedule) {
            $queuedPost = Post::where('user_id', $schedule->user_id)
                             ->where('status', 'queued')
                             ->orderBy('created_at')
                             ->first();

            if ($queuedPost) {
                $this->publishToSocialMedia($queuedPost);
                
                $queuedPost->update([
                    'status' => 'published',
                    'published_at' => $now
                ]);
                
                Log::info('Post automático ID: ' . $queuedPost->id . ' publicado por horario');
            }
        }
    }

    private function publishToSocialMedia(Post $post)
    {
        // Implementa tu lógica de publicación aquí
        Log::info('Publicando en redes sociales: ' . $post->content);
    }
}