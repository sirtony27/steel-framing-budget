'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ExpressFormula, MaterialCatalog } from '@/lib/types/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/utils/formatters'
import { calculateProjectTotals } from '@/lib/utils/calculations'
import { Zap, Save, FileText, Download } from 'lucide-react'

interface CalculationResult {
  name: string
  quantity: number
  unit: string
  unit_cost: number
  total_cost: number
  category: string
  material_id: string
}

export default function ExpressPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [formulas, setFormulas] = useState<(ExpressFormula & { material?: MaterialCatalog })[]>([])
  
  // Parámetros del presupuesto
  const [totalM2, setTotalM2] = useState<number>(100)
  const [houseType, setHouseType] = useState<'1planta' | '2plantas'>('1planta')
  const [qualityLevel, setQualityLevel] = useState<'basica' | 'media' | 'premium'>('media')
  const [bedrooms, setBedrooms] = useState<number>(3)
  const [bathrooms, setBathrooms] = useState<number>(2)
  const [profitMargin, setProfitMargin] = useState<number>(25)
  
  // Opcionales
  const [optionals, setOptionals] = useState<Record<string, boolean>>({})
  
  // Datos del cliente
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [location, setLocation] = useState('')

  // Resultados
  const [calculations, setCalculations] = useState<CalculationResult[]>([])
  const [totalCost, setTotalCost] = useState(0)
  const [profitAmount, setProfitAmount] = useState(0)
  const [finalPrice, setFinalPrice] = useState(0)

  const supabase = createClient()

  useEffect(() => {
    loadFormulas()
  }, [])

  useEffect(() => {
    calculateBudget()
  }, [totalM2, houseType, qualityLevel, optionals, formulas, profitMargin])

  async function loadFormulas() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('express_formulas')
        .select(`
          *,
          material:material_catalog(*)
        `)
        .eq('is_active', true)
        .order('order')

      if (error) throw error
      setFormulas(data || [])
    } catch (error) {
      console.error('Error loading formulas:', error)
    } finally {
      setLoading(false)
    }
  }

  function calculateBudget() {
    if (!totalM2 || formulas.length === 0) return

    const results: CalculationResult[] = []

    formulas.forEach(formula => {
      // Verificar si aplica según tipo de casa y calidad
      const matchesHouseType = formula.house_type === 'todos' || formula.house_type === houseType
      const matchesQuality = formula.quality_level === 'todos' || formula.quality_level === qualityLevel
      
      // Si es opcional, verificar si está seleccionado
      if (formula.is_optional && !optionals[formula.id]) {
        return
      }

      if (matchesHouseType && matchesQuality && formula.material) {
        const quantity = totalM2 * formula.quantity_per_m2
        const unitCost = formula.material.unit_cost
        const totalCost = quantity * unitCost

        results.push({
          name: formula.material.name,
          quantity: Math.ceil(quantity * 100) / 100,
          unit: formula.material.unit,
          unit_cost: unitCost,
          total_cost: totalCost,
          category: formula.name,
          material_id: formula.material.id
        })
      }
    })

    setCalculations(results)

    const cost = results.reduce((sum, item) => sum + item.total_cost, 0)
    const profit = cost * (profitMargin / 100)
    const final = cost + profit

    setTotalCost(cost)
    setProfitAmount(profit)
    setFinalPrice(final)
  }

  async function saveProject() {
    if (!clientName) {
      alert('Por favor ingresa el nombre del cliente')
      return
    }

    try {
      const projectCode = `SF-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          project_name: `Casa ${clientName} - ${totalM2}m²`,
          project_code: projectCode,
          client_name: clientName,
          client_email: clientEmail || null,
          client_phone: clientPhone || null,
          location: location || null,
          status: 'draft',
          total_cost: totalCost,
          profit_margin_percentage: profitMargin,
          profit_amount: profitAmount,
          final_price: finalPrice,
          notes: `Presupuesto Express - ${houseType} - Calidad ${qualityLevel}`
        })
        .select()
        .single()

      if (projectError) throw projectError

      const budgetItems = calculations.map((calc, index) => ({
        project_id: project.id,
        category_id: formulas.find(f => f.material?.id === calc.material_id)?.category_id || '',
        item_type: 'material' as const,
        name: calc.name,
        unit: calc.unit,
        quantity: calc.quantity,
        unit_cost: calc.unit_cost,
        order: index
      }))

      const { error: itemsError } = await supabase
        .from('budget_items')
        .insert(budgetItems)

      if (itemsError) throw itemsError

      alert('¡Presupuesto guardado exitosamente!')
      router.push(`/projects/${project.id}`)
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Error al guardar el presupuesto')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando calculadora...</div>
      </div>
    )
  }

  const optionalFormulas = formulas.filter(f => f.is_optional)

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold">Presupuesto Express</h1>
        </div>
        <p className="text-gray-600">
          Calcula un presupuesto rápido basado en parámetros predefinidos
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parámetros de la Casa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Metros cuadrados totales</Label>
                  <Input
                    type="number"
                    value={totalM2}
                    onChange={(e) => setTotalM2(Number(e.target.value))}
                    min={20}
                    max={500}
                  />
                </div>

                <div>
                  <Label>Tipo de casa</Label>
                  <select
                    value={houseType}
                    onChange={(e) => setHouseType(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="1planta">1 Planta</option>
                    <option value="2plantas">2 Plantas</option>
                  </select>
                </div>

                <div>
                  <Label>Dormitorios</Label>
                  <Input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    min={1}
                    max={6}
                  />
                </div>

                <div>
                  <Label>Baños</Label>
                  <Input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    min={1}
                    max={4}
                  />
                </div>

                <div className="col-span-2">
                  <Label>Nivel de calidad</Label>
                  <select
                    value={qualityLevel}
                    onChange={(e) => setQualityLevel(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="basica">Básica (económica)</option>
                    <option value="media">Media (estándar)</option>
                    <option value="premium">Premium (alta gama)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {optionalFormulas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Opcionales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {optionalFormulas.map(formula => (
                    <label key={formula.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={optionals[formula.id] || false}
                        onChange={(e) => setOptionals({
                          ...optionals,
                          [formula.id]: e.target.checked
                        })}
                        className="w-4 h-4"
                      />
                      <span>{formula.name}</span>
                      {formula.description && (
                        <span className="text-sm text-gray-500">- {formula.description}</span>
                      )}
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Datos del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nombre del cliente *</Label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="cliente@email.com"
                  />
                </div>

                <div>
                  <Label>Teléfono</Label>
                  <Input
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+54 11 1234-5678"
                  />
                </div>
              </div>

              <div>
                <Label>Ubicación</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Buenos Aires, Argentina"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Resumen del Presupuesto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Items calculados:</span>
                  <span className="font-semibold">{calculations.length}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Metros cuadrados:</span>
                  <span className="font-semibold">{totalM2} m²</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Costo de materiales:</span>
                  <span className="font-semibold">{formatCurrency(totalCost)}</span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-600">Margen de ganancia:</span>
                    <Input
                      type="number"
                      value={profitMargin}
                      onChange={(e) => setProfitMargin(Number(e.target.value))}
                      className="w-20 h-8 text-right"
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="text-right text-sm text-green-600">
                    + {formatCurrency(profitAmount)}
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">PRECIO FINAL:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(finalPrice)}
                    </span>
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">
                    ~{formatCurrency(finalPrice / totalM2)}/m²
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Button 
                  onClick={saveProject}
                  className="w-full"
                  disabled={!clientName}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Presupuesto
                </Button>

                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
