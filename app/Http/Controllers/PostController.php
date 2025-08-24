<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Services\DiscordService;


class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function create()
    {
        return inertia('Posts/Create');
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
            $post->image_path = $request->file('image')->store('posts', 'public');
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
                    return back()->withErrors(['scheduled_at' => 'Please provide a scheduled date and time.'])->withInput();
                }
                $post->status = 'scheduled';
                $post->scheduled_at = Carbon::parse($validated['scheduled_at']);
                $post->published_at = null;
                break;
        }

        $post->platforms = $validated['platforms'] ?? [];
        $post->save();

        
        if ($post->status === 'published') {
            if (in_array('discord', $post->platforms)) {
                $discordService = new DiscordService();
                try {
                    $discordService->publish(config('services.discord.channel_id'), $post->content);
                } catch (\Exception $e) {
                    \Log::error('Error publicando inmediatamente en Discord: ' . $e->getMessage());
                }
            }

            if (in_array('mastodon', $post->platforms)) {
                $this->publishToMastodon($post->content);
            }
        }

        return redirect()->route('dashboard')->with('success', 'Post created successfully.');
    }


    public function schedule()
    {
        return inertia('Posts/Schedule');
    }


    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
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
