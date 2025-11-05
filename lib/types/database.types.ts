export type ProjectStatus = 'draft' | 'in_review' | 'approved' | 'rejected' | 'completed'
export type ItemType = 'material' | 'labor' | 'equipment' | 'service'

export interface SystemConfig {
  id: string
  config_key: string
  config_value: string
  description: string | null
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  order: number
  icon: string | null
  created_at: string
}

export interface HouseTemplate {
  id: string
  name: string
  description: string | null
  total_area_m2: number
  bedrooms: number | null
  bathrooms: number | null
  floors: number
  base_specs: any
  thumbnail_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  project_name: string
  project_code: string
  house_template_id: string | null
  client_name: string
  client_email: string | null
  client_phone: string | null
  location: string | null
  status: ProjectStatus
  total_cost: number
  profit_margin_percentage: number
  profit_amount: number
  final_price: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface BudgetItem {
  id: string
  project_id: string
  category_id: string
  item_type: ItemType
  name: string
  description: string | null
  unit: string
  quantity: number
  unit_cost: number
  total_cost: number
  supplier: string | null
  notes: string | null
  order: number
  created_at: string
  updated_at: string
}

export interface MaterialCatalog {
  id: string
  category_id: string
  name: string
  description: string | null
  unit: string
  unit_cost: number
  supplier: string | null
  supplier_code: string | null
  last_update: string
  is_active: boolean
  created_at: string
}

export interface TemplateItem {
  id: string
  house_template_id: string
  category_id: string
  material_catalog_id: string | null
  item_type: ItemType
  name: string
  description: string | null
  unit: string
  quantity_per_m2: number | null
  base_quantity: number | null
  estimated_unit_cost: number
  order: number
}

export interface ProjectHistory {
  id: string
  project_id: string
  action: string
  changes: any
  created_at: string
}

export type HouseType = '1planta' | '2plantas' | 'todos'
export type QualityLevel = 'basica' | 'media' | 'premium' | 'todos'

export interface ExpressFormula {
  id: string
  name: string
  description: string | null
  category_id: string
  material_catalog_id: string | null
  quantity_per_m2: number
  house_type: HouseType
  quality_level: QualityLevel
  is_optional: boolean
  order: number
  is_active: boolean
  created_at: string
}

export interface PriceHistory {
  id: string
  material_catalog_id: string
  old_price: number
  new_price: number
  changed_at: string
  notes: string | null
}
