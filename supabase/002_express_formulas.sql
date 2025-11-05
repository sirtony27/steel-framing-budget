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
CREATE INDEX IF NOT EXISTS idx_express_formulas_category ON express_formulas(category_id);
CREATE INDEX IF NOT EXISTS idx_express_formulas_material ON express_formulas(material_catalog_id);
CREATE INDEX IF NOT EXISTS idx_express_formulas_active ON express_formulas(is_active);

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
CREATE INDEX IF NOT EXISTS idx_price_history_material ON price_history(material_catalog_id);

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

-- Eliminar trigger si existe
DROP TRIGGER IF EXISTS trigger_log_price_change ON material_catalog;

-- Crear trigger para registrar cambios
CREATE TRIGGER trigger_log_price_change
    AFTER UPDATE ON material_catalog
    FOR EACH ROW
    EXECUTE FUNCTION log_price_change();

-- =============================================
-- LIMPIAR DATOS PREVIOS
-- =============================================
DELETE FROM express_formulas;

-- =============================================
-- DATOS INICIALES - Fórmulas Express
-- =============================================

-- NOTA: Los PGC (montantes verticales) van cada 40cm
-- Por lo tanto: en 1 metro lineal = 2.5 montantes (1m / 0.4m = 2.5)
-- Para calcular por m²: necesitamos considerar altura promedio 2.4m
-- Montantes por m²: 2.5 montantes/m × 2.4m altura = 6 metros lineales / m²
-- PERO considerando que es por m² de piso: 1/0.4 = 2.5 montantes por metro de perímetro
-- Simplificando: ~2.5 metros lineales de PGC C por m² de construcción

-- Fórmulas para ESTRUCTURA - Calidad MEDIA
INSERT INTO express_formulas (name, description, category_id, material_catalog_id, quantity_per_m2, house_type, quality_level, "order") VALUES
    -- Montantes verticales (PGC cada 40cm)
    ('Montantes verticales PGC', 'Perfiles C verticales cada 40cm', 
     (SELECT id FROM categories WHERE name = 'Estructura' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Perfil C 100%' LIMIT 1),
     2.5, '1planta', 'media', 1),
    
    -- Soleras horizontales
    ('Soleras horizontales PGU', 'Perfiles U superior e inferior',
     (SELECT id FROM categories WHERE name = 'Estructura' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Perfil U 100%' LIMIT 1),
     0.5, '1planta', 'media', 2),
    
    -- Tabiques internos
    ('Tabiques divisorios', 'Perfiles para paredes internas',
     (SELECT id FROM categories WHERE name = 'Estructura' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Perfil C 70%' LIMIT 1),
     1.8, '1planta', 'media', 3);

-- Fórmulas para DOS PLANTAS
INSERT INTO express_formulas (name, description, category_id, material_catalog_id, quantity_per_m2, house_type, quality_level, "order") VALUES
    ('Montantes verticales PGC 2P', 'Perfiles C para 2 plantas', 
     (SELECT id FROM categories WHERE name = 'Estructura' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Perfil C 100%' LIMIT 1),
     3.2, '2plantas', 'media', 11),
    
    ('Soleras horizontales PGU 2P', 'Perfiles U para 2 plantas',
     (SELECT id FROM categories WHERE name = 'Estructura' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Perfil U 100%' LIMIT 1),
     0.8, '2plantas', 'media', 12);

-- Fórmulas para CERRAMIENTOS
INSERT INTO express_formulas (name, description, category_id, material_catalog_id, quantity_per_m2, house_type, quality_level, "order") VALUES
    ('Placas interiores', 'Durlock/Yeso para interior',
     (SELECT id FROM categories WHERE name = 'Cerramientos' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Placa%Yeso%' LIMIT 1),
     2.2, 'todos', 'media', 21),
    
    ('Placas exteriores', 'OSB o cementicias exterior',
     (SELECT id FROM categories WHERE name = 'Cerramientos' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%OSB%' LIMIT 1),
     1.1, 'todos', 'media', 22);

-- Fórmulas para AISLACIÓN
INSERT INTO express_formulas (name, description, category_id, material_catalog_id, quantity_per_m2, house_type, quality_level, "order") VALUES
    ('Aislante térmico', 'Lana de vidrio o similar',
     (SELECT id FROM categories WHERE name = 'Aislación' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Lana%' LIMIT 1),
     1.1, 'todos', 'media', 31),
    
    ('Barrera vapor', 'Film o membrana impermeable',
     (SELECT id FROM categories WHERE name = 'Aislación' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Barrera%' OR name LIKE '%Film%' LIMIT 1),
     1.1, 'todos', 'media', 32);

-- Fórmulas para FIJACIONES
INSERT INTO express_formulas (name, description, category_id, material_catalog_id, quantity_per_m2, house_type, quality_level, "order") VALUES
    ('Tornillos autoperforantes', 'Tornillos para estructura',
     (SELECT id FROM categories WHERE name = 'Fijaciones' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Tornillo%' LIMIT 1),
     0.05, 'todos', 'media', 41);

-- Fórmulas OPCIONALES
INSERT INTO express_formulas (name, description, category_id, material_catalog_id, quantity_per_m2, house_type, quality_level, is_optional, "order") VALUES
    ('Instalación eléctrica', 'Materiales eléctricos básicos',
     (SELECT id FROM categories WHERE name = 'Instalaciones' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Cable%' LIMIT 1),
     0.8, 'todos', 'media', true, 51),
    
    ('Canaletas para cables', 'Conductos para instalaciones',
     (SELECT id FROM categories WHERE name = 'Instalaciones' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Caño%' OR name LIKE '%Conducto%' LIMIT 1),
     0.4, 'todos', 'media', true, 52);

-- =============================================
-- VERIFICACIÓN
-- =============================================
-- Contar fórmulas insertadas
SELECT 
    COUNT(*) as total_formulas,
    COUNT(CASE WHEN is_optional = true THEN 1 END) as opcionales,
    COUNT(CASE WHEN is_optional = false THEN 1 END) as obligatorias
FROM express_formulas;

-- Ver fórmulas por categoría
SELECT 
    c.name as categoria,
    COUNT(ef.id) as cantidad_formulas
FROM categories c
LEFT JOIN express_formulas ef ON ef.category_id = c.id
GROUP BY c.name
ORDER BY c.name;

-- Mostrar todas las fórmulas creadas
SELECT 
    ef.name,
    ef.quantity_per_m2,
    ef.house_type,
    ef.quality_level,
    ef.is_optional,
    c.name as categoria,
    m.name as material
FROM express_formulas ef
LEFT JOIN categories c ON ef.category_id = c.id
LEFT JOIN material_catalog m ON ef.material_catalog_id = m.id
ORDER BY ef."order";

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
