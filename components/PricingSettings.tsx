'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DollarSign, Save, AlertCircle } from 'lucide-react'

interface PricingConfig {
  pricePerM2: number
  profitMargin: number
}

export function PricingSettings() {
  const [config, setConfig] = useState<PricingConfig>({
    pricePerM2: 800,
    profitMargin: 25
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createClient()

  useEffect(() => {
    loadConfig()
  }, [])

  async function loadConfig() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('system_config')
        .select('config_key, config_value')
        .in('config_key', ['price_per_m2_usd', 'profit_margin_percent'])

      if (error) throw error

      if (data) {
        const priceConfig = data.find(d => d.config_key === 'price_per_m2_usd')
        const marginConfig = data.find(d => d.config_key === 'profit_margin_percent')

        setConfig({
          pricePerM2: priceConfig ? parseFloat(priceConfig.config_value) : 800,
          profitMargin: marginConfig ? parseFloat(marginConfig.config_value) : 25
        })
      }
    } catch (error) {
      console.error('Error loading config:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveConfig() {
    try {
      setSaving(true)
      setMessage('')

      // Actualizar precio por m²
      const { error: priceError } = await supabase
        .from('system_config')
        .update({ config_value: config.pricePerM2.toString() })
        .eq('config_key', 'price_per_m2_usd')

      if (priceError) throw priceError

      // Actualizar margen de ganancia
      const { error: marginError } = await supabase
        .from('system_config')
        .update({ config_value: config.profitMargin.toString() })
        .eq('config_key', 'profit_margin_percent')

      if (marginError) throw marginError

      setMessage('✅ Configuración guardada correctamente')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving config:', error)
      setMessage('❌ Error al guardar la configuración')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-4 border-slate-200">
        <CardContent className="p-8">
          <p className="text-xl text-slate-600 text-center">Cargando configuración...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-4 border-blue-200 bg-blue-50">
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-blue-500 rounded-2xl">
            <DollarSign className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900">
              Configuración de Precios
            </h3>
            <p className="text-lg text-slate-600">
              Establece tus tarifas por metro cuadrado
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Precio por m² */}
          <div>
            <label className="block text-xl font-semibold text-slate-900 mb-3">
              💵 Precio por Metro Cuadrado (USD):
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl text-slate-600 font-bold">
                $
              </span>
              <Input
                type="number"
                value={config.pricePerM2}
                onChange={(e) => setConfig({ ...config, pricePerM2: parseFloat(e.target.value) || 0 })}
                className="pl-12 h-16 text-2xl border-4 border-blue-300 focus:border-blue-500"
                min="0"
                step="10"
              />
            </div>
            <p className="text-lg text-slate-600 mt-2">
              Este es el precio que cobrarás por cada m² construido
            </p>
          </div>

          {/* Margen de Ganancia */}
          <div>
            <label className="block text-xl font-semibold text-slate-900 mb-3">
              📈 Margen de Ganancia (%):
            </label>
            <div className="relative">
              <Input
                type="number"
                value={config.profitMargin}
                onChange={(e) => setConfig({ ...config, profitMargin: parseFloat(e.target.value) || 0 })}
                className="h-16 text-2xl border-4 border-blue-300 focus:border-blue-500"
                min="0"
                max="100"
                step="5"
              />
              <span className="absolute right-5 top-1/2 transform -translate-y-1/2 text-2xl text-slate-600 font-bold">
                %
              </span>
            </div>
            <p className="text-lg text-slate-600 mt-2">
              Tu ganancia sobre el costo de materiales
            </p>
          </div>

          {/* Ejemplo de cálculo */}
          <div className="p-6 bg-white border-4 border-slate-200 rounded-xl">
            <h4 className="text-xl font-bold text-slate-900 mb-3">
              📊 Ejemplo de Presupuesto:
            </h4>
            <div className="space-y-2 text-lg">
              <div className="flex justify-between">
                <span className="text-slate-600">Casa de 100 m²:</span>
                <span className="font-bold text-slate-900">
                  ${(config.pricePerM2 * 100).toLocaleString()} USD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Margen de ganancia ({config.profitMargin}%):</span>
                <span className="font-bold text-green-600">
                  ${(config.pricePerM2 * 100 * config.profitMargin / 100).toLocaleString()} USD
                </span>
              </div>
              <div className="border-t-2 border-slate-300 pt-2 flex justify-between">
                <span className="text-slate-900 font-semibold">Total a cobrar:</span>
                <span className="font-bold text-2xl text-blue-600">
                  ${(config.pricePerM2 * 100 * (1 + config.profitMargin / 100)).toLocaleString()} USD
                </span>
              </div>
            </div>
          </div>

          {/* Botón Guardar */}
          <Button
            onClick={saveConfig}
            disabled={saving}
            className="w-full h-16 text-xl bg-green-600 hover:bg-green-700"
          >
            {saving ? (
              <>Guardando...</>
            ) : (
              <>
                <Save className="h-6 w-6 mr-3" />
                Guardar Configuración
              </>
            )}
          </Button>

          {/* Mensaje */}
          {message && (
            <div className={`p-4 rounded-lg text-lg font-semibold text-center ${
              message.includes('✅') 
                ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                : 'bg-red-100 text-red-800 border-2 border-red-300'
            }`}>
              {message}
            </div>
          )}

          {/* Nota importante */}
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-lg text-slate-700">
                <strong>Importante:</strong> Este precio se usará como base para todos tus presupuestos. 
                Puedes ajustarlo en cualquier momento.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
