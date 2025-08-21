<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Carbon\Carbon;

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
        ]);

        $post = new Post();
        $post->user_id = auth()->id();
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

        $post->save();

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
}
