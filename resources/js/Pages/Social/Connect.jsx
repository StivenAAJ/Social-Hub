"use client"

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, usePage } from "@inertiajs/react"

export default function ConnectSocials() {
  const { auth } = usePage().props
  const user = auth.user

  const handleConnect = (platform) => {
    if (platform === "discord") {
      window.location.href = "/auth/discord/redirect"
    } else if (platform === "mastodon") {
      window.location.href = "/auth/mastodon/redirect"
    }
  }

  const handleDisconnect = (platform) => {
    if (platform === "discord") {
      window.location.href = "/auth/discord/disconnect"
    } else if (platform === "mastodon") {
      window.location.href = "/auth/mastodon/disconnect"
    }
  }

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Conectar Redes Sociales
            </h2>
            <p className="text-xl text-gray-600 mt-2">Autoriza Social Hub para publicar en tus redes sociales</p>
          </div>
        </div>
      }
    >
      <Head title="Conectar Redes Sociales" />

      <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <div className="container mx-auto px-6">
          {/* Información de seguridad */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-10 mb-12 max-w-6xl mx-auto">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-blue-900 mb-4">Conexión Segura</h3>
                <p className="text-xl text-blue-800 leading-relaxed">
                  Utilizamos OAuth 2.0 para conectar tus cuentas de forma segura. Social Hub nunca almacena tus
                  contraseñas y solo solicita los permisos mínimos necesarios para publicar contenido.
                </p>
              </div>
            </div>
          </div>

          {/* Grid de redes sociales */}
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Discord */}
            <div className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-white/20 p-12">
              <div className="text-center mb-10">
                <div className="w-28 h-28 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-14 h-14 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Discord</h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Publica mensajes en tus servidores y canales de Discord
                </p>
              </div>

              {user.discord_id ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="bg-green-100 text-green-800 border border-green-200 px-6 py-3 rounded-full text-lg font-medium">
                      Conectado
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-lg text-gray-600 mb-2">Conectado como:</p>
                    <p className="text-xl font-medium text-gray-900">{user.discord_username || user.name}</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-medium text-gray-900">Permisos otorgados:</h4>
                    <ul className="text-lg text-gray-600 space-y-3">
                      <li>• Enviar mensajes en canales</li>
                      <li>• Ver información básica del perfil</li>
                      <li>• Acceder a servidores donde eres miembro</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleDisconnect("discord")}
                    className="w-full border border-red-200 text-red-600 hover:bg-red-50 px-6 py-4 rounded-lg transition-colors text-xl font-medium"
                  >
                    Desconectar Discord
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="bg-gray-50 rounded-lg p-8">
                    <h4 className="text-xl font-medium text-gray-900 mb-4">¿Qué podrás hacer?</h4>
                    <ul className="text-lg text-gray-600 space-y-3">
                      <li>• Publicar mensajes en tus servidores</li>
                      <li>• Programar anuncios automáticos</li>
                      <li>• Gestionar múltiples canales</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-8">
                    <div className="flex items-start space-x-4">
                      <svg
                        className="w-7 h-7 text-amber-600 flex-shrink-0 mt-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <div>
                        <p className="text-lg text-amber-800 leading-relaxed">
                          <strong>Nota:</strong> Necesitarás permisos de administrador en los servidores donde quieras
                          publicar.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleConnect("discord")}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-5 rounded-lg transition-colors flex items-center justify-center space-x-3 text-xl font-medium"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <span>Conectar con Discord</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mastodon */}
            <div className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border border-white/20 p-12">
              <div className="text-center mb-10">
                <div className="w-28 h-28 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-14 h-14 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Mastodon</h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Publica toots en tu instancia de Mastodon favorita
                </p>
              </div>

              {user.mastodon_id ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="bg-green-100 text-green-800 border border-green-200 px-6 py-3 rounded-full text-lg font-medium">
                      Conectado
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-lg text-gray-600 mb-2">Conectado como:</p>
                    <p className="text-xl font-medium text-gray-900">{user.mastodon_username || user.name}</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-medium text-gray-900">Permisos otorgados:</h4>
                    <ul className="text-lg text-gray-600 space-y-3">
                      <li>• Publicar toots públicos y privados</li>
                      <li>• Ver información del perfil</li>
                      <li>• Acceder a la línea de tiempo</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleDisconnect("mastodon")}
                    className="w-full border border-red-200 text-red-600 hover:bg-red-50 px-6 py-4 rounded-lg transition-colors text-xl font-medium"
                  >
                    Desconectar Mastodon
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="bg-gray-50 rounded-lg p-8">
                    <h4 className="text-xl font-medium text-gray-900 mb-4">¿Qué podrás hacer?</h4>
                    <ul className="text-lg text-gray-600 space-y-3">
                      <li>• Publicar toots con texto e imágenes</li>
                      <li>• Programar publicaciones</li>
                      <li>• Gestionar visibilidad de posts</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
                    <div className="flex items-start space-x-4">
                      <svg
                        className="w-7 h-7 text-blue-600 flex-shrink-0 mt-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-lg text-blue-800 leading-relaxed">
                          <strong>Instancia personalizada:</strong> Puedes conectar cualquier instancia de Mastodon
                          compatible con la API estándar.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleConnect("mastodon")}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-5 rounded-lg transition-colors flex items-center justify-center space-x-3 text-xl font-medium"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <span>Conectar con Mastodon</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Información adicional */}
          <div className="max-w-6xl mx-auto mt-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                ¿Necesitas ayuda para conectar tus cuentas?
              </h3>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="text-center">
                  <h4 className="text-2xl font-medium text-gray-900 mb-4">Guía de Discord</h4>
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    Aprende cómo configurar los permisos necesarios en tu servidor de Discord
                  </p>
                  <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-lg text-lg font-medium transition-colors">
                    Ver Guía
                  </button>
                </div>
                <div className="text-center">
                  <h4 className="text-2xl font-medium text-gray-900 mb-4">Guía de Mastodon</h4>
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    Descubre cómo conectar diferentes instancias de Mastodon
                  </p>
                  <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-lg text-lg font-medium transition-colors">
                    Ver Guía
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
