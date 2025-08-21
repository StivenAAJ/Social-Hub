<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Two\DiscordProvider;
use Illuminate\Support\Str;
use League\OAuth2\Client\Provider\GenericProvider;


class OAuthController extends Controller
{
    public function redirectToDiscord()
    {
        // Redirige al login de Discord
        return Socialite::driver('discord')->redirect();
    }


    public function handleDiscordCallback()
    {
        $discordUser = Socialite::driver('discord')->user();

        // Obtener el usuario que ya está logueado en la app
        $user = Auth::user();

        if (!$user) {
            // Si no hay usuario logueado, redirigir o dar error
            return redirect('/login')->with('error', 'Debes iniciar sesión primero.');
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $user->discord_id = $discordUser->getId();
        $user->discord_token = $discordUser->token;
        $user->discord_refresh_token = $discordUser->refreshToken;
        $user->save();


        return redirect('/dashboard')->with('success', 'Cuenta de Discord conectada correctamente.');
    }

    public function disconnectDiscord()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect('/login')->with('error', 'Debes iniciar sesión primero.');
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $user->discord_id = null;
        $user->discord_token = null;
        $user->discord_refresh_token = null;
        $user->save();

        return redirect()->back()->with('success', 'Cuenta de Discord desconectada correctamente.');
    }

    public function redirectToMastodon()
    {
        $provider = new GenericProvider([
            'clientId'                => config('services.mastodon.client_id'),
            'clientSecret'            => config('services.mastodon.client_secret'),
            'redirectUri'             => config('services.mastodon.redirect'),
            'urlAuthorize'            => 'https://mastodon.social/oauth/authorize',
            'urlAccessToken'          => 'https://mastodon.social/oauth/token',
            'urlResourceOwnerDetails' => 'https://mastodon.social/api/v1/accounts/verify_credentials',
        ]);

        // Si no hay "code", redirige a Mastodon
        if (!request()->has('code')) {
            $authorizationUrl = $provider->getAuthorizationUrl();
            session(['oauth2state' => $provider->getState()]);
            return redirect($authorizationUrl);
        }

        // Verifica el "state" para seguridad
        if (empty(request('state')) || (request('state') !== session('oauth2state'))) {
            session()->forget('oauth2state');
            exit('Invalid state');
        }

        // Intercambia el code por un access token
        $token = $provider->getAccessToken('authorization_code', [
            'code' => request('code'),
        ]);

        // Obtiene el usuario desde Mastodon
        $user = $provider->getResourceOwner($token);

        dd($user->toArray()); // aquí puedes guardar en tu BD
    }
    public function handleMastodonCallback()
    {
        /** @var \App\Providers\MastodonProvider $provider */
        $provider = \Laravel\Socialite\Facades\Socialite::driver('mastodon');
        $mastodonUser = $provider->stateless()->user();


        $user = Auth::user(); // o auth()->user()
        if (!$user) {
            return redirect('/login')->with('error', 'Debes iniciar sesión primero.');
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $user->mastodon_id = $mastodonUser->getId();
        $user->mastodon_token = $mastodonUser->token;
        $user->mastodon_refresh_token = $mastodonUser->refreshToken ?? null;
        $user->save();

        return redirect('/dashboard')->with('success', 'Cuenta de Mastodon conectada correctamente.');
    }

    public function disconnectMastodon()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->mastodon_id = null;
        $user->mastodon_token = null;
        $user->mastodon_refresh_token = null;
        $user->save();

        return redirect('/dashboard')->with('success', 'Cuenta de Mastodon desconectada.');
    }
}
