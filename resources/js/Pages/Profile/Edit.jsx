"use client"

import { Head } from "@inertiajs/react"
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm'
import UpdatePasswordForm from './Partials/UpdatePasswordForm'
import DeleteUserForm from './Partials/DeleteUserForm'
import TwoFactorAuthenticationForm from './Partials/TwoFactorForm' // Asegúrate de tener este archivo o componente
import { Settings } from 'lucide-react'

export default function Edit({ mustVerifyEmail, status }) {
  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-800">Configuración del Perfil</h2>
        </div>
      }
    >
      <Head title="Profile" />
      

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          <TwoFactorAuthenticationForm />
        </div>

      <div className="space-y-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          <UpdateProfileInformationForm
            mustVerifyEmail={mustVerifyEmail}
            status={status}
          />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          <UpdatePasswordForm />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 border-red-200 p-8">
          <DeleteUserForm />
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
