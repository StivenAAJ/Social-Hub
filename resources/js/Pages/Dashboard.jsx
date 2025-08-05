import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
                    Bienvenido, {user.name}
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-gradient-to-br from-pink-100 via-white to-indigo-100 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-xl sm:rounded-lg p-10 text-center">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                            ¡Estás autenticado en Social Hub Manager!
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Desde aquí podrás gestionar y programar publicaciones en tus redes sociales conectadas.
                        </p>

                        <div className="grid gap-4 md:grid-cols-2 mt-6">
                            <div className="p-6 border rounded-lg bg-gradient-to-tr from-indigo-100 to-white hover:shadow-lg transition">
                                <h4 className="text-lg font-medium text-indigo-700 mb-2">Conecta tus redes sociales</h4>
                                <p className="text-sm text-gray-600">Autoriza la app a publicar en tus redes usando OAuth.</p>
                            </div>

                            <div className="p-6 border rounded-lg bg-gradient-to-tr from-pink-100 to-white hover:shadow-lg transition">
                                <h4 className="text-lg font-medium text-pink-700 mb-2">Publica tu primera entrada</h4>
                                <p className="text-sm text-gray-600">Crea publicaciones instantáneas o prográmalas.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
