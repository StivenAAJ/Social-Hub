import React from 'react';
import { Link } from '@inertiajs/react';

export default function Welcome({ canLogin, canRegister }) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-2xl text-center">
                <h1 className="text-5xl font-bold text-gray-800 mb-6">Bienvenido a SocialHub</h1>
                <p className="text-gray-600 text-lg mb-8">
                    Conéctate, comparte y colabora con personas de todo el mundo.
                </p>

                <div className="flex justify-center space-x-4">
                    {canLogin && (
                        <Link
                            href={route('login')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Iniciar Sesión
                        </Link>
                    )}

                    {canRegister && (
                        <Link
                            href={route('register')}
                            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                        >
                            Registrarse
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

