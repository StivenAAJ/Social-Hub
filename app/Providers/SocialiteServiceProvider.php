<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Socialite\Facades\Socialite;
use App\Providers\MastodonProvider;

class SocialiteServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Socialite::extend('mastodon', function ($app) {
            $config = $app['config']['services.mastodon'];

            return new MastodonProvider(
                $app['request'],
                $config['client_id'],
                $config['client_secret'],
                $config['redirect']
            );
        });
    }
}
