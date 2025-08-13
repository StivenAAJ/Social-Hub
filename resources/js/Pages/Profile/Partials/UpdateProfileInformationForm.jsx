"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import TextInput from "@/components/TextInput";
import { Label } from "@/components/label"
import { User, Shield, CheckCircle } from 'lucide-react'
import { useForm, usePage, Link } from "@inertiajs/react"

export default function UpdateProfileInformationForm({ mustVerifyEmail, status, className = "" }) {
const user = usePage().props.auth.user
const [showSuccess, setShowSuccess] = useState(false)

const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
  name: user.name,
  email: user.email,
})

const submit = (e) => {
  e.preventDefault()
  patch(route("profile.update"), {
    onSuccess: () => {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    },
  })
}

return (
  <section className={className}>
    <header>
      <div className="flex items-start space-x-6 mb-10">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Información del Perfil</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Actualiza la información de tu cuenta y dirección de correo electrónico.
          </p>
        </div>
      </div>

      {/* Verification Status */}
      {mustVerifyEmail && user.email_verified_at === null && (
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg mb-8">
          <div className="flex items-start space-x-4">
            <Shield className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-lg font-medium text-amber-800 mb-1">
                Tu dirección de correo electrónico no está verificada.
              </p>
              <Link
                href={route("verification.send")}
                method="post"
                as="button"
                className="text-lg text-amber-700 hover:text-amber-800 underline transition-colors"
              >
                Haz clic aquí para reenviar el correo de verificación.
              </Link>
            </div>
          </div>
        </div>
      )}

      {status === "verification-link-sent" && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg mb-8">
          <div className="flex items-start space-x-4">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-lg font-medium text-green-600">
                Se ha enviado un nuevo enlace de verificación a tu dirección de correo electrónico.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>

    <form onSubmit={submit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label htmlFor="name" className="text-lg font-medium text-gray-700">
            Nombre
          </Label>
          <TextInput
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            className="w-full px-5 py-5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
            placeholder="Tu nombre completo"
            required
            autoFocus
            autoComplete="name"
          />
          {errors.name && <p className="text-lg text-red-600 mt-3">{errors.name}</p>}
        </div>

        <div className="space-y-4">
          <Label htmlFor="email" className="text-lg font-medium text-gray-700">
            Correo electrónico
          </Label>
          <TextInput
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            className="w-full px-5 py-5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
            placeholder="tu@email.com"
            required
            autoComplete="username"
          />
          {errors.email && <p className="text-lg text-red-600 mt-3">{errors.email}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6">
        <div className="flex items-center space-x-3">
          {(recentlySuccessful || showSuccess) && (
            <div className="flex items-center space-x-3 text-green-600">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg font-medium">Guardado correctamente</span>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={processing}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-xl font-semibold"
        >
          {processing ? (
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xl font-semibold">Guardando...</span>
            </div>
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </div>
    </form>
  </section>
)
}
