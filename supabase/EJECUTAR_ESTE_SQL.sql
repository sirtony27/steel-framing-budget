-- 🔧 INSTRUCCIONES PARA EJECUTAR ESTE SQL EN SUPABASE
-- 
-- 1. Ve a: https://llazprxejhipzhfnsijg.supabase.co
-- 2. En el menú lateral, busca: SQL Editor
-- 3. Click en "New query"
-- 4. Copia TODO el contenido de este archivo (desde la línea siguiente)
-- 5. Pégalo en el editor
-- 6. Click en "Run" (o presiona Ctrl+Enter)
-- 
-- ⏱️ Tiempo estimado: 10-15 segundos
-- ✅ Si no hay errores, verás: "Success. No rows returned"

-- ==========================================
-- INICIO DEL SCRIPT SQL
-- ==========================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tipos ENUM
CREATE TYPE project_status AS ENUM ('draft', 'in_review', 'approved', 'rejected', 'completed');
CREATE TYPE item_type AS ENUM ('material', 'labor', 'equipment', 'service');

-- =============================================
-- TABLA: categories
-- =============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    "order" INTEGER DEFAULT 0,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABLA: house_templates
-- =============================================
CREATE TABLE house_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    total_area_m2 NUMERIC(10,2) NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    floors INTEGER DEFAULT 1,
    base_specs JSONB,
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABLA: projects
-- =============================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name TEXT NOT NULL,
    project_code TEXT UNIQUE NOT NULL,
    house_template_id UUID REFERENCES house_templates(id),
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_phone TEXT,
    location TEXT,
    status project_status DEFAULT 'draft',
    total_cost NUMERIC(15,2) DEFAULT 0,
    profit_margin_percentage NUMERIC(5,2) DEFAULT 20,
    profit_amount NUMERIC(15,2) DEFAULT 0,
    final_price NUMERIC(15,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABLA: material_catalog
-- =============================================
CREATE TABLE material_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id),
    name TEXT NOT NULL,
    description TEXT,
    unit TEXT NOT NULL,
    unit_cost NUMERIC(15,2) NOT NULL,
    supplier TEXT,
    supplier_code TEXT,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABLA: template_items
-- =============================================
CREATE TABLE template_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    house_template_id UUID REFERENCES house_templates(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    material_catalog_id UUID REFERENCES material_catalog(id),
    item_type item_type NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    unit TEXT NOT NULL,
    quantity_per_m2 NUMERIC(10,4),
    base_quantity NUMERIC(10,2),
    estimated_unit_cost NUMERIC(15,2),
    "order" INTEGER DEFAULT 0
);

-- =============================================
-- TABLA: budget_items
-- =============================================
CREATE TABLE budget_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    item_type item_type NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    unit TEXT NOT NULL,
    quantity NUMERIC(10,2) NOT NULL,
    unit_cost NUMERIC(15,2) NOT NULL,
    total_cost NUMERIC(15,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
    supplier TEXT,
    notes TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABLA: project_history
-- =============================================
CREATE TABLE project_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    changes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ÍNDICES para performance
-- =============================================
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_code ON projects(project_code);
CREATE INDEX idx_budget_items_project ON budget_items(project_id);
CREATE INDEX idx_template_items_template ON template_items(house_template_id);
CREATE INDEX idx_material_catalog_category ON material_catalog(category_id);
CREATE INDEX idx_material_catalog_active ON material_catalog(is_active);

-- =============================================
-- FUNCIÓN: Actualizar updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_house_templates_updated_at 
    BEFORE UPDATE ON house_templates
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_items_updated_at 
    BEFORE UPDATE ON budget_items
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNCIÓN: Actualizar totales del proyecto
-- =============================================
CREATE OR REPLACE FUNCTION update_project_totals()
RETURNS TRIGGER AS $$
DECLARE
    v_project_id UUID;
    v_total_cost NUMERIC(15,2);
    v_profit_margin NUMERIC(5,2);
BEGIN
    -- Determinar el project_id según la operación
    IF TG_OP = 'DELETE' THEN
        v_project_id := OLD.project_id;
    ELSE
        v_project_id := NEW.project_id;
    END IF;

    -- Calcular el costo total
    SELECT COALESCE(SUM(total_cost), 0) INTO v_total_cost
    FROM budget_items
    WHERE project_id = v_project_id;

    -- Obtener el margen de ganancia actual
    SELECT profit_margin_percentage INTO v_profit_margin
    FROM projects
    WHERE id = v_project_id;

    -- Actualizar el proyecto
    UPDATE projects
    SET 
        total_cost = v_total_cost,
        profit_amount = v_total_cost * (v_profit_margin / 100),
        final_price = v_total_cost + (v_total_cost * (v_profit_margin / 100))
    WHERE id = v_project_id;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_project_totals
    AFTER INSERT OR UPDATE OR DELETE ON budget_items
    FOR EACH ROW
    EXECUTE FUNCTION update_project_totals();

-- =============================================
-- ROW LEVEL SECURITY (RLS) - DESHABILITADO
-- =============================================
-- Sin autenticación, no se necesita RLS
-- Todas las tablas son accesibles sin restricciones

-- =============================================
-- DATOS INICIALES (SEED)
-- =============================================

-- Categorías predefinidas
INSERT INTO categories (name, description, "order", icon) VALUES
    ('Estructura', 'Perfiles de acero, montantes, soleras', 1, 'Building2'),
    ('Cerramientos', 'Placas de yeso, OSB, revestimientos', 2, 'Layers'),
    ('Aislación', 'Aislantes térmicos y acústicos', 3, 'Wind'),
    ('Instalación Eléctrica', 'Cables, cajas, tomas, llaves', 4, 'Zap'),
    ('Instalación Sanitaria', 'Cañerías, válvulas, accesorios', 5, 'Droplet'),
    ('Aberturas', 'Puertas y ventanas', 6, 'DoorOpen'),
    ('Terminaciones', 'Pinturas, revestimientos finales', 7, 'Paintbrush'),
    ('Mano de Obra', 'Trabajo especializado', 8, 'Users'),
    ('Otros', 'Gastos varios y servicios', 9, 'MoreHorizontal');

-- Materiales de ejemplo en el catálogo
INSERT INTO material_catalog (category_id, name, description, unit, unit_cost, supplier) VALUES
    ((SELECT id FROM categories WHERE name = 'Estructura'), 'Perfil C 100mm x 0.9mm', 'Perfil estructural C 100x40x15x0.9mm', 'm', 850.00, 'Proveedor Steel'),
    ((SELECT id FROM categories WHERE name = 'Estructura'), 'Perfil U 100mm x 0.9mm', 'Perfil U 100x40x0.9mm', 'm', 780.00, 'Proveedor Steel'),
    ((SELECT id FROM categories WHERE name = 'Estructura'), 'Perfil C 70mm x 0.9mm', 'Perfil estructural C 70x40x15x0.9mm', 'm', 720.00, 'Proveedor Steel'),
    ((SELECT id FROM categories WHERE name = 'Cerramientos'), 'Placa de Yeso 12.5mm', 'Placa estándar 1.20 x 2.40m', 'unidad', 3200.00, 'Durlock'),
    ((SELECT id FROM categories WHERE name = 'Cerramientos'), 'Placa de Yeso RH 12.5mm', 'Placa resistente a la humedad', 'unidad', 3800.00, 'Durlock'),
    ((SELECT id FROM categories WHERE name = 'Cerramientos'), 'Placa OSB 11mm', 'OSB estructural 1.22 x 2.44m', 'unidad', 8500.00, 'Masisa'),
    ((SELECT id FROM categories WHERE name = 'Aislación'), 'Lana de Vidrio 50mm', 'Rollo aislante térmico', 'm²', 950.00, 'Isover'),
    ((SELECT id FROM categories WHERE name = 'Aislación'), 'Lana de Vidrio 100mm', 'Rollo aislante térmico reforzado', 'm²', 1450.00, 'Isover'),
    ((SELECT id FROM categories WHERE name = 'Aislación'), 'Barrera de vapor', 'Polietileno 200 micrones', 'm²', 180.00, 'Varios'),
    ((SELECT id FROM categories WHERE name = 'Instalación Eléctrica'), 'Cable 2.5mm²', 'Cable unipolar', 'm', 350.00, 'Prysmian'),
    ((SELECT id FROM categories WHERE name = 'Instalación Eléctrica'), 'Caja embutir', 'Caja rectangular para toma', 'unidad', 180.00, 'Cambre'),
    ((SELECT id FROM categories WHERE name = 'Instalación Sanitaria'), 'Caño PVC 110mm', 'Caño para desagüe', 'm', 1200.00, 'Tigre'),
    ((SELECT id FROM categories WHERE name = 'Aberturas'), 'Ventana aluminio 1.20x1.50', 'Ventana corrediza con DVH', 'unidad', 85000.00, 'Aluar'),
    ((SELECT id FROM categories WHERE name = 'Terminaciones'), 'Pintura látex interior', 'Balde 20 litros', 'unidad', 18000.00, 'Alba');

-- ==========================================
-- FIN DEL SCRIPT SQL
-- ==========================================

-- ✅ Si llegaste hasta aquí sin errores, ¡felicidades!
-- La base de datos está lista para usar.
