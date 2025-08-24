<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\ProcessScheduledPosts;
use Illuminate\Support\Facades\Log;

class ProcessScheduledPostsCommand extends Command
{
    protected $signature = 'posts:process-scheduled';
    protected $description = 'Procesa los posts programados y horarios automáticos';

    public function handle()
    {
        $this->info('Procesando posts programados...');
        Log::info('Comando posts:process-scheduled ejecutado desde consola');
        
        // Ejecutar el job inmediatamente (no en cola)
        ProcessScheduledPosts::dispatchSync();
        
        $this->info('Posts programados procesados exitosamente.');
        
        return 0;
    }
}