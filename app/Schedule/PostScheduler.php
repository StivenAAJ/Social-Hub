<?php

namespace App\Schedule;

use App\Models\Post;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Log;

class PostScheduler
{
    public function __invoke()
    {
        $posts = Post::where('status', 'scheduled')
            ->where('scheduled_at', '<=', now())
            ->get();

        foreach ($posts as $post) {
            foreach ($posts as $post) {
                /** @var \App\Http\Controllers\PostController $controller */
                $controller = new PostController();

                if (in_array('discord', $post->platforms)) {
                    $controller->postToDiscord($post->content);
                }

                if (in_array('mastodon', $post->platforms)) {
                    $controller->publishToMastodon($post->content);
                }

                $post->status = 'published';
                $post->published_at = now();
                $post->save();

                Log::info("✅ Publicado post ID {$post->id}");
            }
        }
    }
}
