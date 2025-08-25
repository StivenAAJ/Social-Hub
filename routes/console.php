<?php
// routes/console.php

use Illuminate\Support\Facades\Schedule;
use App\Jobs\ProcessScheduledPosts;
use App\Services\DiscordService;

use App\Schedule\PostScheduler;


Schedule::call(function () {
    $discordService = app(DiscordService::class); // inyección del servicio
    dispatch(new ProcessScheduledPosts($discordService)); // correcto
})->everyMinute();