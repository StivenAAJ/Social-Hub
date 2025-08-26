<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Services\DiscordService;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        //
    }

    public function create()
    {
        return inertia('Posts/Create');
    }

    public function history()
    {
        $posts = Post::where('user_id', Auth::id())
            ->whereNotNull('published_at')
            ->orderByDesc('published_at')
            ->get()
            ->map(function ($post) {
                $post->image_url = $post->image_path ? Storage::url($post->image_path) : null;
                return $post;
            });

        return Inertia::render('Posts/History', [
            'posts' => $posts
        ]);
    }

    public function queue()
    {
        $posts = Post::where('user_id', Auth::id())
            ->whereNull('published_at')
            ->whereNotNull('scheduled_at')
            ->orderBy('scheduled_at')
            ->get()
            ->map(function ($post) {
                $post->image_url = $post->image_path ? Storage::url($post->image_path) : null;
                return $post;
            });

        return Inertia::render('Posts/Queue', [
            'posts' => $posts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'image' => 'nullable|image|max:2048',
            'scheduled_at' => 'nullable|date',
            'publish_option' => 'required|in:immediately,queued,scheduled',
            'platforms' => 'nullable|array',
        ]);

        $post = new Post();
        $post->user_id = Auth::id();
        $post->content = $validated['content'];

        // Manejo de imagen con logs y validaciones
        if ($request->hasFile('image')) {
            try {
                $image = $request->file('image');

                if (!$image->isValid()) {
                    throw new \Exception('Imagen no válida: ' . $image->getErrorMessage());
                }

                $path = $image->store('posts', 'public');
                $post->image_path = $path;

                Log::info("📸 Imagen guardada correctamente: {$path}");
            } catch (\Exception $e) {
                Log::error("❌ Falla en subida de imagen: " . $e->getMessage());
                return back()->withErrors(['image' => 'Fallo al subir la imagen'])->withInput();
            }
        } else {
            Log::info('ℹ️ No se adjuntó imagen en el request');
        }

        // Determinar estado del post según opción
        switch ($validated['publish_option']) {
            case 'immediately':
                $post->status = 'published';
                $post->published_at = now();
                $post->scheduled_at = null;
                break;

            case 'queued':
                $post->status = 'queued';
                $post->published_at = null;
                $post->scheduled_at = null;
                break;

            case 'scheduled':
                if (empty($validated['scheduled_at'])) {
                    return back()->withErrors(['scheduled_at' => 'Please provide a scheduled date and time.'])->withInput();
                }
                $post->status = 'scheduled';
                $post->scheduled_at = Carbon::parse($validated['scheduled_at']);
                $post->published_at = null;
                break;
        }

        $post->platforms = $validated['platforms'] ?? [];
        $post->save();

        Log::info("✅ Post creado con estado [{$post->status}] por el usuario ID: {$post->user_id}");

        // Si se publica inmediatamente, enviar a plataformas
        if ($post->status === 'published') {
            if (in_array('discord', $post->platforms)) {
                try {
                    $discordService = new DiscordService();
                    $discordService->publish(config('services.discord.channel_id'), $post->content);
                    Log::info("📤 Publicado en Discord");
                } catch (\Exception $e) {
                    Log::error('Error publicando en Discord: ' . $e->getMessage());
                }
            }

            if (in_array('mastodon', $post->platforms)) {
                try {
                    $this->publishToMastodon($post->content);
                    Log::info("📤 Publicado en Mastodon");
                } catch (\Exception $e) {
                    Log::error('Error publicando en Mastodon: ' . $e->getMessage());
                }
            }
        }

        return redirect()->route('dashboard')->with('success', 'Post creado exitosamente.');
    }



    public function schedule()
    {
        return redirect()->route('publishing-schedules.index');
    }

    public function show(Post $post)
    {
        //
    }

    public function edit(Post $post)
    {
        //
    }

    public function update(Request $request, Post $post)
    {
        //
    }

    public function destroy(Post $post)
    {
        //
    }

    public function postToDiscord($content)
    {
        $discordToken = config('services.discord.bot_token');
        $channelId = config('services.discord.channel_id');

        $response = Http::withHeaders([
            'Authorization' => $discordToken,
            'Content-Type' => 'application/json',
        ])->post("https://discord.com/api/v10/channels/{$channelId}/messages", [
            'content' => $content,
        ]);

        if (!$response->successful()) {
            Log::error('Discord post failed: ' . $response->body());
        }

        return $response->successful();
    }

    public function publishToMastodon(string $message)
    {
        $accessToken = config('services.mastodon.access_token');
        $instanceUrl = config('services.mastodon.instance');

        $response = Http::withToken($accessToken)
            ->post("$instanceUrl/api/v1/statuses", [
                'status' => $message,
                'visibility' => 'public',
            ]);

        if ($response->successful()) {
            return $response->json();
        }

        Log::error('Error al publicar en Mastodon', [
            'status' => $response->status(),
            'body' => $response->body(),
            'headers' => $response->headers(),
        ]);

        throw new \Exception('No se pudo publicar en Mastodon');
    }

    public function publishedAndScheduled()
    {
        // 📌 Publicados
        $publishedPosts = Post::where('user_id', Auth::id())
            ->where('status', 'published')
            ->orderByDesc('published_at')
            ->get()
            ->map(function ($post) {
                $post->image_url = $post->image_path ? Storage::url($post->image_path) : null;
                return $post;
            });

        // 📌 Programados
        $scheduledPosts = Post::where('user_id', Auth::id())
            ->where('status', 'scheduled')
            ->orderBy('scheduled_at')
            ->get()
            ->map(function ($post) {
                $post->image_url = $post->image_path ? Storage::url($post->image_path) : null;
                return $post;
            });

        return Inertia::render('Posts/History', [
            'publishedPosts' => $publishedPosts,
            'scheduledPosts' => $scheduledPosts,
        ]);
    }

    public function queued()
    {
        // 📌 En cola
        $queuedPosts = Post::where('user_id', Auth::id())
            ->where('status', 'queued')
            ->orderBy('created_at')
            ->get()
            ->map(function ($post) {
                $post->image_url = $post->image_path ? Storage::url($post->image_path) : null;
                return $post;
            });

        return Inertia::render('Posts/Queue', [
            'queuedPosts' => $queuedPosts,
        ]);
    }


}
