<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;


class ScheduleController extends Controller
{
    public function index()
    {
        // Obtener horarios actuales del usuario organizados por día
        $userSchedules = Schedule::where('user_id', Auth::id())
            ->get()
            ->groupBy('day_of_week');

        // Formatear horarios para el frontend
        $schedules = [
            'monday' => $userSchedules->get('monday', collect())->pluck('time')->map(function ($time) {
                // Convertir HH:MM:SS a HH:MM para el frontend
                return substr($time, 0, 5);
            })->toArray(),
            'tuesday' => $userSchedules->get('tuesday', collect())->pluck('time')->map(function ($time) {
                return substr($time, 0, 5);
            })->toArray(),
            'wednesday' => $userSchedules->get('wednesday', collect())->pluck('time')->map(function ($time) {
                return substr($time, 0, 5);
            })->toArray(),
            'thursday' => $userSchedules->get('thursday', collect())->pluck('time')->map(function ($time) {
                return substr($time, 0, 5);
            })->toArray(),
            'friday' => $userSchedules->get('friday', collect())->pluck('time')->map(function ($time) {
                return substr($time, 0, 5);
            })->toArray(),
            'saturday' => $userSchedules->get('saturday', collect())->pluck('time')->map(function ($time) {
                return substr($time, 0, 5);
            })->toArray(),
            'sunday' => $userSchedules->get('sunday', collect())->pluck('time')->map(function ($time) {
                return substr($time, 0, 5);
            })->toArray(),
        ];

        return Inertia::render('Posts/Schedule', [
            'schedules' => $schedules,
        ]);
    }

    public function store(Request $request)
    {
        Log::info('=== GUARDANDO HORARIOS DE PUBLICACIÓN ===');
        Log::info('Datos recibidos: ', $request->all());

        try {
            // Validación personalizada para asegurar formato correcto
            $request->validate([
                'schedules' => 'required|array',
                'schedules.monday' => 'array',
                'schedules.tuesday' => 'array',
                'schedules.wednesday' => 'array',
                'schedules.thursday' => 'array',
                'schedules.friday' => 'array',
                'schedules.saturday' => 'array',
                'schedules.sunday' => 'array',
            ]);

            // Validar cada horario individualmente
            $schedules = $request->input('schedules', []);
            $validSchedules = [];

            foreach ($schedules as $day => $times) {
                if (!is_array($times)) {
                    continue;
                }

                $validTimes = [];
                foreach ($times as $time) {
                    // Validar formato de tiempo con delimitadores correctos para preg_match
                    if (is_string($time) && preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $time)) {
                        // Normalizar formato a HH:MM
                        $timeParts = explode(':', $time);
                        $normalizedTime = sprintf('%02d:%02d', (int)$timeParts[0], (int)$timeParts[1]);
                        $validTimes[] = $normalizedTime;
                    }
                }
                $validSchedules[$day] = $validTimes;
            }

            DB::beginTransaction();

            // Eliminar horarios existentes del usuario
            Schedule::where('user_id', Auth::id())->delete();

            // Crear nuevos horarios
            $createdCount = 0;
            foreach ($validSchedules as $dayOfWeek => $times) {
                foreach ($times as $time) {
                    // Convertir a formato HH:MM:SS para la base de datos
                    $timeFormatted = $time . ':00';

                    Schedule::create([
                        'user_id' => Auth::id(),
                        'day_of_week' => $dayOfWeek,
                        'time' => $timeFormatted,
                    ]);

                    $createdCount++;
                    Log::info("Horario creado: {$dayOfWeek} a las {$timeFormatted}");
                }
            }

            DB::commit();

            Log::info("Horarios guardados exitosamente. Total creados: {$createdCount}");

            return redirect()->route('publishing-schedules.index')
                ->with('success', "Horarios de publicación guardados correctamente. Se crearon {$createdCount} horarios.");
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollback();
            Log::error('Error de validación: ' . json_encode($e->errors()));

            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error guardando horarios: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return back()->withErrors([
                'general' => 'Error guardando los horarios. Por favor, verifica que todos los horarios tengan un formato válido (HH:MM).'
            ]);
        }
    }

    public function assignSchedule(Request $request)
    {
        Log::info('=== INICIO assignSchedule ===');
        Log::info('Request data completo: ', $request->all());

        try {
            $validated = $request->validate([
                'post_id' => 'required|exists:posts,id',
                'scheduled_at' => 'required|string'
            ]);

            Log::info('Datos validados: ', $validated);

            $receivedDateString = $validated['scheduled_at'];
            Log::info('Fecha recibida (string): ' . $receivedDateString);

            // Crear la fecha interpretando como Costa Rica timezone
            $scheduledDate = Carbon::createFromFormat('Y-m-d\TH:i', $receivedDateString, 'America/Costa_Rica');
            $now = Carbon::now('America/Costa_Rica');

            Log::info('=== DEBUGGING ZONAS HORARIAS (COSTA RICA) ===');
            Log::info('Timezone configurada: America/Costa_Rica');
            Log::info('Input recibido: ' . $receivedDateString);
            Log::info('Fecha actual (Costa Rica): ' . $now->toDateTimeString());
            Log::info('Fecha programada (Costa Rica): ' . $scheduledDate->toDateTimeString());
            Log::info('Fecha actual (UTC): ' . $now->utc()->toDateTimeString());
            Log::info('Fecha programada (UTC): ' . $scheduledDate->utc()->toDateTimeString());

            // Validación: la fecha programada debe ser futura
            if ($scheduledDate->lte($now)) {
                Log::warning('Fecha programada no es futura');

                return back()->withErrors([
                    'scheduled_at' => 'La fecha programada debe ser posterior al momento actual. (Ahora: ' .
                        $now->format('Y-m-d H:i:s') . ', Programada: ' . $scheduledDate->format('Y-m-d H:i:s') . ')'
                ]);
            }

            $post = Post::findOrFail($validated['post_id']);

            if ($post->user_id !== Auth::id()) {
                return back()->withErrors(['post_id' => 'No tienes permiso para editar esta publicación']);
            }

            if ($post->status !== 'queued') {
                return back()->withErrors(['post_id' => 'Solo se pueden programar publicaciones en cola']);
            }

            // Convertir a UTC para almacenamiento en base de datos
            $scheduledDateUTC = $scheduledDate->utc();

            $post->update([
                'scheduled_at' => $scheduledDateUTC,
                'status' => 'scheduled'
            ]);

            Log::info('Post actualizado exitosamente');
            Log::info('Fecha guardada en BD (UTC): ' . $post->fresh()->scheduled_at);

            return redirect()->route('schedules.index')
                ->with('success', 'Publicación programada correctamente para ' .
                    $scheduledDate->format('d/m/Y H:i') . ' (hora de Costa Rica)');
        } catch (\Exception $e) {
            Log::error('Error en assignSchedule: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return back()->withErrors(['general' => 'Error interno del servidor: ' . $e->getMessage()]);
        }
    }

    public function unassignPost(Post $post)
    {
        if ($post->user_id !== Auth::id()) {
            abort(403);
        }

        $post->update([
            'scheduled_at' => null,
            'status' => 'queued'
        ]);

        return redirect()->route('schedules.index')
            ->with('success', 'Publicación desasignada correctamente');
    }

    public function updatePostStatus(Post $post, Request $request)
    {
        if ($post->user_id !== Auth::id()) {
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

        return redirect()->route('schedules.index')
            ->with('success', 'Estado actualizado correctamente');
    }

    // Método adicional para obtener estadísticas
    public function getStats()
    {
        $totalSchedules = Schedule::where('user_id', Auth::id())->count();
        $activeDays = Schedule::where('user_id', Auth::id())
            ->distinct('day_of_week')
            ->count();

        $averagePerDay = $totalSchedules > 0 ? round($totalSchedules / 7, 1) : 0;

        return response()->json([
            'total_schedules' => $totalSchedules,
            'active_days' => $activeDays,
            'average_per_day' => $averagePerDay
        ]);
    }
}
