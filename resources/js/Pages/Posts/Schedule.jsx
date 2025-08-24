"use client"
import { useState, useEffect } from "react"
import { useForm } from "@inertiajs/react"
import { Head } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Clock, Plus, Trash2, Save, Calendar, Settings, AlertCircle, CheckCircle } from "lucide-react"
import classNames from "classnames"

export default function PublishingSchedules({ schedules: initialSchedules, flash }) {
  // Estado de horarios con datos del backend
  const [schedules, setSchedules] = useState(initialSchedules || {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  })

  // Estado para manejar notificaciones
  const [notification, setNotification] = useState(null)

  const { data, setData, post, processing, errors } = useForm({
    schedules: schedules,
  })

  // Mostrar notificaciones flash
  useEffect(() => {
    if (flash?.success) {
      setNotification({ type: 'success', message: flash.success })
      setTimeout(() => setNotification(null), 5000)
    }
    if (flash?.error) {
      setNotification({ type: 'error', message: flash.error })
      setTimeout(() => setNotification(null), 5000)
    }
  }, [flash])

  const daysOfWeek = [
    { key: "monday", label: "Lunes", short: "L" },
    { key: "tuesday", label: "Martes", short: "M" },
    { key: "wednesday", label: "Miércoles", short: "X" },
    { key: "thursday", label: "Jueves", short: "J" },
    { key: "friday", label: "Viernes", short: "V" },
    { key: "saturday", label: "Sábado", short: "S" },
    { key: "sunday", label: "Domingo", short: "D" },
  ]

  const addTimeSlot = (day) => {
    const newSchedules = { ...schedules }
    newSchedules[day] = [...newSchedules[day], "09:00"]
    setSchedules(newSchedules)
    setData("schedules", newSchedules)
  }

  const removeTimeSlot = (day, index) => {
    const newSchedules = { ...schedules }
    newSchedules[day] = newSchedules[day].filter((_, i) => i !== index)
    setSchedules(newSchedules)
    setData("schedules", newSchedules)
  }

  const updateTimeSlot = (day, index, newTime) => {
    const newSchedules = { ...schedules }
    newSchedules[day][index] = newTime
    setSchedules(newSchedules)
    setData("schedules", newSchedules)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    post(route('publishing-schedules.store'))
  }

  const getTotalSlots = () => {
    return Object.values(schedules).reduce((total, daySchedules) => total + daySchedules.length, 0)
  }

  const getActiveDays = () => {
    return Object.values(schedules).filter(day => day.length > 0).length
  }

  const applyTemplate = (template) => {
    let newSchedules = {}
    
    switch (template) {
      case 'standard':
        daysOfWeek.forEach((day) => {
          newSchedules[day.key] = ["09:00", "15:00", "21:00"]
        })
        break
      case 'business':
        daysOfWeek.forEach((day) => {
          if (["monday", "tuesday", "wednesday", "thursday", "friday"].includes(day.key)) {
            newSchedules[day.key] = ["09:00", "18:00"]
          } else {
            newSchedules[day.key] = []
          }
        })
        break
      case 'social':
        newSchedules = {
          monday: ["12:00", "19:00"],
          tuesday: ["12:00", "19:00"],
          wednesday: ["12:00", "19:00"],
          thursday: ["12:00", "19:00"],
          friday: ["12:00", "17:00", "20:00"],
          saturday: ["11:00", "16:00"],
          sunday: ["12:00", "18:00"],
        }
        break
      case 'minimal':
        daysOfWeek.forEach((day) => {
          newSchedules[day.key] = ["12:00"]
        })
        break
      case 'clear':
        daysOfWeek.forEach((day) => {
          newSchedules[day.key] = []
        })
        break
      default:
        return
    }
    
    setSchedules(newSchedules)
    setData("schedules", newSchedules)
  }

  // Función para obtener la hora actual en Costa Rica
  const getCurrentTimeCostaRica = () => {
    return new Date().toLocaleString("es-CR", {
      timeZone: "America/Costa_Rica",
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Horarios de Publicación
              </h2>
              <p className="text-gray-600 mt-1">
                Configura cuándo quieres que se publiquen tus contenidos automáticamente
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <span>Hora actual (Costa Rica): {getCurrentTimeCostaRica()}</span>
          </div>
        </div>
      }
    >
      <Head title="Horarios de Publicación" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Notificación */}
          {notification && (
            <div className={classNames(
              "mb-6 p-4 rounded-xl flex items-center space-x-3",
              {
                "bg-green-50 border border-green-200": notification.type === 'success',
                "bg-red-50 border border-red-200": notification.type === 'error'
              }
            )}>
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={classNames(
                "font-medium",
                {
                  "text-green-800": notification.type === 'success',
                  "text-red-800": notification.type === 'error'
                }
              )}>
                {notification.message}
              </span>
              <button
                onClick={() => setNotification(null)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          )}

          {/* Mostrar errores de validación */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">Errores en el formulario:</span>
              </div>
              <ul className="text-red-700 text-sm space-y-1">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>• {message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de horarios</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalSlots()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Días activos</p>
                  <p className="text-2xl font-bold text-gray-900">{getActiveDays()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Promedio por día</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getTotalSlots() > 0 ? (getTotalSlots() / 7).toFixed(1) : "0"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario principal */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Configurar Horarios Semanales</h3>
                <p className="text-gray-600">
                  Define los horarios en los que quieres que se publiquen automáticamente tus contenidos en cola.
                  Todos los horarios están en zona horaria de Costa Rica (UTC-6).
                </p>
              </div>

              {/* Grid de días de la semana */}
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-8">
                {daysOfWeek.map((day) => (
                  <div key={day.key} className="bg-gray-50 rounded-xl p-6">
                    {/* Header del día */}
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-lg">{day.short}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900">{day.label}</h4>
                      <p className="text-sm text-gray-500">{schedules[day.key].length} horarios</p>
                    </div>

                    {/* Lista de horarios */}
                    <div className="space-y-3 mb-4">
                      {schedules[day.key].map((time, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => updateTimeSlot(day.key, index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeTimeSlot(day.key, index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar horario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Botón para agregar horario */}
                    <button
                      type="button"
                      onClick={() => addTimeSlot(day.key)}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">Agregar horario</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Información adicional */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">¿Cómo funcionan los horarios?</h4>
                    <ul className="text-blue-800 space-y-1 text-sm">
                      <li>• Las publicaciones en cola se enviarán automáticamente en estos horarios</li>
                      <li>• Si no hay contenido en cola, el horario se omite</li>
                      <li>• Los horarios se ejecutan en zona horaria de Costa Rica (UTC-6)</li>
                      <li>• Puedes tener múltiples horarios por día para mayor frecuencia</li>
                      <li>• El sistema revisa cada minuto si hay horarios programados</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Plantillas predefinidas */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Plantillas Rápidas</h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => applyTemplate('standard')}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                    title="3 veces al día todos los días (9:00, 15:00, 21:00)"
                  >
                    📅 Estándar
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTemplate('business')}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                    title="Solo días laborales (9:00, 18:00)"
                  >
                    💼 Empresarial
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTemplate('social')}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                    title="Optimizado para redes sociales"
                  >
                    📱 Redes Sociales
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTemplate('minimal')}
                    className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                    title="Una vez al día al mediodía"
                  >
                    ⏰ Mínimo
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTemplate('clear')}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    title="Eliminar todos los horarios"
                  >
                    🗑️ Limpiar Todo
                  </button>
                </div>
              </div>

              {/* Botón de guardar */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={processing}
                  className={classNames(
                    "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 flex items-center space-x-3 text-lg",
                    {
                      "opacity-50 cursor-not-allowed": processing,
                    },
                  )}
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Guardar Horarios</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Vista previa de la semana */}
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Vista Previa de la Semana</h3>
              <div className="text-sm text-gray-500">
                <span>Zona horaria: Costa Rica (UTC-6)</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {daysOfWeek.map((day) => (
                      <th key={day.key} className="text-left py-3 px-4 font-semibold text-gray-900">
                        <div className="text-center">
                          <div className="text-lg font-bold">{day.short}</div>
                          <div className="text-xs text-gray-500">{day.label}</div>
                          <div className="text-xs text-blue-600 mt-1">
                            {schedules[day.key].length} horario{schedules[day.key].length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {daysOfWeek.map((day) => (
                      <td key={day.key} className="py-4 px-4 align-top">
                        <div className="space-y-2">
                          {schedules[day.key].length > 0 ? (
                            schedules[day.key]
                              .sort() // Ordenar horarios cronológicamente
                              .map((time, index) => (
                                <div
                                  key={index}
                                  className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium text-center border border-blue-200"
                                >
                                  {time}
                                </div>
                              ))
                          ) : (
                            <div className="text-gray-400 text-center text-sm italic py-2 border border-dashed border-gray-200 rounded-lg">
                              Sin horarios
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Información adicional sobre el sistema */}
          <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">💡 Consejos para optimizar tus horarios</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">🕐 Mejores horarios para engagement:</h5>
                <ul className="space-y-1">
                  <li>• <strong>Facebook:</strong> 9:00-10:00, 15:00-16:00</li>
                  <li>• <strong>Instagram:</strong> 11:00-13:00, 17:00-19:00</li>
                  <li>• <strong>Twitter:</strong> 12:00-15:00, 17:00-18:00</li>
                  <li>• <strong>LinkedIn:</strong> 8:00-10:00, 17:00-18:00</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">📊 Estrategias recomendadas:</h5>
                <ul className="space-y-1">
                  <li>• Mantén consistencia en tus horarios</li>
                  <li>• Evita saturar con demasiadas publicaciones</li>
                  <li>• Considera los hábitos de tu audiencia</li>
                  <li>• Ajusta según los datos de engagement</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}