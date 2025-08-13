"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/button"
import TextInput from "@/components/TextInput";
import { Label } from "@/components/label"
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useForm } from "@inertiajs/react"

export default function UpdatePasswordForm({ className = "" }) {
  const passwordInput = useRef()
  const currentPasswordInput = useRef()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  })

  const updatePassword = (e) => {
    e.preventDefault()
    put(route("password.update"), {
      preserveScroll: true,
      onSuccess: () => {
        reset()
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      },
      onError: (errors) => {
        if (errors.password) {
          reset("password", "password_confirmation")
          passwordInput.current?.focus()
        }
        if (errors.current_password) {
          reset("current_password")
          currentPasswordInput.current?.focus()
        }
      },
    })
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  return (
    <section className={className}>
      <header>
        <div className="flex items-start space-x-6 mb-10">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Lock className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Actualizar Contraseña</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Asegúrate de que tu cuenta esté usando una contraseña larga y aleatoria para mantenerte seguro.
            </p>
          </div>
        </div>
      </header>

      <form onSubmit={updatePassword} className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="current_password" className="text-lg font-medium text-gray-700">
            Contraseña Actual
          </Label>
          <div className="relative">
            <TextInput
              id="current_password"
              ref={currentPasswordInput}
              type={showPasswords.current ? "text" : "password"}
              value={data.current_password}
              onChange={(e) => setData("current_password", e.target.value)}
              className="w-full px-5 py-5 pr-14 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
              placeholder="Tu contraseña actual"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPasswords.current ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
            </button>
          </div>
          {errors.current_password && <p className="text-lg text-red-600 mt-3">{errors.current_password}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Label htmlFor="password" className="text-lg font-medium text-gray-700">
              Nueva Contraseña
            </Label>
            <div className="relative">
              <TextInput
                id="password"
                ref={passwordInput}
                type={showPasswords.new ? "text" : "password"}
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                className="w-full px-5 py-5 pr-14 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                placeholder="Nueva contraseña"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPasswords.new ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>
            {errors.password && <p className="text-lg text-red-600 mt-3">{errors.password}</p>}
          </div>

          <div className="space-y-4">
            <Label htmlFor="password_confirmation" className="text-lg font-medium text-gray-700">
              Confirmar Contraseña
            </Label>
            <div className="relative">
              <TextInput
                id="password_confirmation"
                type={showPasswords.confirm ? "text" : "password"}
                value={data.password_confirmation}
                onChange={(e) => setData("password_confirmation", e.target.value)}
                className="w-full px-5 py-5 pr-14 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                placeholder="Confirmar nueva contraseña"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPasswords.confirm ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="text-lg text-red-600 mt-3">{errors.password_confirmation}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center space-x-3">
            {(recentlySuccessful || showSuccess) && (
              <div className="flex items-center space-x-3 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg font-medium">Contraseña actualizada</span>
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
                <span className="text-xl font-semibold">Actualizando...</span>
              </div>
            ) : (
              "Actualizar Contraseña"
            )}
          </Button>
        </div>
      </form>
    </section>
  )
}
