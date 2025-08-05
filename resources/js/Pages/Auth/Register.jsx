"use client"

import { Calendar, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "@inertiajs/react"; 
import { route } from "ziggy-js";          


const InputError = ({ message, className = "" }) =>
  message ? <p className={`text-sm text-red-600 ${className}`}>{message}</p> : null

const InputLabel = ({ htmlFor, value, className = "" }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 ${className}`}>
    {value}
  </label>
)

const PrimaryButton = ({ children, disabled, className = "", ...props }) => (
  <button
    disabled={disabled}
    className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {disabled ? (
      <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>Creando cuenta...</span>
      </div>
    ) : (
      children
    )}
  </button>
)

const TextInput = ({ className = "", type = "text", ...props }) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"

  if (isPassword) {
    return (
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    )
  }

  return (
    <input
      type={type}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${className}`}
      {...props}
    />
  )
}

const Link = ({ href, children, className = "" }) => (
  <a href={href} className={className}>
    {children}
  </a>
)

// GuestLayout adaptado al nuevo diseño
const GuestLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
    <div className="w-full max-w-md relative">
      <Link
        href="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Volver al inicio
      </Link>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Social Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Crea tu cuenta</h1>
          <p className="text-gray-600">Únete a miles de creadores que confían en nosotros</p>
        </div>
        {children}

        <div className="my-8 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">o</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-8 text-center">
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <span>14 días gratis</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">✓</span>
            </div>
            <span>Sin tarjeta</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold">✓</span>
            </div>
            <span>Cancela cuando quieras</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Tu componente Register adaptado con el nuevo diseño
export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  })

  const submit = (e) => {
    e.preventDefault()
    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation"),
    })
  }

  return (
    <GuestLayout>
      {/* Head title se mantiene igual */}

      <form onSubmit={submit} className="space-y-6">
        <div className="space-y-2">
          <InputLabel htmlFor="name" value="Nombre completo" />
          <TextInput
            id="name"
            name="name"
            value={data.name}
            className="mt-1 block w-full"
            autoComplete="name"
            isFocused={true}
            onChange={(e) => setData("name", e.target.value)}
            placeholder="Tu nombre completo"
            required
          />
          <InputError message={errors.name} className="mt-2" />
        </div>

        <div className="space-y-2">
          <InputLabel htmlFor="email" value="Correo electrónico" />
          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            autoComplete="username"
            onChange={(e) => setData("email", e.target.value)}
            placeholder="tu@email.com"
            required
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        <div className="space-y-2">
          <InputLabel htmlFor="password" value="Contraseña" />
          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="new-password"
            onChange={(e) => setData("password", e.target.value)}
            placeholder="Mínimo 8 caracteres"
            required
          />
          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="space-y-2">
          <InputLabel htmlFor="password_confirmation" value="Confirmar contraseña" />
          <TextInput
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1 block w-full"
            autoComplete="new-password"
            onChange={(e) => setData("password_confirmation", e.target.value)}
            placeholder="Repite tu contraseña"
            required
          />
          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="text-sm text-gray-600">
          Al registrarte, aceptas nuestros{" "}
          <Link href="/terms" className="text-blue-600 hover:text-blue-700 transition-colors">
            Términos de Servicio
          </Link>{" "}
          y{" "}
          <Link href="/privacy" className="text-blue-600 hover:text-blue-700 transition-colors">
            Política de Privacidad
          </Link>
        </div>

        <PrimaryButton disabled={processing}>Crear Cuenta Gratis</PrimaryButton>
      </form>
    </GuestLayout>
  )
}
