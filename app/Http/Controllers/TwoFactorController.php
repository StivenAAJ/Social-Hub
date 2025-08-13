<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    /**
     * POST /two-factor-toggle
     * Activa/desactiva 2FA. Para activar, debe haberse confirmado el código antes (setup + confirm).
     */
    public function toggle(Request $request): JsonResponse
    {
        $data = $request->validate(['enabled' => ['required', 'boolean']]);
        $user = $request->user();

        // No permitimos activar si no hay secret confirmado
        if ($data['enabled'] && empty($user->two_factor_secret)) {
            return response()->json([
                'ok' => false,
                'message' => 'Primero realiza la configuración (setup) y confirmación del OTP.',
            ], 422);
        }

        $user->two_factor_enabled = $data['enabled'];

        // Si se desactiva, limpiamos secret y códigos de recuperación
        if (!$data['enabled']) {
            $user->two_factor_secret = null;
            $user->two_factor_recovery_codes = null;
            Session::forget('2fa_passed');
        }

        $user->save();

        return response()->json([
            'ok' => true,
            'two_factor_enabled' => (bool) $user->two_factor_enabled,
        ]);
    }

    /**
     * GET /two-factor-status
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'two_factor_enabled' => (bool) ($user->two_factor_enabled ?? false),
        ]);
    }

    /**
     * GET /two-factor/setup
     * Genera un secret temporal y devuelve el otpauth:// para mostrar QR.
     */
    public function setup(Request $request): JsonResponse
    {
        $user = $request->user();
        $google2fa = new Google2FA();

        // Secret temporal (NO se guarda aún en BD)
        $secret = $google2fa->generateSecretKey(32);

        // Guardar en sesión para confirmar luego
        Session::put('2fa_temp_secret', $secret);

        // otpauth URI que entiende la app de autenticación (Google Authenticator, etc.)
        $appName = config('app.name', 'Laravel');
        $otpauth = $google2fa->getQRCodeUrl($appName, $user->email, $secret);

        return response()->json([
            'ok'      => true,
            'otpauth' => $otpauth,
            'secret'  => $secret, // opcional mostrarlo
        ]);
    }

    /**
     * POST /two-factor/confirm
     * Confirma el OTP contra el secret temporal y activa 2FA (guarda secret definitivo + recovery codes).
     */
    public function confirm(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => ['required', 'digits:6'],
        ]);

        $user = $request->user();
        $tempSecret = Session::get('2fa_temp_secret');

        if (!$tempSecret) {
            return response()->json([
                'ok' => false,
                'message' => 'No hay secreto temporal. Ejecuta el setup otra vez.',
            ], 422);
        }

        $google2fa = new Google2FA();

        // window=1 → tolera +/- 30s de desfase
        $valid = $google2fa->verifyKey($tempSecret, $data['code'], 1);

        if (!$valid) {
            return response()->json([
                'ok' => false,
                'message' => 'Código OTP inválido.',
            ], 422);
        }

        // Guardar secret definitivo y habilitar
        $user->two_factor_secret  = $tempSecret;
        $user->two_factor_enabled = true;

        // Generar códigos de recuperación (8 de ejemplo)
        $recovery = collect(range(1, 8))->map(function () {
            return Str::upper(Str::random(10)) . '-' . Str::upper(Str::random(10));
        });

        // Puedes encriptarlos si quieres, aquí los guardo en JSON plano
        $user->two_factor_recovery_codes = $recovery->toJson();
        $user->save();

        // Limpiar secreto temporal de sesión
        Session::forget('2fa_temp_secret');

        return response()->json([
            'ok' => true,
            'two_factor_enabled' => true,
            'recovery_codes' => $recovery, // opcional devolverlos para mostrarlos/descargarlos
        ]);
    }

    /**
     * POST /two-factor/disable
     * Desactiva 2FA y limpia secret/códigos.
     */
    public function disable(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->two_factor_enabled = false;
        $user->two_factor_secret  = null;
        $user->two_factor_recovery_codes = null;
        $user->save();

        Session::forget('2fa_passed');

        return response()->json([
            'ok' => true,
            'two_factor_enabled' => false,
        ]);
    }

    /**
     * POST /2fa/verify-login  (opcional)
     * Verifica el OTP en el reto post-login y marca la sesión como aprobada.
     */
    public function verifyLogin(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => ['required', 'digits:6'],
        ]);

        $user = $request->user();

        if (!$user || !$user->two_factor_enabled || empty($user->two_factor_secret)) {
            return response()->json([
                'ok' => false,
                'message' => '2FA no está configurado para este usuario.',
            ], 422);
        }

        $google2fa = new Google2FA();
        $valid = $google2fa->verifyKey($user->two_factor_secret, $data['code'], 1);

        if (!$valid) {
            return response()->json([
                'ok' => false,
                'message' => 'Código OTP inválido.',
            ], 422);
        }

        Session::put('2fa_passed', true);

        return response()->json([
            'ok' => true,
            'message' => '2FA verificado.',
        ]);
    }

    public function generateQrCode(Request $request)
    {
        $user = $request->user();

        if (!$user->two_factor_secret) {
            $google2fa = new \PragmaRX\Google2FA\Google2FA();
            $user->two_factor_secret = $google2fa->generateSecretKey();
            $user->save();
        }

        $google2fa = new \PragmaRX\Google2FAQRCode\Google2FA();

        $QR_Image = $google2fa->getQRCodeInline(
            config('app.name'),
            $user->email,
            $user->two_factor_secret
        );

        $otpUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $user->two_factor_secret
        );

        return response()->json([
            'otpUrl' => $otpUrl,
            'inlineQr' => $QR_Image,
        ]);
    }

    public function challenge(Request $request)
    {
        if (!session()->has('2fa:user:id')) {
            return redirect()->route('login')->withErrors(['email' => 'Sesión 2FA no encontrada']);
        }

        return inertia('Auth/TwoFactorChallenge'); // Vista para ingresar el OTP
    }

    public function verifyChallenge(Request $request)
    {
        $request->validate(['code' => 'required|digits:6']);

        $userId = session('2fa:user:id');
        $user = \App\Models\User::find($userId);

        if (! $user) {
            return redirect()->route('login')->withErrors(['email' => 'Usuario no encontrado']);
        }

        $google2fa = new \PragmaRX\Google2FA\Google2FA();

        if (! $google2fa->verifyKey($user->two_factor_secret, $request->code, 1)) {
            return back()->withErrors(['code' => 'Código inválido']);
        }

        session()->forget('2fa:user:id');

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }
}
