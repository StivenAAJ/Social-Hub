<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'content',
        'image_path',
        'scheduled_at',
        'published_at',
        'status',
        'platforms',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'published_at' => 'datetime',
        'platforms' => 'array',
    ];

    /**
     * Relación con el usuario creador del post.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
