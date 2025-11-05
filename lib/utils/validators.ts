import { z } from 'zod'

export const projectSchema = z.object({
  project_name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  client_name: z.string().min(2, 'El nombre del cliente es requerido'),
  client_email: z.string().email('Email inválido').optional().or(z.literal('')),
  client_phone: z.string().optional(),
  location: z.string().optional(),
  profit_margin_percentage: z.number().min(0).max(100),
  notes: z.string().optional(),
})

export const budgetItemSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  description: z.string().optional(),
  category_id: z.string().uuid('Categoría inválida'),
  item_type: z.enum(['material', 'labor', 'equipment', 'service']),
  unit: z.string().min(1, 'La unidad es requerida'),
  quantity: z.number().positive('La cantidad debe ser mayor a 0'),
  unit_cost: z.number().positive('El costo debe ser mayor a 0'),
  supplier: z.string().optional(),
  notes: z.string().optional(),
})

export const templateSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  total_area_m2: z.number().positive('El área debe ser mayor a 0'),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  floors: z.number().int().min(1, 'Debe tener al menos 1 piso'),
})

export const materialSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  description: z.string().optional(),
  category_id: z.string().uuid('Categoría inválida'),
  unit: z.string().min(1, 'La unidad es requerida'),
  unit_cost: z.number().positive('El costo debe ser mayor a 0'),
  supplier: z.string().optional(),
  supplier_code: z.string().optional(),
})

export type ProjectFormData = z.infer<typeof projectSchema>
export type BudgetItemFormData = z.infer<typeof budgetItemSchema>
export type TemplateFormData = z.infer<typeof templateSchema>
export type MaterialFormData = z.infer<typeof materialSchema>
