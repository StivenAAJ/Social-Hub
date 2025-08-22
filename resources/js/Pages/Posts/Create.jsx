"use client"
import { useForm } from "@inertiajs/react"
import { ArrowLeft, Calendar, ImageIcon, Send, MessageSquare, Users, Plus } from "lucide-react"
import classNames from "classnames"
import { route } from "ziggy-js"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head } from "@inertiajs/react"

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    content: "",
    image: null,
    scheduled_at: "",
    publish_option: "immediately", // opción por defecto
    platforms: [], // nuevo campo para las plataformas
  })

  function handleChange(e) {
    const key = e.target.name
    const value = key === "image" ? e.target.files[0] : e.target.value
    setData(key, value)
  }

  function handlePlatformChange(platform) {
    const currentPlatforms = data.platforms || []
    const isSelected = currentPlatforms.includes(platform)

    if (isSelected) {
      // Remover la plataforma
      setData(
        "platforms",
        currentPlatforms.filter((p) => p !== platform),
      )
    } else {
      // Añadir la plataforma
      setData("platforms", [...currentPlatforms, platform])
    }
  }

  function submit(e) {
    e.preventDefault()
    post(route("posts.store"))
  }

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Crear Publicación
            </h2>
            <p className="text-gray-600 mt-1">Crea y programa tu contenido para redes sociales</p>
          </div>
        </div>
      }
    >
      <Head title="Crear Publicación" />

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Botón de regreso */}
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center mb-8 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="mr-3 h-6 w-6 group-hover:-translate-x-1 transition-transform" />
            <span className="text-lg font-medium">Atrás</span>
          </button>

          {/* Formulario */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12">
            <form onSubmit={submit} encType="multipart/form-data" className="space-y-10">
              {/* Selección de plataformas */}
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-800">¿Dónde quieres publicar?</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Discord */}
                  <div
                    onClick={() => handlePlatformChange("discord")}
                    className={classNames(
                      "cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg",
                      {
                        "border-indigo-500 bg-indigo-50 shadow-md": data.platforms?.includes("discord"),
                        "border-gray-300 bg-white hover:border-indigo-300": !data.platforms?.includes("discord"),
                      },
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={classNames("w-12 h-12 rounded-xl flex items-center justify-center", {
                          "bg-indigo-600": data.platforms?.includes("discord"),
                          "bg-indigo-100": !data.platforms?.includes("discord"),
                        })}
                      >
                        <MessageSquare
                          className={classNames("w-6 h-6", {
                            "text-white": data.platforms?.includes("discord"),
                            "text-indigo-600": !data.platforms?.includes("discord"),
                          })}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">Discord</h4>
                        <p className="text-gray-600">Publica en tus servidores de Discord</p>
                      </div>
                      <div
                        className={classNames("w-6 h-6 rounded-full border-2 flex items-center justify-center", {
                          "border-indigo-500 bg-indigo-500": data.platforms?.includes("discord"),
                          "border-gray-300": !data.platforms?.includes("discord"),
                        })}
                      >
                        {data.platforms?.includes("discord") && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mastodon */}
                  <div
                    onClick={() => handlePlatformChange("mastodon")}
                    className={classNames(
                      "cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg",
                      {
                        "border-purple-500 bg-purple-50 shadow-md": data.platforms?.includes("mastodon"),
                        "border-gray-300 bg-white hover:border-purple-300": !data.platforms?.includes("mastodon"),
                      },
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={classNames("w-12 h-12 rounded-xl flex items-center justify-center", {
                          "bg-purple-600": data.platforms?.includes("mastodon"),
                          "bg-purple-100": !data.platforms?.includes("mastodon"),
                        })}
                      >
                        <Users
                          className={classNames("w-6 h-6", {
                            "text-white": data.platforms?.includes("mastodon"),
                            "text-purple-600": !data.platforms?.includes("mastodon"),
                          })}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">Mastodon</h4>
                        <p className="text-gray-600">Publica toots en Mastodon</p>
                      </div>
                      <div
                        className={classNames("w-6 h-6 rounded-full border-2 flex items-center justify-center", {
                          "border-purple-500 bg-purple-500": data.platforms?.includes("mastodon"),
                          "border-gray-300": !data.platforms?.includes("mastodon"),
                        })}
                      >
                        {data.platforms?.includes("mastodon") && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón para seleccionar ambas */}
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (data.platforms?.length === 2) {
                        setData("platforms", [])
                      } else {
                        setData("platforms", ["discord", "mastodon"])
                      }
                    }}
                    className={classNames("px-6 py-3 rounded-lg font-medium transition-colors", {
                      "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700":
                        data.platforms?.length === 2,
                      "bg-gray-100 text-gray-700 hover:bg-gray-200": data.platforms?.length !== 2,
                    })}
                  >
                    {data.platforms?.length === 2 ? "Deseleccionar todas" : "Seleccionar ambas plataformas"}
                  </button>
                </div>

                {errors.platforms && <p className="mt-3 text-lg text-red-600">{errors.platforms}</p>}
              </div>

              {/* Contenido */}
              <div>
                <label htmlFor="content" className="block text-xl font-semibold mb-4 text-gray-800">
                  Contenido de la publicación
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={data.content}
                  onChange={handleChange}
                  placeholder="¿Qué quieres compartir hoy?"
                  className={classNames(
                    "w-full border-2 rounded-xl px-6 py-5 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none",
                    { "border-red-300 focus:border-red-500 focus:ring-red-500": errors.content },
                    { "border-gray-300": !errors.content },
                  )}
                  rows={6}
                />
                {errors.content && <p className="mt-3 text-lg text-red-600">{errors.content}</p>}
              </div>

              {/* Imagen */}
              <div>
                <label htmlFor="image" className="block text-xl font-semibold mb-4 text-gray-800">
                  Imagen (opcional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className={classNames(
                      "w-full border-2 rounded-xl px-6 py-5 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100",
                      { "border-red-300 focus:border-red-500 focus:ring-red-500": errors.image },
                      { "border-gray-300": !errors.image },
                    )}
                  />
                  <ImageIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                </div>
                {errors.image && <p className="mt-3 text-lg text-red-600">{errors.image}</p>}
              </div>

              {/* Opciones de publicación */}
              <fieldset className="bg-gray-50 rounded-xl p-8">
                <legend className="text-xl font-semibold mb-6 text-gray-800 px-4">Opciones de Publicación</legend>
                <div className="space-y-6">
                  <label className="flex items-center space-x-4 cursor-pointer p-4 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="publish_option"
                      value="immediately"
                      checked={data.publish_option === "immediately"}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-lg font-medium text-gray-900">Publicar Inmediatamente</span>
                      <p className="text-gray-600">La publicación se enviará ahora mismo</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-4 cursor-pointer p-4 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="publish_option"
                      value="queued"
                      checked={data.publish_option === "queued"}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-lg font-medium text-gray-900">Agregar a Cola</span>
                      <p className="text-gray-600">Se publicará en el próximo horario disponible</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-4 cursor-pointer p-4 rounded-lg hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="publish_option"
                      value="scheduled"
                      checked={data.publish_option === "scheduled"}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-lg font-medium text-gray-900">Agendar para más tarde</span>
                      <p className="text-gray-600">Elige una fecha y hora específica</p>
                    </div>
                  </label>
                </div>
              </fieldset>

              {/* Campo de fecha programada */}
              {data.publish_option === "scheduled" && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <label htmlFor="scheduled_at" className="text-xl font-semibold text-blue-900">
                      Fecha y hora programada
                    </label>
                  </div>
                  <input
                    type="datetime-local"
                    id="scheduled_at"
                    name="scheduled_at"
                    value={data.scheduled_at}
                    onChange={handleChange}
                    className={classNames(
                      "w-full border-2 rounded-xl px-6 py-5 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                      { "border-red-300 focus:border-red-500 focus:ring-red-500": errors.scheduled_at },
                      { "border-blue-300": !errors.scheduled_at },
                    )}
                  />
                  {errors.scheduled_at && <p className="mt-3 text-lg text-red-600">{errors.scheduled_at}</p>}
                </div>
              )}

              {/* Resumen de selección */}
              {data.platforms?.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-3">Publicarás en:</h4>
                  <div className="flex flex-wrap gap-3">
                    {data.platforms.includes("discord") && (
                      <div className="flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-medium">Discord</span>
                      </div>
                    )}
                    {data.platforms.includes("mastodon") && (
                      <div className="flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">Mastodon</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Botón de envío */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={processing || !data.platforms?.length}
                  className={classNames(
                    "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-10 py-5 rounded-xl transition-all duration-200 flex items-center space-x-3 text-xl",
                    {
                      "opacity-50 cursor-not-allowed": processing || !data.platforms?.length,
                    },
                  )}
                >
                  {processing ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span>Crear Publicación</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Información adicional */}
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Consejos para una mejor publicación</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Send className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Contenido atractivo</h4>
                <p className="text-sm text-gray-600">Usa emojis y hashtags relevantes para mayor alcance</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ImageIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Imágenes de calidad</h4>
                <p className="text-sm text-gray-600">Las imágenes aumentan el engagement hasta un 80%</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Momento perfecto</h4>
                <p className="text-sm text-gray-600">Programa para cuando tu audiencia esté más activa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
