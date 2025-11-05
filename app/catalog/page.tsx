'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MaterialCatalog, Category } from '@/lib/types/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/formatters'
import { Plus, Search, Edit2, Check, X, Package2 } from 'lucide-react'

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando catálogo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
              <Package2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Catálogo de Materiales</h1>
              <p className="text-slate-600 mt-1">
                Administra los precios actuales de tus materiales
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-slate-200 shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Buscar materiales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white h-12 min-w-[200px]"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <Button className="h-12 bg-orange-500 hover:bg-orange-600 px-6">
                <Plus className="h-5 w-5 mr-2" />
                Agregar Material
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Materials by category */}
        <div className="space-y-6">
          {Object.entries(groupedMaterials).map(([categoryName, categoryMaterials]) => (
            <Card key={categoryName} className="border-slate-200 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-xl">{categoryName}</span>
                  <span className="text-sm font-normal bg-white/20 px-3 py-1 rounded-full">
                    {categoryMaterials.length} materiales
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {categoryMaterials.map(material => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-lg mb-1">{material.name}</h3>
                        {material.description && (
                          <p className="text-sm text-slate-600 mb-1">{material.description}</p>
                        )}
                        {material.supplier && (
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <span className="font-medium">Proveedor:</span> {material.supplier}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        {editingMaterial?.id === material.id ? (
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <Input
                                type="number"
                                placeholder="Nuevo precio"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                className="w-36 h-10 text-right"
                                autoFocus
                              />
                            </div>
                            <Button
                              size="sm"
                              onClick={() => updatePrice(material.id, parseFloat(newPrice))}
                              className="bg-green-500 hover:bg-green-600 h-10"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingMaterial(null)
                                setNewPrice('')
                              }}
                              className="h-10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-orange-600">
                                {formatCurrency(material.unit_cost)}
                              </div>
                              <div className="text-sm text-slate-500">
                                por {material.unit}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingMaterial(material)
                                setNewPrice(material.unit_cost.toString())
                              }}
                              className="h-10 border-slate-300 hover:border-orange-500 hover:text-orange-600"
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <Card className="border-slate-200 shadow-md">
            <CardContent className="py-16 text-center">
              <Package2 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No se encontraron materiales</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
