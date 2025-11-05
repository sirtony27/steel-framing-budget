import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, FolderOpen, Package, Calculator } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Simple y Claro */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Sistema de Presupuestos
            </h1>
            <p className="text-2xl text-slate-700 leading-relaxed max-w-3xl mx-auto">
              Crea presupuestos para tus proyectos de construcción de forma fácil y rápida
            </p>
          </div>

          {/* Acciones Principales - Cards Grandes */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            
            {/* Presupuesto Express */}
            <Link href="/express" className="block group">
              <Card className="border-4 border-orange-200 hover:border-orange-400 transition-all duration-300 bg-white h-full">
                <CardContent className="p-10 text-center">
                  <div className="inline-flex p-6 bg-orange-500 rounded-3xl mb-6 group-hover:scale-110 transition-transform">
                    <Zap className="h-16 w-16 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Presupuesto Rápido
                  </h2>
                  <p className="text-xl text-slate-600 leading-relaxed">
                    Calcula un presupuesto en pocos minutos con datos predefinidos
                  </p>
                  <div className="mt-8 inline-flex items-center text-orange-600 font-semibold text-lg">
                    <span className="mr-2">Comenzar</span>
                    <span className="text-2xl">→</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Mis Proyectos */}
            <Link href="/projects" className="block group">
              <Card className="border-4 border-blue-200 hover:border-blue-400 transition-all duration-300 bg-white h-full">
                <CardContent className="p-10 text-center">
                  <div className="inline-flex p-6 bg-blue-500 rounded-3xl mb-6 group-hover:scale-110 transition-transform">
                    <FolderOpen className="h-16 w-16 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Mis Proyectos
                  </h2>
                  <p className="text-xl text-slate-600 leading-relaxed">
                    Ver todos los presupuestos que ya has creado
                  </p>
                  <div className="mt-8 inline-flex items-center text-blue-600 font-semibold text-lg">
                    <span className="mr-2">Ver proyectos</span>
                    <span className="text-2xl">→</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Opciones Secundarias */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            
            {/* Catálogo */}
            <Link href="/catalog" className="block group">
              <Card className="border-2 border-slate-200 hover:border-slate-400 transition-all bg-white">
                <CardContent className="p-8 flex items-start gap-6">
                  <div className="p-4 bg-slate-100 rounded-2xl group-hover:bg-slate-900 transition-colors">
                    <Package className="h-12 w-12 text-slate-700 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Catálogo de Precios
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      Ver y actualizar los precios de los materiales
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Plantillas */}
            <Link href="/templates" className="block group">
              <Card className="border-2 border-slate-200 hover:border-slate-400 transition-all bg-white">
                <CardContent className="p-8 flex items-start gap-6">
                  <div className="p-4 bg-slate-100 rounded-2xl group-hover:bg-slate-900 transition-colors">
                    <Calculator className="h-12 w-12 text-slate-700 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Plantillas
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      Modelos de casas predefinidas para usar
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Ayuda Visual */}
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="text-6xl">💡</div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    ¿Cómo funciona?
                  </h3>
                  <ol className="space-y-3 text-lg text-slate-700">
                    <li className="flex gap-3">
                      <span className="font-bold text-orange-600">1.</span>
                      <span>Haz clic en <strong>"Presupuesto Rápido"</strong> para crear uno nuevo</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-orange-600">2.</span>
                      <span>Completa los datos de la casa (metros cuadrados, tipo, etc.)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-orange-600">3.</span>
                      <span>El sistema calculará el precio automáticamente</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-orange-600">4.</span>
                      <span>Guarda el presupuesto y podrás verlo después en <strong>"Mis Proyectos"</strong></span>
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
