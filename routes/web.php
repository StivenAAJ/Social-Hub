<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TwoFactorController;
use App\Http\Controllers\TwoFactorChallengeController;
use App\Http\Controllers\PostController;
use App\Http\Middleware\Ensure2FAIsVerified;
use App\Http\Controllers\OAuthController;

// Página de bienvenida pública
Route::get('/', fn () => Inertia::render('Welcome'))->name('home');

// Rutas de autenticación (login, registro, etc.)
require __DIR__.'/auth.php';

// Rutas protegidas con autenticación Y verificación 2FA (dashboard, etc.)
Route::middleware(['auth', Ensure2FAIsVerified::class])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});

// Rutas de configuración de 2FA (solo necesitan estar autenticados)
Route::middleware(['auth'])->group(function () {
    Route::get('/two-factor-status', [TwoFactorController::class, 'status'])->name('two-factor.status');
    Route::get('/two-factor/setup', [TwoFactorController::class, 'setup'])->name('two-factor.setup');
    Route::post('/two-factor/confirm', [TwoFactorController::class, 'confirm'])->name('two-factor.confirm');
    Route::post('/two-factor-toggle', [TwoFactorController::class, 'toggle'])->name('two-factor.toggle');
});

// Rutas del challenge 2FA (solo autenticación, NO debe llevar Ensure2FAIsVerified)
Route::middleware(['auth'])->group(function () {
    Route::get('/two-factor-challenge', [TwoFactorChallengeController::class, 'create'])
        ->name('two-factor.challenge');

    Route::post('/two-factor-challenge', [TwoFactorChallengeController::class, 'store'])
        ->name('two-factor.challenge.store');
});

// Rutas de perfil (solo autenticación)
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/socials/connect', function () {
        return Inertia::render('Social/Connect');
    })->name('socials.connect');
});


// Rutas de posts (requieren email verificado)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');

    Route::get('/posts/schedule', [PostController::class, 'schedule'])->name('posts.schedule');
});



Route::middleware(['auth'])->group(function () {
    Route::get('/auth/discord/redirect', [OAuthController::class, 'redirectToDiscord'])->name('auth.discord');
    Route::get('/auth/discord/callback', [OAuthController::class, 'handleDiscordCallback']);

    Route::get('/auth/mastodon/redirect', [OAuthController::class, 'redirectToMastodon'])->name('auth.mastodon');
    Route::get('/auth/mastodon/callback', [OAuthController::class, 'handleMastodonCallback']);
});

Route::get('/auth/discord/disconnect', [OAuthController::class, 'disconnectDiscord'])->name('discord.disconnect');

Route::get('auth/mastodon', [OAuthController::class, 'redirectToMastodon']);
Route::get('auth/mastodon/callback', [OAuthController::class, 'handleMastodonCallback']);

Route::get('/auth/mastodon/disconnect', [OAuthController::class, 'disconnectMastodon']);
