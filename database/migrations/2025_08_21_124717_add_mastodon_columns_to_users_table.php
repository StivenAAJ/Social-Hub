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
            $table->string('mastodon_id')->nullable()->after('id');
            $table->string('mastodon_token')->nullable()->after('mastodon_id');
            $table->string('mastodon_refresh_token')->nullable()->after('mastodon_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['mastodon_id', 'mastodon_token', 'mastodon_refresh_token']);
        });
    }
};
