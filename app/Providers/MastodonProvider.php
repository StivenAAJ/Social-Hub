<?php

namespace App\Providers;

use Laravel\Socialite\Two\AbstractProvider;
use Laravel\Socialite\Two\User;

class MastodonProvider extends AbstractProvider
{
    protected function getAuthUrl($state)
    {
        return $this->buildAuthUrlFromBase('https://mastodon.social/oauth/authorize', $state);
    }

    protected function getTokenUrl()
    {
        return 'https://mastodon.social/oauth/token';
    }

    protected function getUserByToken($token)
    {
        $response = $this->getHttpClient()->get('https://mastodon.social/api/v1/accounts/verify_credentials', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token,
            ],
        ]);

        return json_decode($response->getBody(), true);
    }

    protected function mapUserToObject(array $user)
    {
        return (new User())->setRaw($user)->map([
            'id' => $user['id'],
            'nickname' => $user['username'],
            'name' => $user['display_name'],
            'email' => $user['email'] ?? null,
            'avatar' => $user['avatar'],
        ]);
    }
}
