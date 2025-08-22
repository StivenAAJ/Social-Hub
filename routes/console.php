<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

use App\Schedule\PostScheduler;
use Illuminate\Support\Facades\Schedule;

Schedule::call(new PostScheduler())->everyMinute();


Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
