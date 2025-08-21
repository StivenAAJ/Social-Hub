"use client"
import Dropdown from "@/Components/Dropdown"
import NavLink from "@/Components/NavLink"
import ResponsiveNavLink from "@/Components/ResponsiveNavLink"
import { usePage, router } from "@inertiajs/react"
import { useState } from "react"
import { route } from "ziggy-js"
import { Calendar } from "lucide-react"

export default function AuthenticatedLayout({ header, children }) {
  const user = usePage().props.auth.user
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false)

  const handleLogout = (e) => {
    e.preventDefault()
    router.post(route("logout"))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Social Hub</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              href={route("dashboard")}
              active={route().current("dashboard")}
              className="text-gray-600 hover:text-gray-900 transition-colors text-xl font-medium"
            >
              Dashboard
            </NavLink>
            <NavLink
              href="/socials/connect"
              active={route().current("socials.connect")}
              className="text-gray-600 hover:text-gray-900 transition-colors text-xl font-medium"
            >
              Redes Sociales
            </NavLink>
            <NavLink
              href="/posts/create"
              active={route().current("posts.create")}
              className="text-gray-600 hover:text-gray-900 transition-colors text-xl font-medium"
            >
              Crear Publicación
            </NavLink>
          </nav>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Dropdown>
                <Dropdown.Trigger>
                  <span className="inline-flex rounded-md">
                    <button
                      type="button"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-between min-w-[120px]"
                    >
                      <span>{user.name}</span>
                      <svg className="ml-4 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                </Dropdown.Trigger>

                <Dropdown.Content>
                  <Dropdown.Link href={route("profile.edit")}>Profile</Dropdown.Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Log Out
                  </button>
                </Dropdown.Content>
              </Dropdown>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-2">
            <button
              onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path
                  className={!showingNavigationDropdown ? "inline-flex" : "hidden"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  className={showingNavigationDropdown ? "inline-flex" : "hidden"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div className={(showingNavigationDropdown ? "block" : "hidden") + " bg-white/90 backdrop-blur-sm border-b"}>
          <div className="container mx-auto px-4 py-4 space-y-2">
            <ResponsiveNavLink href={route("dashboard")} active={route().current("dashboard")}>
              Dashboard
            </ResponsiveNavLink>
            <ResponsiveNavLink href="/socials/connect" active={route().current("socials.connect")}>
              Redes Sociales
            </ResponsiveNavLink>
            <ResponsiveNavLink href="/posts/create" active={route().current("posts.create")}>
              Crear Publicación
            </ResponsiveNavLink>

            <div className="border-t pt-4 mt-4">
              <div className="mb-3">
                <div className="text-base font-medium text-gray-800">{user.name}</div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>
              <ResponsiveNavLink href={route("profile.edit")}>Profile</ResponsiveNavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition duration-150 ease-in-out"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header if exists */}
      {header && (
        <header className="bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="container mx-auto px-4 py-6">{header}</div>
        </header>
      )}

      <main>{children}</main>
    </div>
  )
}
