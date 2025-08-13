"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/button"
import TextInput from "@/components/TextInput";
import { Label } from "@/components/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/dialog"
import { Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { useForm } from "@inertiajs/react"

export default function DeleteUserForm({ className = "" }) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const passwordInput = useRef()

  const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
    password: "",
  })

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true)
  }

  const deleteUser = (e) => {
    e.preventDefault()
    destroy(route("profile.destroy"), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordInput.current?.focus(),
      onFinish: () => reset(),
    })
  }

  const closeModal = () => {
    setConfirmingUserDeletion(false)
    clearErrors()
    reset()
  }

  return (
    <section className={`w-full ${className}`}>
      <div className="w-full space-y-10"> {/* Increased space-y */}
        <header className="w-full">
          <div className="flex items-start space-x-6 mb-10 w-full"> {/* Increased space-x and mb */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0"> {/* Larger icon container */}
              <Trash2 className="w-8 h-8 text-red-600" /> {/* Larger icon */}
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Eliminar Cuenta</h2> {/* Larger title */}
              <p className="text-lg text-gray-600 leading-relaxed w-full"> {/* Larger text */}
                Una vez que tu cuenta sea eliminada, todos sus recursos y datos serán eliminados 
                permanentemente. Antes de eliminar tu cuenta, por favor descarga cualquier dato o 
                información que desees conservar.
              </p>
            </div>
          </div>

          <div className="w-full p-8 bg-red-50 border border-red-200 rounded-lg"> {/* Increased padding */}
            <div className="flex items-start space-x-6 w-full"> {/* Increased space-x */}
              <AlertTriangle className="w-8 h-8 text-red-600 mt-1 flex-shrink-0" /> {/* Larger icon */}
              <div className="flex-1 w-full">
                <h4 className="text-xl font-semibold text-red-800 mb-4">Advertencia importante</h4> {/* Larger title */}
                <p className="text-lg text-red-700 leading-relaxed w-full"> {/* Larger text */}
                  Esta acción no se puede deshacer. Todos tus datos, publicaciones programadas, 
                  configuraciones y cualquier información asociada con tu cuenta se perderán 
                  permanentemente. Asegúrate de haber respaldado toda la información importante 
                  antes de proceder.
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="w-full pt-6"> {/* Increased padding-top */}
          <Button
            onClick={confirmUserDeletion}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 text-xl font-semibold" 
          >
            Eliminar Cuenta
          </Button>
        </div>
      </div>

      <Dialog open={confirmingUserDeletion} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-xl w-full p-8"> {/* Larger modal and padding */}
          <DialogHeader>
            <div className="flex items-start space-x-6 mb-6 w-full"> {/* Increased space-x and mb */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0"> {/* Larger icon container */}
                <AlertTriangle className="w-8 h-8 text-red-600" /> {/* Larger icon */}
              </div>
              <div className="flex-1 w-full">
                <DialogTitle className="text-2xl font-semibold text-gray-900 leading-tight mb-3"> {/* Larger title */}
                  ¿Estás seguro de que quieres eliminar tu cuenta?
                </DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-lg text-gray-600 leading-relaxed w-full"> {/* Larger text */}
              Una vez que tu cuenta sea eliminada, todos sus recursos y datos serán eliminados 
              permanentemente. Por favor ingresa tu contraseña para confirmar que deseas eliminar 
              permanentemente tu cuenta. Esta acción es irreversible y no podrás recuperar tu información.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={deleteUser} className="space-y-10 mt-8 w-full"> {/* Increased space-y and mt */}
            <div className="space-y-4 w-full"> {/* Increased space-y */}
              <Label htmlFor="password" className="sr-only">
                Contraseña
              </Label>
              <div className="relative w-full">
                <TextInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  ref={passwordInput}
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  className="w-full px-5 py-5 pr-14 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-lg" 
                  placeholder="Ingresa tu contraseña para confirmar"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors" 
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />} {/* Larger icon */}
                </button>
              </div>
              {errors.password && <p className="text-lg text-red-600 mt-3">{errors.password}</p>} {/* Larger error text */}
            </div>

            <div className="flex justify-end space-x-6 pt-6 w-full"> {/* Increased space-x and pt */}
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeModal}
                className="px-8 py-4 text-lg" 
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={processing}
                className="bg-red-600 hover:bg-red-700 px-8 py-4 text-xl font-semibold" 
              >
                {processing ? (
                  <div className="flex items-center space-x-3"> {/* Increased space-x */}
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> {/* Larger spinner */}
                    <span className="text-xl font-semibold">Eliminando...</span> {/* Changed text-lg to text-xl and font-medium to font-semibold */}
                  </div>
                ) : (
                  "Eliminar Cuenta"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
