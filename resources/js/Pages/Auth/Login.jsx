"use client"

import { useForm } from "@inertiajs/react";   
import { route } from "ziggy-js";             


import { Calendar, ArrowLeft } from "lucide-react"

const Checkbox = ({ name, checked, onChange, className = "" }) => (
  <input
    type="checkbox"
    name={name}
    checked={checked}
    onChange={onChange}
    className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${className}`}
  />
)

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
    className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {disabled ? (
      <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>{children}</span>
      </div>
    ) : (
      children
    )}
  </button>
)

const TextInput = ({ className = "", ...props }) => (
  <input
    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${className}`}
    {...props}
  />
)

const Link = ({ href, children, className = "" }) => (
  <a href={href} className={className}>
    {children}
  </a>
)

// Simulando GuestLayout adaptado al nuevo diseño
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido de vuelta</h1>
          <p className="text-gray-600">Inicia sesión en tu cuenta para continuar</p>
        </div>
        {children}

        <div className="my-8 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">o</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
)

// Tu componente Login adaptado con el nuevo diseño
export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  })

  const submit = (e) => {
    e.preventDefault()
    post(route("login"), {
      onFinish: () => reset("password"),
    })
  }

  return (
    <GuestLayout>
      {/* Head title se mantiene igual */}

      {status && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-600">{status}</p>
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        <div className="space-y-2">
          <InputLabel htmlFor="email" value="Correo electrónico" />
          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            autoComplete="username"
            isFocused={true}
            onChange={(e) => setData("email", e.target.value)}
            placeholder="tu@email.com"
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
            autoComplete="current-password"
            onChange={(e) => setData("password", e.target.value)}
            placeholder="••••••••"
          />
          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <Checkbox name="remember" checked={data.remember} onChange={(e) => setData("remember", e.target.checked)} />
            <span className="text-sm text-gray-600">Recordarme</span>
          </label>

          {canResetPassword && (
            <Link
              href={route("password.request")}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          )}
        </div>

        <PrimaryButton className="w-full" disabled={processing}>
          Iniciar Sesión
        </PrimaryButton>
      </form>
    </GuestLayout>
  )
}
