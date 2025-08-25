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
        try {
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
                $image = $request->file('image');

                if ($image->isValid()) {
                    $path = $image->store('posts', 'public');
                    $post->image_path = $path;
                    Log::info("✅ Imagen almacenada correctamente en: storage/app/public/{$path}");
                } else {
                    Log::error("❌ La imagen no es válida o falló la validación de Laravel.");
                    return back()->withErrors(['image' => 'La imagen no es válida.'])->withInput();
                }
            } else {
                Log::info("ℹ️ No se subió ninguna imagen.");
            }

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
                        return back()->withErrors(['scheduled_at' => 'Debes indicar fecha/hora para programar.'])->withInput();
                    }
                    $post->status = 'scheduled';
                    $post->scheduled_at = Carbon::parse($validated['scheduled_at']);
                    $post->published_at = null;
                    break;
            }

            $post->platforms = $validated['platforms'] ?? [];
            $post->save();

            // Publicar si es inmediato
            if ($post->status === 'published') {
                if (in_array('discord', $post->platforms)) {
                    try {
                        $discordService = new DiscordService();
                        $discordService->publish(config('services.discord.channel_id'), $post->content);
                    } catch (\Exception $e) {
                        Log::error("❌ Error publicando en Discord: " . $e->getMessage());
                    }
                }

                if (in_array('mastodon', $post->platforms)) {
                    try {
                        $this->publishToMastodon($post->content);
                    } catch (\Exception $e) {
                        Log::error("❌ Error publicando en Mastodon: " . $e->getMessage());
                    }
                }
            }

            return redirect()->route('dashboard')->with('success', '✅ Publicación creada con éxito.');
        } catch (\Exception $e) {
            Log::error('❌ Error en store(): ' . $e->getMessage());
            return back()->withErrors(['general' => 'Error al crear el post'])->withInput();
        }
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
}
