import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, FolderOpen, Package, FileText, TrendingUp, Clock, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-6">
                <TrendingUp className="h-4 w-4" />
                Sistema Profesional
              </div>
              <h1 className="text-6xl font-bold text-slate-900 mb-4 tracking-tight">
                Steel Framing
                <span className="block text-orange-500">Budget System</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Crea presupuestos profesionales en minutos. Control total de costos, 
                márgenes y precios históricos.
              </p>
            </div>

            {/* Quick Actions - Cards Principales */}
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              <Link href="/express" className="group">
                <Card className="relative overflow-hidden border-2 border-orange-200 hover:border-orange-400 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-white">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-300" />
                  <CardContent className="pt-8 pb-8 relative">
                    <div className="flex items-start gap-4">
                      <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                        <Zap className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                          Presupuesto Express
                        </h3>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                          Calculadora inteligente con parámetros predefinidos. 
                          Resultados en segundos.
                        </p>
                        <div className="flex items-center gap-2 text-orange-600 font-medium">
                          <Clock className="h-4 w-4" />
                          <span>Ahorra hasta 80% del tiempo</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/projects" className="group">
                <Card className="relative overflow-hidden border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-white">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-300" />
                  <CardContent className="pt-8 pb-8 relative">
                    <div className="flex items-start gap-4">
                      <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                        <FolderOpen className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                          Mis Proyectos
                        </h3>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                          Centraliza todos tus presupuestos. Búsqueda rápida 
                          y organización eficiente.
                        </p>
                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                          <Shield className="h-4 w-4" />
                          <span>Precios históricos protegidos</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Features Grid - 3 columnas */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Link href="/catalog" className="group">
                <Card className="h-full border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 bg-white">
                  <CardHeader>
                    <div className="mb-4">
                      <div className="inline-flex p-3 bg-slate-100 rounded-xl group-hover:bg-slate-900 transition-colors">
                        <Package className="h-6 w-6 text-slate-700 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    <CardTitle className="text-xl text-slate-900">Catálogo de Materiales</CardTitle>
                    <CardDescription className="text-slate-600">
                      Base de datos actualizable de precios. Historial automático de cambios.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/templates" className="group">
                <Card className="h-full border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 bg-white">
                  <CardHeader>
                    <div className="mb-4">
                      <div className="inline-flex p-3 bg-slate-100 rounded-xl group-hover:bg-slate-900 transition-colors">
                        <FileText className="h-6 w-6 text-slate-700 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    <CardTitle className="text-xl text-slate-900">Plantillas</CardTitle>
                    <CardDescription className="text-slate-600">
                      Crea modelos reutilizables de casas típicas para mayor rapidez.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Card className="h-full border border-slate-200 bg-white">
                <CardHeader>
                  <div className="mb-4">
                    <div className="inline-flex p-3 bg-green-100 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-slate-900">Cálculo Inteligente</CardTitle>
                  <CardDescription className="text-slate-600">
                    Márgenes automáticos, totales en tiempo real y precios por m².
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Features Banner */}
            <Card className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-0 shadow-2xl">
              <div className="absolute inset-0 bg-grid-white/[0.05]" />
              <CardContent className="pt-10 pb-10 relative">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-3">
                    ¿Por qué elegir nuestro sistema?
                  </h3>
                  <p className="text-slate-300 text-lg">
                    Diseñado específicamente para profesionales del Steel Framing
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-orange-500/20 rounded-2xl mb-4">
                      <Zap className="h-8 w-8 text-orange-400" />
                    </div>
                    <h4 className="text-white font-semibold mb-2 text-lg">Rapidez</h4>
                    <p className="text-slate-400 text-sm">
                      Presupuestos en 5 minutos con Express
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-blue-500/20 rounded-2xl mb-4">
                      <Shield className="h-8 w-8 text-blue-400" />
                    </div>
                    <h4 className="text-white font-semibold mb-2 text-lg">Integridad</h4>
                    <p className="text-slate-400 text-sm">
                      Los precios se congelan al crear presupuestos
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-green-500/20 rounded-2xl mb-4">
                      <TrendingUp className="h-8 w-8 text-green-400" />
                    </div>
                    <h4 className="text-white font-semibold mb-2 text-lg">Rentabilidad</h4>
                    <p className="text-slate-400 text-sm">
                      Control preciso de márgenes y ganancias
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
