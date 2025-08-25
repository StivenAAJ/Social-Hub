"use client"
import { useState } from "react"
import { Head } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import {
  History,
  Calendar,
  MessageSquare,
  Users,
  Edit,
  Trash2,
  Play,
  CheckCircle,
  Clock,
  ArrowLeft,
} from "lucide-react"
import classNames from "classnames"

export default function HistoryAndScheduled() {
  // Datos de ejemplo para publicaciones publicadas (historial)
  const [publishedPosts] = useState([
    {
      id: 1,
      content: "¡Feliz año nuevo! 🎉 Que este 2024 esté lleno de código limpio y proyectos exitosos.",
      platforms: ["discord", "mastodon"],
      status: "published",
      scheduled_for: "2024-01-01T00:00:00",
      published_at: "2024-01-01T00:00:15",
      created_at: "2023-12-30T15:30:00",
      results: {
        discord: { success: true, message: "Publicado exitosamente" },
        mastodon: { success: true, message: "Publicado exitosamente" },
      },
    },
    {
      id: 2,
      content: "Tutorial: Cómo configurar un entorno de desarrollo con Docker 🐳",
      platforms: ["discord"],
      status: "published",
      scheduled_for: "2024-01-10T14:00:00",
      published_at: "2024-01-10T14:00:08",
      created_at: "2024-01-09T10:15:00",
      results: {
        discord: { success: true, message: "Publicado exitosamente" },
      },
    },
    {
      id: 3,
      content: "¿Cuál es tu framework JavaScript favorito? Cuéntanos en los comentarios 💭",
      platforms: ["mastodon"],
      status: "published",
      scheduled_for: "2024-01-12T16:30:00",
      published_at: "2024-01-12T16:30:12",
      created_at: "2024-01-11T09:45:00",
      results: {
        mastodon: { success: true, message: "Publicado exitosamente" },
      },
    },
    {
      id: 4,
      content: "Recordatorio: Webinar gratuito sobre Next.js 14 📚 ¡Gracias a todos los que participaron!",
      platforms: ["discord", "mastodon"],
      status: "published",
      scheduled_for: "2024-01-08T19:00:00",
      published_at: "2024-01-08T19:00:05",
      created_at: "2024-01-07T11:20:00",
      results: {
        discord: { success: true, message: "Publicado exitosamente" },
        mastodon: { success: true, message: "Publicado exitosamente" },
      },
    },
  ])

  // Datos de ejemplo para publicaciones programadas (no publicadas)
  const [scheduledPosts] = useState([
    {
      id: 5,
      content: "¡Feliz viernes! 🎉 Que tengan un excelente fin de semana desarrollando proyectos increíbles.",
      platforms: ["discord", "mastodon"],
      status: "scheduled",
      scheduled_for: "2024-01-19T17:00:00",
      published_at: null,
      created_at: "2024-01-15T09:00:00",
    },
    {
      id: 6,
      content: "Mañana lanzamos la nueva versión de nuestra API 🚀 Prepárense para las mejoras!",
      platforms: ["discord"],
      status: "scheduled",
      scheduled_for: "2024-01-20T10:00:00",
      published_at: null,
      created_at: "2024-01-15T14:30:00",
    },
    {
      id: 7,
      content: "Workshop gratuito: Introducción a TypeScript para principiantes 📖",
      platforms: ["mastodon"],
      status: "scheduled",
      scheduled_for: "2024-01-22T15:00:00",
      published_at: null,
      created_at: "2024-01-15T16:45:00",
    },
    {
      id: 8,
      content: "Mantenimiento programado del servidor este domingo de 2-4 AM ⚠️",
      platforms: ["discord", "mastodon"],
      status: "scheduled",
      scheduled_for: "2024-01-21T02:00:00",
      published_at: null,
      created_at: "2024-01-15T13:20:00",
    },
    {
      id: 9,
      content: "Nuevo curso de React avanzado disponible en nuestra plataforma 🚀",
      platforms: ["discord"],
      status: "scheduled",
      scheduled_for: "2024-01-25T12:00:00",
      published_at: null,
      created_at: "2024-01-16T08:30:00",
    },
  ])

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
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
    if (confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      console.log(`Deleting post ${postId}`)
    }
  }

  const handlePublishNow = (postId) => {
    if (confirm("¿Quieres publicar esta entrada ahora mismo?")) {
      console.log(`Publishing post ${postId} now`)
    }
  }

  const getTimeUntilScheduled = (scheduledDate) => {
    const now = new Date()
    const scheduled = new Date(scheduledDate)
    const diff = scheduled - now

    if (diff < 0) return "Programada"

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
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
            <History className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Historial y Programadas
            </h2>
            <p className="text-gray-600 mt-1">Publicaciones realizadas y contenido programado</p>
          </div>
        </div>
      }
    >
      <Head title="Historial y Programadas" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Botón de regreso */}
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center mb-8 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="mr-3 h-6 w-6 group-hover:-translate-x-1 transition-transform" />
            <span className="text-lg font-medium">Atrás</span>
          </button>

          {/* Estadísticas generales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Publicadas</p>
                  <p className="text-2xl font-bold text-gray-900">{publishedPosts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Programadas</p>
                  <p className="text-2xl font-bold text-gray-900">{scheduledPosts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Próximas 24h</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      scheduledPosts.filter((post) => {
                        const scheduled = new Date(post.scheduled_for)
                        const now = new Date()
                        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
                        return scheduled >= now && scheduled <= tomorrow
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Layout dividido */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda: Historial (Publicadas) */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Historial</h3>
                    <p className="text-gray-600">Publicaciones realizadas exitosamente</p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {publishedPosts.length} publicadas
                </div>
              </div>

              {publishedPosts.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-600 mb-2">No hay publicaciones en el historial</h4>
                  <p className="text-gray-500">Las publicaciones exitosas aparecerán aquí</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {publishedPosts
                    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
                    .map((post) => (
                      <div
                        key={post.id}
                        className="border border-green-200 bg-green-50/50 rounded-xl p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-green-700">
                                Publicada: {formatDate(post.published_at)}
                              </p>
                              <p className="text-xs text-gray-600">Programada: {formatDate(post.scheduled_for)}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleEdit(post.id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-gray-800 text-sm leading-relaxed line-clamp-2">{post.content}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {post.platforms.map((platform) => (
                              <div
                                key={platform}
                                className={classNames(
                                  "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
                                  getPlatformColor(platform),
                                )}
                              >
                                {getPlatformIcon(platform)}
                                <span className="capitalize">{platform}</span>
                              </div>
                            ))}
                          </div>

                          <div className="text-xs text-gray-500">
                            Creada: {formatDate(post.created_at).split(" ")[1]}
                          </div>
                        </div>

                        {/* Resultados por plataforma */}
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(post.results).map(([platform, result]) => (
                              <div key={platform} className="flex items-center space-x-1 text-xs text-green-700">
                                <CheckCircle className="w-3 h-3" />
                                <span className="capitalize">
                                  {platform}: {result.message}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Columna derecha: Publicaciones Programadas */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Programadas</h3>
                    <p className="text-gray-600">Pendientes de publicación</p>
                  </div>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {scheduledPosts.length} pendientes
                </div>
              </div>

              {scheduledPosts.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-600 mb-2">No hay publicaciones programadas</h4>
                  <p className="text-gray-500">Las publicaciones programadas aparecerán aquí</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {scheduledPosts
                    .sort((a, b) => new Date(a.scheduled_for) - new Date(b.scheduled_for))
                    .map((post) => (
                      <div
                        key={post.id}
                        className="border border-blue-200 bg-blue-50/50 rounded-xl p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium text-blue-700">{formatDate(post.scheduled_for)}</p>
                              <p className="text-xs text-blue-600">{getTimeUntilScheduled(post.scheduled_for)}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
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
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-gray-800 text-sm leading-relaxed line-clamp-2">{post.content}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {post.platforms.map((platform) => (
                              <div
                                key={platform}
                                className={classNames(
                                  "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
                                  getPlatformColor(platform),
                                )}
                              >
                                {getPlatformIcon(platform)}
                                <span className="capitalize">{platform}</span>
                              </div>
                            ))}
                          </div>

                          <div className="text-xs text-gray-500">
                            Creada: {formatDate(post.created_at).split(" ")[1]}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Botón para crear nueva publicación */}
          <div className="mt-8 text-center">
            <button
              onClick={() => (window.location.href = "/posts/create")}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl"
            >
              <Calendar className="w-6 h-6" />
              <span className="text-lg">Crear Nueva Publicación</span>
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
