"use client"

import { useForm } from "@inertiajs/react"
import { route } from "ziggy-js"
import { Calendar, ShieldCheck } from "lucide-react"

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

const GuestLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
    <div className="w-full max-w-md relative">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Autenticación 2FA</span>
          </div>
          <p className="text-gray-600">Introduce el código generado por tu app (Google Authenticator, Authy, etc.)</p>
        </div>
        {children}
      </div>
    </div>
  </div>
)

export default function TwoFactorChallenge() {
  const { data, setData, post, processing, errors } = useForm({
    code: "",
  })

  const submit = (e) => {
    e.preventDefault()
    post(route("two-factor.challenge.store"))
  }

  return (
    <GuestLayout>
      <form onSubmit={submit} className="space-y-6">
        <div className="space-y-2">
          <InputLabel htmlFor="code" value="Código de verificación" />
          <TextInput
            id="code"
            type="text"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={data.code}
            onChange={(e) => setData("code", e.target.value)}
            placeholder="123456"
          />
          <InputError message={errors.code} className="mt-2" />
        </div>

        <PrimaryButton type="submit" className="w-full" disabled={processing}>
          Verificar
        </PrimaryButton>
      </form>
    </GuestLayout>
  )
}
