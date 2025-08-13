<?php

<<<<<<< Updated upstream
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use Illuminate\Foundation\Application;
=======
>>>>>>> Stashed changes
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TwoFactorController;
use App\Http\Controllers\TwoFactorChallengeController;
use App\Http\Middleware\Ensure2FAIsVerified;

Route::get('/', fn () => Inertia::render('Welcome'))->name('home');

require __DIR__.'/auth.php';

// Dashboard protegido solo por autenticación y verificación de email
Route::middleware(['auth', Ensure2FAIsVerified::class])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});

// Rutas 2FA (solo usuarios autenticados)
Route::middleware(['auth'])->group(function () {
    Route::get('/two-factor-status', [TwoFactorController::class, 'status'])->name('two-factor.status');
    Route::get('/two-factor/setup', [TwoFactorController::class, 'setup'])->name('two-factor.setup');
    Route::post('/two-factor/confirm', [TwoFactorController::class, 'confirm'])->name('two-factor.confirm');
    Route::post('/two-factor-toggle', [TwoFactorController::class, 'toggle'])->name('two-factor.toggle');
});

Route::middleware('web')->group(function () {
    Route::get('/two-factor-challenge', [TwoFactorChallengeController::class, 'create'])
        ->name('two-factor.challenge');

    Route::post('/two-factor-challenge', [TwoFactorChallengeController::class, 'store'])
        ->name('two-factor.challenge.store');
});


// Perfil protegido solo por autenticación
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
<<<<<<< Updated upstream

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
});

require __DIR__.'/auth.php';
=======
>>>>>>> Stashed changes
