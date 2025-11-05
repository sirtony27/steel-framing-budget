import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PricingSettings } from '@/components/PricingSettings'
import { Home } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6 max-w-4xl">
        
        {/* Botón Volver */}
        <div className="mb-8">
          <Link href="/">
            <Button className="h-14 px-6 text-lg bg-slate-200 hover:bg-slate-300 text-slate-900">
              <Home className="h-6 w-6 mr-3" />
              Volver al Inicio
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            ⚙️ Configuración
          </h1>
          <p className="text-2xl text-slate-600 leading-relaxed">
            Ajusta los valores según tus tarifas y márgenes de ganancia
          </p>
        </div>

        {/* Componente de configuración */}
        <PricingSettings />

      </div>
    </div>
  )
}
