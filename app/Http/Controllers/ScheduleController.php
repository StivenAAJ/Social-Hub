<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ScheduleController extends Controller
{
    public function index() 
    {
        $schedules = Schedule::where('user_id', auth()->id())->get();
        $posts = Post::where('user_id', auth()->id())
                    ->orderBy('created_at', 'desc')
                    ->get();
        
        return inertia('Schedules/Index', [
            'schedules' => $schedules,
            'posts' => $posts
        ]);
    }

    public function assignSchedule(Request $request)
    {
        Log::info('=== INICIO assignSchedule ===');
        Log::info('Request data completo: ', $request->all());

        try {
            // Validación básica
            $validated = $request->validate([
                'post_id' => 'required|exists:posts,id',
                'scheduled_at' => 'required|string'  // Cambiar a string para manejar datetime-local
            ]);

            Log::info('Datos validados: ', $validated);

            $receivedDateString = $validated['scheduled_at'];
            Log::info('Fecha recibida (string): ' . $receivedDateString);

            // IMPORTANTE: datetime-local viene como "2025-08-16T20:43" (sin zona horaria)
            // Necesitamos interpretarla como la hora LOCAL del usuario, no como UTC
            
            // Para esto, vamos a asumir que la fecha viene en la zona horaria del usuario
            // y convertirla a UTC para almacenamiento
            
            // Primero, crear la fecha asumiendo que es local del servidor
            $scheduledDate = Carbon::createFromFormat('Y-m-d\TH:i', $receivedDateString);
            $now = Carbon::now();
            
            Log::info('=== DEBUGGING ZONAS HORARIAS ===');
            Log::info('Timezone configurada en Laravel: ' . config('app.timezone'));
            Log::info('Input recibido: ' . $receivedDateString);
            Log::info('Fecha actual (servidor): ' . $now->toDateTimeString());
            Log::info('Fecha programada (interpretada como local): ' . $scheduledDate->toDateTimeString());
            Log::info('Fecha actual (UTC): ' . $now->utc()->toDateTimeString());
            Log::info('Fecha programada (UTC): ' . $scheduledDate->utc()->toDateTimeString());
            
            // Comparar en la misma zona horaria
            $diffInSeconds = $scheduledDate->diffInSeconds($now, false);
            Log::info('Diferencia en segundos (local): ' . $diffInSeconds);
            
            // Validación: la fecha programada debe ser futura
            if ($scheduledDate->lte($now)) {
                Log::warning('Fecha programada no es futura');
                Log::warning('Ahora: ' . $now->toDateTimeString());
                Log::warning('Programada: ' . $scheduledDate->toDateTimeString());
                
                return back()->withErrors([
                    'scheduled_at' => 'La fecha programada debe ser posterior al momento actual. (Ahora: ' . $now->format('Y-m-d H:i:s') . ', Programada: ' . $scheduledDate->format('Y-m-d H:i:s') . ')'
                ]);
            }

            $post = Post::findOrFail($validated['post_id']);
            
            // Verificaciones de permisos
            if ($post->user_id !== auth()->id()) {
                return back()->withErrors(['post_id' => 'No tienes permiso para editar esta publicación']);
            }

            if ($post->status !== 'queued') {
                return back()->withErrors(['post_id' => 'Solo se pueden programar publicaciones en cola']);
            }

            // Guardar la fecha (Carbon ya la maneja en UTC para la BD)
            $post->update([
                'scheduled_at' => $scheduledDate,
                'status' => 'scheduled'
            ]);

            Log::info('Post actualizado exitosamente');
            Log::info('Fecha guardada en BD (UTC): ' . $post->fresh()->scheduled_at);
            
            return redirect()->route('schedules.index')->with('success', 'Publicación programada correctamente');

        } catch (\Exception $e) {
            Log::error('Error en assignSchedule: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return back()->withErrors(['general' => 'Error interno del servidor: ' . $e->getMessage()]);
        }
    }

    public function unassignPost(Post $post)
    {
        if ($post->user_id !== auth()->id()) {
            abort(403);
        }

        $post->update([
            'scheduled_at' => null,
            'status' => 'queued'
        ]);

        return redirect()->route('schedules.index')->with('success', 'Publicación desasignada correctamente');
    }

    public function updatePostStatus(Post $post, Request $request)
    {
        if ($post->user_id !== auth()->id()) {
            abort(403);
        }
        
        $validated = $request->validate([
            'status' => 'required|in:queued,scheduled,published'
        ]);

        $updateData = ['status' => $validated['status']];
        
        if ($validated['status'] === 'queued') {
            $updateData['scheduled_at'] = null;
        }

        $post->update($updateData);
        
        return redirect()->route('schedules.index')->with('success', 'Estado actualizado correctamente');
    }
}