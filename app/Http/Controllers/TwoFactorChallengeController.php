<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use PragmaRX\Google2FA\Google2FA;
use App\Models\User;

class TwoFactorChallengeController extends Controller
{
    /**
     * Mostrar la vista del reto 2FA
     */
    public function create()
    {
        if (! session()->has('2fa:user:id')) {
            return redirect()
                ->route('login')
                ->withErrors(['code' => 'Sesión 2FA no encontrada o expirada.']);
        }

        return Inertia::render('Auth/TwoFactorChallenge');
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => ['required', 'digits:6']
        ]);

        $userId = session('2fa:user:id');
        $user   = User::findOrFail($userId);

        $google2fa = new \PragmaRX\Google2FA\Google2FA();

        if (! $google2fa->verifyKey($user->two_factor_secret, $request->code, 1)) {
            return back()->withErrors(['code' => 'Código inválido o expirado']);
        }

        // ✅ marcar sesión
        session(['2fa_verified' => true]);
        session()->forget('2fa:user:id');

        // ✅ login definitivo
        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }
}
