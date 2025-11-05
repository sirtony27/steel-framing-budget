import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, FolderOpen, Package, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Sistema de Presupuestos
            </h1>
            <h2 className="text-3xl font-semibold text-blue-600 mb-6">
              Steel Framing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gestiona presupuestos profesionales para construcciones en steel framing
              con cálculo automático de costos y ganancias.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Link href="/express">
              <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-yellow-500 rounded-lg">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Presupuesto Express</h3>
                  </div>
                  <p className="text-gray-600">
                    Crea un presupuesto en minutos basado en parámetros predefinidos
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/projects">
              <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-blue-500 rounded-lg">
                      <FolderOpen className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Mis Proyectos</h3>
                  </div>
                  <p className="text-gray-600">
                    Gestiona todos tus presupuestos guardados
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link href="/catalog">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Catálogo</CardTitle>
                  </div>
                  <CardDescription>
                    Administra precios de materiales
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/templates">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Plantillas</CardTitle>
                  </div>
                  <CardDescription>
                    Crea plantillas reutilizables de casas
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cálculo Automático</CardTitle>
                <CardDescription>
                  Calcula costos, márgenes y precios finales al instante
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Info Box */}
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-semibold mb-3">
                ✨ Características Principales
              </h3>
              <ul className="space-y-2 text-blue-50">
                <li>✓ Presupuesto Express: Cálculo rápido en minutos</li>
                <li>✓ Precios históricos: Los presupuestos mantienen sus precios originales</li>
                <li>✓ Catálogo actualizable: Modifica precios sin afectar proyectos anteriores</li>
                <li>✓ Márgenes personalizables: Ajusta tu ganancia en cada proyecto</li>
                <li>✓ Exportación a PDF: Comparte presupuestos profesionales</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
