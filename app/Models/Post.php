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
        'published_by_schedule',
        'schedule_id',
        'error_message'
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'published_at' => 'datetime',
        'platforms' => 'array',
        'published_by_schedule' => 'boolean',
    ];

    /**
     * Relación con el usuario creador del post.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación con el horario asociado (si aplica).
     */
    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }


}
