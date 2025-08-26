<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index() {}

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

        // Estado y publicación inmediata
        $publishNow = false;

        switch ($validated['publish_option']) {
            case 'immediately':
                $post->status = 'published';
                $post->published_at = now();
                $publishNow = true;
                break;

            case 'queued':
                $post->status = 'queued';
                break;

            case 'scheduled':
                if (empty($validated['scheduled_at'])) {
                    return back()->withErrors(['scheduled_at' => 'Fecha programada requerida'])->withInput();
                }
                $post->status = 'scheduled';
                $post->scheduled_at = Carbon::parse($validated['scheduled_at']);
                break;
        }

        $post->platforms = $validated['platforms'] ?? [];
        $post->save();

        Log::info("✅ Post creado con estado [{$post->status}] por el usuario ID: {$post->user_id}");

        // Publicar si es inmediato
        if ($publishNow) {
            $this->publicarEnPlataformas($post);
        }

        return redirect()->route('dashboard')->with('success', 'Post creado exitosamente.');
    }

    public function publicarEnPlataformas(Post $post)
    {
        if (in_array('discord', $post->platforms)) {
            try {
                $this->publishToDiscord($post);
                Log::info("📤 Publicado en Discord correctamente");
            } catch (\Exception $e) {
                Log::error('❌ Error publicando en Discord: ' . $e->getMessage());
            }
        }

        if (in_array('mastodon', $post->platforms)) {
            try {
                $this->publishToMastodon($post->content, $post->image_path);
                Log::info("📤 Publicado en Mastodon correctamente");
            } catch (\Exception $e) {
                Log::error('❌ Error publicando en Mastodon: ' . $e->getMessage());
            }
        }
    }


    public function schedule()
    {
        return redirect()->route('publishing-schedules.index');
    }

     public function publishToDiscord(Post $post)
    {
        $token = config('services.discord.bot_token');
        $channelId = config('services.discord.channel_id');
        $discordToken = Str::startsWith($token, 'Bot ') ? $token : 'Bot ' . $token;

        $imageFullPath = $post->image_path ? storage_path('app/public/' . $post->image_path) : null;

        if ($imageFullPath && file_exists($imageFullPath)) {
            $response = Http::withHeaders([
                'Authorization' => $discordToken,
            ])->attach(
                'file',
                file_get_contents($imageFullPath),
                basename($imageFullPath)
            )->post("https://discord.com/api/v10/channels/{$channelId}/messages", [
                'content' => $post->content,
            ]);
        } else {
            $response = Http::withHeaders([
                'Authorization' => $discordToken,
                'Content-Type' => 'application/json',
            ])->post("https://discord.com/api/v10/channels/{$channelId}/messages", [
                'content' => $post->content,
            ]);
        }

        if (!$response->successful()) {
            throw new \Exception($response->body());
        }
    }

     public function publishToMastodon(string $message, ?string $imagePath = null)
    {
        $accessToken = config('services.mastodon.access_token');
        $instanceUrl = config('services.mastodon.instance');
        $mediaId = null;

        if ($imagePath) {
            $filePath = storage_path('app/public/' . $imagePath);
            $mediaResponse = Http::withToken($accessToken)
                ->attach('file', file_get_contents($filePath), basename($filePath))
                ->post("$instanceUrl/api/v2/media");

            if (!$mediaResponse->successful()) {
                throw new \Exception('Error al subir imagen a Mastodon: ' . $mediaResponse->body());
            }

            $mediaId = $mediaResponse->json()['id'];
        }

        $payload = [
            'status' => $message,
            'visibility' => 'public',
        ];

        if ($mediaId) {
            $payload['media_ids'] = [$mediaId];
        }

        $response = Http::withToken($accessToken)
            ->post("$instanceUrl/api/v1/statuses", $payload);

        if (!$response->successful()) {
            throw new \Exception('Error al publicar en Mastodon: ' . $response->body());
        }
    }





    public function publishedAndScheduled()
    {
        $publishedPosts = Post::where('user_id', Auth::id())
            ->where('status', 'published')
            ->orderByDesc('published_at')
            ->get()
            ->map(function ($post) {
                $post->image_url = $post->image_path ? Storage::url($post->image_path) : null;
                return $post;
            });

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
