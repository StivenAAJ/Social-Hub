import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, usePage } from "@inertiajs/react"

export default function Dashboard() {
  const { auth, flash } = usePage().props
  const user = auth.user

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Bienvenido, {user.name}
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Mensaje flash */}
          {flash.success && (
            <div className="mb-6 p-4 text-sm text-green-800 rounded-lg bg-green-100 border border-green-300 shadow">
              {flash.success}
            </div>
          )}
          {flash.error && (
            <div className="mb-6 p-4 text-sm text-red-800 rounded-lg bg-red-100 border border-red-300 shadow">
              {flash.error}
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-sm shadow-xl sm:rounded-2xl border border-white/20 p-10 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">¡Estás autenticado en Social Hub Manager!</h3>
            <p className="text-gray-600 mb-6">
              Desde aquí podrás gestionar y programar publicaciones en tus redes sociales conectadas.
            </p>

            <div className="grid gap-4 md:grid-cols-2 mt-6">
              <div className="p-6 border border-white/20 rounded-lg bg-gradient-to-tr from-blue-100 to-white hover:shadow-lg transition">
                <h4 className="text-lg font-medium text-blue-700 mb-2">Conecta tus redes sociales</h4>
                <p className="text-sm text-gray-600">Autoriza la app a publicar en tus redes usando OAuth.</p>
              </div>

              <div className="p-6 border border-white/20 rounded-lg bg-gradient-to-tr from-purple-100 to-white hover:shadow-lg transition">
                <h4 className="text-lg font-medium text-purple-700 mb-2">Publica tu primera entrada</h4>
                <p className="text-sm text-gray-600">Crea publicaciones instantáneas o prográmalas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
