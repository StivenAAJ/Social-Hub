import React from "react"
import { Link } from "@inertiajs/react"
import { Button } from "@/components/button"
import { Card, CardContent } from "@/components/card"
import { Calendar, Users, BarChart3, Clock, Zap, Shield } from "lucide-react"

export default function Welcome() {
  const features = [
    {
      title: "Programación Inteligente",
      description: "Programa tus publicaciones para los mejores momentos y mantén tu audiencia siempre comprometida.",
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      bg: "bg-blue-100"
    },
    {
      title: "Múltiples Plataformas",
      description: "Conecta Instagram, Facebook, Twitter, LinkedIn y más. Todo desde una sola interfaz.",
      icon: <Users className="w-8 h-8 text-purple-600" />,
      bg: "bg-purple-100"
    },
    {
      title: "Análisis Detallados",
      description: "Obtén insights valiosos sobre el rendimiento de tu contenido y optimiza tu estrategia.",
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
      bg: "bg-green-100"
    },
    {
      title: "Ahorra Tiempo",
      description: "Automatiza tu flujo de trabajo y dedica más tiempo a crear contenido de calidad.",
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      bg: "bg-orange-100"
    },
    {
      title: "Fácil de Usar",
      description: "Interfaz intuitiva que no requiere conocimientos técnicos. Comienza en minutos.",
      icon: <Zap className="w-8 h-8 text-red-600" />,
      bg: "bg-red-100"
    },
    {
      title: "Seguro y Confiable",
      description: "Tus datos están protegidos con los más altos estándares de seguridad y privacidad.",
      icon: <Shield className="w-8 h-8 text-indigo-600" />,
      bg: "bg-indigo-100"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Social Hub</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-xl">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Características</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Precios</Link>
            <Link href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contacto</Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild className="text-xl">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Programa tu contenido en{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">redes sociales</span>
          </h1>
          <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Gestiona todas tus redes sociales desde un solo lugar. Programa publicaciones, analiza métricas y haz crecer tu audiencia de manera eficiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="text-xl px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/register">Comenzar Gratis</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-xl px-8 py-4 bg-transparent">
              <Link href="/login">Ya tengo cuenta</Link>
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-8 text-2xl text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Prueba gratuita de 14 días</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Sin tarjeta de crédito</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Todo lo que necesitas para triunfar</h2>
          <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
            Herramientas poderosas diseñadas para hacer que la gestión de redes sociales sea simple y efectiva.
          </p>
        </div>
        <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 ${feature.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

1      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para transformar tu presencia en redes sociales?
          </h2>
          <p className="text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Únete a miles de creadores y empresas que ya están usando Social Hub para hacer crecer su audiencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" asChild className="text-xl px-8 py-4">
              <Link href="/register">Crear Cuenta Gratis</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-xl px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Social Hub. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
