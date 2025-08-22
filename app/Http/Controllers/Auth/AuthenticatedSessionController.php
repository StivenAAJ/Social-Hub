<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Mostrar formulario de login
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => true,
            'status' => session('status'),
        ]);
    }

    /**
     * Procesar login
     */
    public function store(Request $request)
    {
        $request->validate([
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $user = Auth::user();

        // Si el usuario tiene 2FA activo
        if ($user->two_factor_enabled && $user->two_factor_secret) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            session([
                '2fa:user:id' => $user->id,
                '2fa_verified' => false,
            ]);

            return redirect()->route('two-factor.challenge');
        }
    }


    /**
     * Logout
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->forget(['2fa_verified', '2fa:user:id']);
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
