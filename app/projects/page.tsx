'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Project } from '@/lib/types/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils/formatters'
import { Plus, Search, Zap, Eye, Trash2 } from 'lucide-react'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const supabase = createClient()

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Error al eliminar el proyecto')
    }
  }

  const filteredProjects = projects.filter(project =>
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.project_code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      in_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-purple-100 text-purple-800'
    }

    const labels = {
      draft: 'Borrador',
      in_review: 'En revisión',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      completed: 'Completado'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando proyectos...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📋 Proyectos</h1>
        <p className="text-gray-600">
          Gestiona todos tus presupuestos guardados
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, cliente o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Link href="/express">
              <Button className="bg-yellow-500 hover:bg-yellow-600">
                <Zap className="h-4 w-4 mr-2" />
                Presupuesto Express
              </Button>
            </Link>

            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-gray-500 mb-4">
              {projects.length === 0 ? (
                <>
                  <p className="text-lg mb-2">No hay proyectos aún</p>
                  <p className="text-sm">Crea tu primer presupuesto usando el modo Express</p>
                </>
              ) : (
                <p>No se encontraron proyectos con ese criterio de búsqueda</p>
              )}
            </div>
            {projects.length === 0 && (
              <Link href="/express">
                <Button className="bg-yellow-500 hover:bg-yellow-600">
                  <Zap className="h-4 w-4 mr-2" />
                  Crear Presupuesto Express
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map(project => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{project.project_name}</h3>
                      {getStatusBadge(project.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Código:</span> {project.project_code}
                      </div>
                      <div>
                        <span className="font-medium">Cliente:</span> {project.client_name}
                      </div>
                      {project.location && (
                        <div>
                          <span className="font-medium">Ubicación:</span> {project.location}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Fecha:</span> {formatDate(project.created_at)}
                      </div>
                    </div>

                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-gray-600">Costo:</span>{' '}
                        <span className="font-semibold">{formatCurrency(project.total_cost)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Margen:</span>{' '}
                        <span className="font-semibold text-green-600">
                          {project.profit_margin_percentage}% ({formatCurrency(project.profit_amount)})
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Precio final:</span>{' '}
                        <span className="font-bold text-blue-600 text-lg">
                          {formatCurrency(project.final_price)}
                        </span>
                      </div>
                    </div>

                    {project.notes && (
                      <p className="text-sm text-gray-500 mt-2 italic">{project.notes}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/projects/${project.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteProject(project.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        Mostrando {filteredProjects.length} de {projects.length} proyectos
      </div>
    </div>
  )
}
