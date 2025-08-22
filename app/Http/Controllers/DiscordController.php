<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class DiscordController extends Controller
{
    public function sendMessageToChannel(Request $request)
    {
        $message = $request->input('message', '¡Hola desde Laravel! 🎉');

        $response = Http::withToken(env('DISCORD_BOT_TOKEN'))
            ->post("https://discord.com/api/v10/channels/" . env('DISCORD_CHANNEL_ID') . "/messages", [
                'content' => $message
            ]);

        if ($response->successful()) {
            return response()->json(['success' => true, 'message' => 'Mensaje enviado con éxito']);
        } else {
            return response()->json(['success' => false, 'error' => $response->json()], 500);
        }
    }
}
