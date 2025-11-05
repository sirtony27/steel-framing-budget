'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MaterialCatalog, Category } from '@/lib/types/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/formatters'
import { Home, Search, Check, X } from 'lucide-react'

export default function CatalogPage() {
  const [materials, setMaterials] = useState<(MaterialCatalog & { category?: Category })[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [editingMaterial, setEditingMaterial] = useState<MaterialCatalog | null>(null)
  const [newPrice, setNewPrice] = useState('')

  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      
      const { data: categoriesData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('order')
      
      if (catError) throw catError
      setCategories(categoriesData || [])

      const { data: materialsData, error: matError } = await supabase
        .from('material_catalog')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('is_active', true)
        .order('name')

      if (matError) throw matError
      setMaterials(materialsData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updatePrice(materialId: string, newCost: number) {
    try {
      const { error } = await supabase
        .from('material_catalog')
        .update({ 
          unit_cost: newCost,
          last_update: new Date().toISOString()
        })
        .eq('id', materialId)

      if (error) throw error
      
      setEditingMaterial(null)
      setNewPrice('')
      loadData()
    } catch (error) {
      console.error('Error updating price:', error)
    }
  }

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || material.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  const groupedMaterials = categories.reduce((acc, category) => {
    const categoryMaterials = filteredMaterials.filter(m => m.category_id === category.id)
    if (categoryMaterials.length > 0) {
      acc[category.name] = categoryMaterials
    }
    return acc
  }, {} as Record<string, MaterialCatalog[]>)

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-2xl text-slate-600">Cargando precios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6 max-w-6xl">
        
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
            💰 Precios de Materiales
          </h1>
          <p className="text-2xl text-slate-600 leading-relaxed">
            Actualiza los precios de los materiales cuando sea necesario
          </p>
        </div>

        {/* Búsqueda y Filtros */}
        <Card className="mb-10 border-4 border-slate-200">
          <CardContent className="p-8">
            <div className="space-y-6">
              
              {/* Búsqueda */}
              <div>
                <label className="block text-xl font-semibold text-slate-900 mb-3">
                  Buscar material:
                </label>
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6" />
                  <Input
                    placeholder="Escribe el nombre del material..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-16 h-16 text-xl border-4 border-slate-300 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Filtro por categoría */}
              <div>
                <label className="block text-xl font-semibold text-slate-900 mb-3">
                  Filtrar por tipo:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-6 py-4 border-4 border-slate-300 rounded-lg text-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 bg-white"
                >
                  <option value="all">Todos los materiales</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Materiales */}
        <div className="space-y-8">
          {Object.entries(groupedMaterials).map(([categoryName, categoryMaterials]) => (
            <div key={categoryName}>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 pb-3 border-b-4 border-slate-200">
                {categoryName}
              </h2>
              
              <div className="space-y-4">
                {categoryMaterials.map(material => (
                  <Card 
                    key={material.id}
                    className="border-4 border-slate-200 hover:border-slate-300 transition-all"
                  >
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        
                        {/* Info del material */}
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            {material.name}
                          </h3>
                          {material.description && (
                            <p className="text-lg text-slate-600 mb-2">
                              {material.description}
                            </p>
                          )}
                          {material.supplier && (
                            <p className="text-lg text-slate-500">
                              <span className="font-semibold">Proveedor:</span> {material.supplier}
                            </p>
                          )}
                        </div>

                        {/* Precio y Acciones */}
                        <div className="flex flex-col items-center gap-4 min-w-[280px]">
                          {editingMaterial?.id === material.id ? (
                            <>
                              <Input
                                type="number"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                className="w-full h-16 text-2xl text-center border-4 border-orange-300 focus:border-orange-500"
                                autoFocus
                                placeholder="Nuevo precio"
                              />
                              <div className="flex gap-3 w-full">
                                <Button
                                  onClick={() => updatePrice(material.id, parseFloat(newPrice))}
                                  className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-6 w-6 mr-2" />
                                  Guardar
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setEditingMaterial(null)
                                    setNewPrice('')
                                  }}
                                  className="flex-1 h-14 text-lg border-4"
                                >
                                  <X className="h-6 w-6 mr-2" />
                                  Cancelar
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-center">
                                <div className="text-4xl font-bold text-orange-600 mb-1">
                                  {formatCurrency(material.unit_cost)}
                                </div>
                                <div className="text-lg text-slate-600">
                                  por {material.unit}
                                </div>
                              </div>
                              <Button
                                onClick={() => {
                                  setEditingMaterial(material)
                                  setNewPrice(material.unit_cost.toString())
                                }}
                                className="w-full h-14 text-lg bg-orange-500 hover:bg-orange-600"
                              >
                                Cambiar Precio
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <Card className="border-4 border-slate-200">
            <CardContent className="py-20 text-center">
              <div className="text-8xl mb-6">🔍</div>
              <p className="text-2xl text-slate-600">
                No se encontraron materiales con ese nombre
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
