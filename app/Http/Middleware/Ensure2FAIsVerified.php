<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Ensure2FAIsVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return $next($request);
        }

        // 🔍 Log de diagnóstico 2FA
        logger('2FA middleware: ', [
            'user_id' => Auth::id(),
            '2fa_enabled' => Auth::user()->two_factor_enabled,
            '2fa_verified' => session('2fa_verified'),
            'url' => $request->path(),
        ]);

        if (!Auth::user()->two_factor_enabled || session('2fa_verified')) {
            return $next($request);
        }

        if (str_starts_with($request->path(), 'two-factor-challenge')) {
            return $next($request);
        }
        return redirect()->route('two-factor.challenge');
    }
}
