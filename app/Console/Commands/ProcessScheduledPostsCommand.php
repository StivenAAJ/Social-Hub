<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\ProcessScheduledPosts;
use App\Services\DiscordService; // Asegúrate de tener este servicio
use Illuminate\Support\Facades\Log;

class ProcessScheduledPostsCommand extends Command
{
    protected $signature = 'posts:process-scheduled';
    protected $description = 'Procesa los posts programados y horarios automáticos';

    public function handle()
    {
        $this->info('Procesando posts programados...');
        Log::info('Comando posts:process-scheduled ejecutado desde consola');

        // Resolver dependencia del servicio y pasarla al Job
        $discordService = app(DiscordService::class);
        ProcessScheduledPosts::dispatchSync($discordService);

        $this->info('Posts programados procesados exitosamente.');

        return 0;
    }
}
