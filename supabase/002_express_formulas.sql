-- =============================================
-- SCRIPT ADICIONAL: Fórmulas Express
-- =============================================
-- Ejecutar DESPUÉS de EJECUTAR_ESTE_SQL.sql
-- =============================================

-- Crear tabla para fórmulas de presupuesto express
CREATE TABLE IF NOT EXISTS express_formulas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    material_catalog_id UUID REFERENCES material_catalog(id),
    quantity_per_m2 NUMERIC(10,4) NOT NULL,
    house_type TEXT CHECK (house_type IN ('1planta', '2plantas', 'todos')),
    quality_level TEXT CHECK (quality_level IN ('basica', 'media', 'premium', 'todos')),
    is_optional BOOLEAN DEFAULT false,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_express_formulas_category ON express_formulas(category_id);
CREATE INDEX idx_express_formulas_material ON express_formulas(material_catalog_id);
CREATE INDEX idx_express_formulas_active ON express_formulas(is_active);

-- Tabla para historial de precios
CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_catalog_id UUID REFERENCES material_catalog(id) ON DELETE CASCADE,
    old_price NUMERIC(15,2) NOT NULL,
    new_price NUMERIC(15,2) NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Índice
CREATE INDEX idx_price_history_material ON price_history(material_catalog_id);

-- Función para registrar cambios de precio
CREATE OR REPLACE FUNCTION log_price_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.unit_cost <> NEW.unit_cost THEN
        INSERT INTO price_history (material_catalog_id, old_price, new_price, notes)
        VALUES (NEW.id, OLD.unit_cost, NEW.unit_cost, 'Actualización manual');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para registrar cambios
CREATE TRIGGER trigger_log_price_change
    AFTER UPDATE ON material_catalog
    FOR EACH ROW
    EXECUTE FUNCTION log_price_change();

-- =============================================
-- DATOS INICIALES - Fórmulas Express
-- =============================================

-- Fórmulas para Estructura (1 planta, calidad media)
INSERT INTO express_formulas (name, description, category_id, material_catalog_id, quantity_per_m2, house_type, quality_level) VALUES
    ('Perfil C 100mm estructura', 'Montantes verticales', 
     (SELECT id FROM categories WHERE name = 'Estructura'),
     (SELECT id FROM material_catalog WHERE name = 'Perfil C 100mm x 0.9mm'),
     0.8, '1planta', 'media'),
    
    ('Perfil U 100mm estructura', 'Soleras superiores e inferiores',
     (SELECT id FROM categories WHERE name = 'Estructura'),
     (SELECT id FROM material_catalog WHERE name = 'Perfil U 100mm x 0.9mm'),
     0.6, '1planta', 'media'),
    
    ('Perfil C 70mm tabiques', 'Tabiques divisorios internos',
     (SELECT id FROM categories WHERE name = 'Estructura'),
     (SELECT id FROM material_catalog WHERE name = 'Perfil C 70mm x 0.9mm'),
     1.2, '1planta', 'media');

-- Fórmulas para Cerramientos
INSERT INTO express_formulas (name, description, category_id, material_catalog_id, quantity_per_m2, house_type, quality_level) VALUES
    ('Placa de Yeso interior', 'Placas para paredes interiores',
     (SELECT id FROM categories WHERE name = 'Cerramientos'),
     (SELECT id FROM material_catalog WHERE name = 'Placa de Yeso 12.5mm'),
     0.45, 'todos', 'media'),
    
    ('Placa OSB exterior', 'Placas estructurales exteriores',
     (SELECT id FROM categories WHERE name = 'Cerramientos'),
     (SELECT id FROM material_catalog WHERE name = 'Placa OSB 11mm'),
     0.35, 'todos', 'media');

-- Fórmulas para Aislación
INSERT INTO express_formulas (name, description, category_id, material_catalog_id, quantity_per_m2, house_type, quality_level) VALUES
    ('Lana de Vidrio 50mm', 'Aislación térmica estándar',
     (SELECT id FROM categories WHERE name = 'Aislación'),
     (SELECT id FROM material_catalog WHERE name = 'Lana de Vidrio 50mm'),
     1.0, 'todos', 'media'),
    
    ('Barrera de vapor', 'Barrera de humedad',
     (SELECT id FROM categories WHERE name = 'Aislación'),
     (SELECT id FROM material_catalog WHERE name = 'Barrera de vapor'),
     1.1, 'todos', 'media');

-- Fórmulas opcionales (instalaciones)
INSERT INTO express_formulas (name, description, category_id, material_catalog_id, quantity_per_m2, house_type, quality_level, is_optional) VALUES
    ('Cable eléctrico', 'Instalación eléctrica básica',
     (SELECT id FROM categories WHERE name = 'Instalación Eléctrica'),
     (SELECT id FROM material_catalog WHERE name = 'Cable 2.5mm²'),
     15.0, 'todos', 'media', true),
    
    ('Cajas eléctricas', 'Cajas para tomas y llaves',
     (SELECT id FROM categories WHERE name = 'Instalación Eléctrica'),
     (SELECT id FROM material_catalog WHERE name = 'Caja embutir'),
     0.15, 'todos', 'media', true);

-- =============================================
-- ✅ SCRIPT COMPLETADO
-- =============================================
