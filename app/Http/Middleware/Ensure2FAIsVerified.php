<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Ensure2FAIsVerified
{
    public function handle(Request $request, Closure $next)
    {
        // Si el usuario no ha iniciado sesión, que siga su camino
        if (!Auth::check()) {
            return $next($request);
        }

        // Ignorar si ya está verificado o no tiene 2FA activado
        if (
            session('2fa_verified') || 
            !Auth::user()->two_factor_enabled
        ) {
            return $next($request);
        }

        // Permitir acceder a la página de challenge sin redireccionar de nuevo
        if (
            $request->is('two-factor-challenge') ||
            $request->is('two-factor-challenge/*')
        ) {
            return $next($request);
        }

        // Redirigir al reto de 2FA
        return redirect()->route('two-factor.challenge');
    }
}
