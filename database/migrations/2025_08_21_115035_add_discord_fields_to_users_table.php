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
        Schema::table('users', function (Blueprint $table) {
            // ID de Discord (cada usuario de Discord tiene un ID único)
            $table->string('discord_id')->nullable()->unique()->after('remember_token');

            // Token de acceso que devuelve Discord
            $table->string('discord_token')->nullable()->after('discord_id');

            // Refresh token para renovar el acceso
            $table->string('discord_refresh_token')->nullable()->after('discord_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['discord_id', 'discord_token', 'discord_refresh_token']);
        });
    }
};
