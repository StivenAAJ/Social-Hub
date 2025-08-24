<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            // Campos adicionales para el sistema de horarios
            $table->boolean('published_by_schedule')->default(false)->after('published_at');
            $table->unsignedBigInteger('schedule_id')->nullable()->after('published_by_schedule');
            $table->text('error_message')->nullable()->after('schedule_id');
            
            // Índices para optimizar consultas
            $table->index(['status', 'scheduled_at']);
            $table->index(['user_id', 'status']);
            
            // Relación con schedules (opcional)
            $table->foreign('schedule_id')->references('id')->on('schedules')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['schedule_id']);
            $table->dropIndex(['status', 'scheduled_at']);
            $table->dropIndex(['user_id', 'status']);
            $table->dropColumn(['published_by_schedule', 'schedule_id', 'error_message']);
        });
    }
};