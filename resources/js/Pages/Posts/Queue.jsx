"use client"
import { Head } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Clock, MessageSquare, Users, Edit, Trash2, Play, Plus, ArrowUp, ArrowDown, ArrowLeft } from "lucide-react"
import classNames from "classnames"

export default function QueuePage({ queuedPosts }) {

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "discord":
        return <MessageSquare className="w-4 h-4" />
      case "mastodon":
        return <Users className="w-4 h-4" />
      default:
        return null
    }
  }

  const getPlatformColor = (platform) => {
    switch (platform) {
      case "discord":
        return "bg-indigo-100 text-indigo-800"
      case "mastodon":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleEdit = (postId) => {
    window.location.href = `/posts/${postId}/edit`
  }

  const handleDelete = (postId) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta publicación de la cola?")) {
      window.location.href = `/posts/${postId}/delete`
    }
  }

  const handlePublishNow = (postId) => {
    if (confirm("¿Quieres publicar esta entrada ahora mismo? Se eliminará de la cola.")) {
      window.location.href = `/posts/${postId}/publish-now`
    }
  }

  const handleMoveUp = (postId) => {
    window.location.href = `/posts/${postId}/move-up`
  }

  const handleMoveDown = (postId) => {
    window.location.href = `/posts/${postId}/move-down`
  }

  const getTimeUntilPublish = (estimatedTime) => {
    const now = new Date()
    const estimated = new Date(estimatedTime)
    const diff = estimated - now

    if (diff < 0) return "Próximamente"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `En ${days}d ${hours}h`
    if (hours > 0) return `En ${hours}h ${minutes}m`
    return `En ${minutes}m`
  }

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Cola de Publicaciones
            </h2>
            <p className="text-gray-600 mt-1">Publicaciones esperando ser procesadas automáticamente</p>
          </div>
        </div>
      }
    >
      <Head title="Cola de Publicaciones" />

      <div className="py-12">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center mb-8 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="mr-3 h-6 w-6 group-hover:-translate-x-1 transition-transform" />
          <span className="text-lg font-medium">Atrás</span>
        </button>

        <div className="max-w-5xl mx-auto px-6">
          {/* Estadísticas de la cola */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total en Cola</p>
                  <p className="text-2xl font-bold text-gray-900">{queuedPosts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Próxima</p>
                  <p className="text-lg font-bold text-gray-900">
                    {queuedPosts.length > 0 ? `#${queuedPosts[0]?.queue_position}` : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Discord</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {queuedPosts.filter((post) => post.platforms.includes("discord")).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mastodon</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {queuedPosts.filter((post) => post.platforms.includes("mastodon")).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de publicaciones en cola */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Publicaciones en Cola</h3>
                  <p className="text-gray-600">Se procesarán automáticamente en orden</p>
                </div>
              </div>
              <button
                onClick={() => (window.location.href = "/posts/create")}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar a Cola</span>
              </button>
            </div>

            {queuedPosts.length === 0 ? (
              <div className="text-center py-16">
                <Clock className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h4 className="text-2xl font-semibold text-gray-600 mb-3">No hay publicaciones en cola</h4>
                <p className="text-gray-500 mb-8 text-lg">
                  Las publicaciones agregadas a la cola se procesarán automáticamente
                </p>
                <button
                  onClick={() => (window.location.href = "/posts/create")}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Crear Primera Publicación</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {queuedPosts
                  .sort((a, b) => a.queue_position - b.queue_position)
                  .map((post, index) => (
                    <div
                      key={post.id}
                      className={classNames(
                        "border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-lg",
                        index === 0
                          ? "border-green-300 bg-green-50/50 shadow-md"
                          : "border-amber-200 bg-amber-50/30 hover:border-amber-300",
                      )}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div
                            className={classNames(
                              "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg",
                              index === 0 ? "bg-green-500 text-white" : "bg-amber-500 text-white",
                            )}
                          >
                            #{post.queue_position}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              {index === 0 && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Próxima
                                </span>
                              )}
                              <span className="text-sm text-gray-600">Posición en cola</span>
                            </div>
                            <p className="text-sm text-gray-600">Estimado: {formatDate(post.scheduled_at)}</p>
                            <p className="text-xs text-amber-600 font-medium">
                              {getTimeUntilPublish(post.scheduled_at)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleMoveUp(post.id)}
                            disabled={index === 0}
                            className={classNames(
                              "p-1.5 rounded-lg transition-colors",
                              index === 0 ? "text-gray-300 cursor-not-allowed" : "text-blue-600 hover:bg-blue-50",
                            )}
                            title="Mover arriba"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(post.id)}
                            disabled={index === queuedPosts.length - 1}
                            className={classNames(
                              "p-1.5 rounded-lg transition-colors",
                              index === queuedPosts.length - 1
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-blue-600 hover:bg-blue-50",
                            )}
                            title="Mover abajo"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handlePublishNow(post.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Publicar ahora"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(post.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar de la cola"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-800 leading-relaxed">{post.content}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600 font-medium">Plataformas:</span>
                          <div className="flex items-center space-x-2">
                            {post.platforms.map((platform) => (
                              <div
                                key={platform}
                                className={classNames(
                                  "flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium",
                                  getPlatformColor(platform),
                                )}
                              >
                                {getPlatformIcon(platform)}
                                <span className="capitalize">{platform}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="text-sm text-gray-500">Creada: {formatDate(post.created_at)}</div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Información sobre el sistema de cola */}
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">¿Cómo funciona la cola?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Orden automático</h4>
                <p className="text-sm text-gray-600">Las publicaciones se procesan en el orden que fueron agregadas</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Play className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Publicación automática</h4>
                <p className="text-sm text-gray-600">
                  El sistema publica automáticamente según los horarios configurados
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ArrowUp className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Reordenar</h4>
                <p className="text-sm text-gray-600">Puedes cambiar el orden de las publicaciones cuando quieras</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => (window.location.href = "/posts/create")}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
            >
              Agregar Nueva Publicación
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
