<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Ensure2FAIsVerified
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && $user->two_factor_enabled && !$request->session()->get('2fa_verified', false)) {
            return redirect()->route('two-factor.challenge');
        }

        return $next($request);
    }
}
