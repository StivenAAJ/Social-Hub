<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureTwoFactorVerified
{
    public function handle(Request $request, Closure $next)
    {
        $u = $request->user();

        // Si no hay usuario o no tiene 2FA activo, sigue normal
        if (!$u || !$u->two_factor_enabled || empty($u->two_factor_secret)) {
            return $next($request);
        }

        // Si 2FA está activo pero no ha pasado el challenge en esta sesión => redirige
        if (!session('2fa_passed')) {
            // Si la request es Inertia/HTML, redirige a la vista de reto
            if ($request->expectsJson()) {
                return response()->json(['message' => '2FA required'], 423);
            }
            return redirect()->route('2fa.challenge');

        }

        return $next($request);
    }
}
