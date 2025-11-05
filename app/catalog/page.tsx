'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MaterialCatalog, Category } from '@/lib/types/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/formatters'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'

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
      
      // Cargar categorías
      const { data: categoriesData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('order')
      
      if (catError) throw catError
      setCategories(categoriesData || [])

      // Cargar materiales con categorías
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
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando catálogo...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📦 Catálogo de Materiales</h1>
        <p className="text-gray-600">
          Administra los precios actuales de materiales
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar materiales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Add button */}
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Material
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Materials by category */}
      <div className="space-y-6">
        {Object.entries(groupedMaterials).map(([categoryName, categoryMaterials]) => (
          <Card key={categoryName}>
            <CardHeader>
              <CardTitle>{categoryName} ({categoryMaterials.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categoryMaterials.map(material => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{material.name}</h3>
                      {material.description && (
                        <p className="text-sm text-gray-600">{material.description}</p>
                      )}
                      {material.supplier && (
                        <p className="text-xs text-gray-500">Proveedor: {material.supplier}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {editingMaterial?.id === material.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Nuevo precio"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="w-32"
                          />
                          <Button
                            size="sm"
                            onClick={() => updatePrice(material.id, parseFloat(newPrice))}
                          >
                            Guardar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingMaterial(null)
                              setNewPrice('')
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                              {formatCurrency(material.unit_cost)}
                            </div>
                            <div className="text-sm text-gray-500">
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
                          >
                            <Edit2 className="h-4 w-4" />
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
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No se encontraron materiales
          </CardContent>
        </Card>
      )}
    </div>
  )
}
