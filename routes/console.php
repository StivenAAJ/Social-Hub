<?php
// routes/console.php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Jobs\ProcessScheduledPosts;

use App\Schedule\PostScheduler;


Schedule::call(new PostScheduler())->everyMinute();


Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Programar el Job para procesar publicaciones
Schedule::job(new ProcessScheduledPosts())->everyMinute();