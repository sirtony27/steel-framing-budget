-- =============================================
-- SCRIPT: Fórmulas Express + Historial de Precios
-- =============================================
-- Ejecutar DESPUÉS de EJECUTAR_ESTE_SQL.sql
-- =============================================

-- =============================================
-- CREAR TABLAS
-- =============================================

-- Tabla para fórmulas de presupuesto express
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

-- =============================================
-- FUNCIÓN Y TRIGGER PARA HISTORIAL
-- =============================================

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

-- Eliminar trigger si existe y crearlo
DROP TRIGGER IF EXISTS trigger_log_price_change ON material_catalog;
CREATE TRIGGER trigger_log_price_change
    AFTER UPDATE ON material_catalog
    FOR EACH ROW
    EXECUTE FUNCTION log_price_change();

-- =============================================
-- LIMPIAR DATOS PREVIOS
-- =============================================
DELETE FROM express_formulas;

-- =============================================
-- INSERTAR FÓRMULAS
-- =============================================

-- NOTA IMPORTANTE:
-- Los PGC (montantes verticales) van cada 40cm
-- Cálculo: 1 metro / 0.4m = 2.5 montantes por metro lineal
-- Por m² de construcción: ~2.5 metros lineales de perfil

-- ====================================
-- ESTRUCTURA - 1 PLANTA - MEDIA
-- ====================================
INSERT INTO express_formulas (name, description, category_id, material_catalog_id, quantity_per_m2, house_type, quality_level, is_optional, "order")
VALUES
    ('Montantes verticales PGC', 'Perfiles C verticales cada 40cm', 
     (SELECT id FROM categories WHERE name = 'Estructura' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Perfil C 100%' LIMIT 1),
     2.5, '1planta', 'media', false, 1),
    
    ('Soleras horizontales PGU', 'Perfiles U superior e inferior',
     (SELECT id FROM categories WHERE name = 'Estructura' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Perfil U 100%' LIMIT 1),
     0.5, '1planta', 'media', false, 2),
    
    ('Tabiques divisorios', 'Perfiles para paredes internas',
     (SELECT id FROM categories WHERE name = 'Estructura' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Perfil C 70%' LIMIT 1),
     1.8, '1planta', 'media', false, 3);

-- ====================================
-- ESTRUCTURA - 2 PLANTAS - MEDIA
-- ====================================
INSERT INTO express_formulas (name, description, category_id, material_catalog_id, quantity_per_m2, house_type, quality_level, is_optional, "order")
VALUES
    ('Montantes PGC reforzados 2P', 'Perfiles C para 2 plantas', 
     (SELECT id FROM categories WHERE name = 'Estructura' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Perfil C 100%' LIMIT 1),
     3.2, '2plantas', 'media', false, 11),
    
    ('Soleras PGU 2 plantas', 'Perfiles U para 2 plantas',
     (SELECT id FROM categories WHERE name = 'Estructura' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Perfil U 100%' LIMIT 1),
     0.8, '2plantas', 'media', false, 12);

-- ====================================
-- CERRAMIENTOS - TODOS
-- ====================================
INSERT INTO express_formulas (name, description, category_id, material_catalog_id, quantity_per_m2, house_type, quality_level, is_optional, "order")
VALUES
    ('Placas interiores', 'Durlock/Yeso para interior',
     (SELECT id FROM categories WHERE name = 'Cerramientos' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Placa%Yeso%' LIMIT 1),
     2.2, 'todos', 'media', false, 21),
    
    ('Placas exteriores', 'OSB o cementicias exterior',
     (SELECT id FROM categories WHERE name = 'Cerramientos' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%OSB%' LIMIT 1),
     1.1, 'todos', 'media', false, 22);

-- ====================================
-- AISLACIÓN - TODOS
-- ====================================
INSERT INTO express_formulas (name, description, category_id, material_catalog_id, quantity_per_m2, house_type, quality_level, is_optional, "order")
VALUES
    ('Aislante térmico', 'Lana de vidrio o similar',
     (SELECT id FROM categories WHERE name = 'Aislación' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Lana%' LIMIT 1),
     1.1, 'todos', 'media', false, 31),
    
    ('Barrera de vapor', 'Film o membrana impermeable',
     (SELECT id FROM categories WHERE name = 'Aislación' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Barrera%' OR name LIKE '%Film%' LIMIT 1),
     1.1, 'todos', 'media', false, 32);

-- ====================================
-- FIJACIONES - TODOS
-- ====================================
INSERT INTO express_formulas (name, description, category_id, material_catalog_id, quantity_per_m2, house_type, quality_level, is_optional, "order")
VALUES
    ('Tornillos autoperforantes', 'Tornillos para estructura',
     (SELECT id FROM categories WHERE name = 'Fijaciones' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Tornillo%' LIMIT 1),
     0.05, 'todos', 'media', false, 41);

-- ====================================
-- OPCIONALES - INSTALACIONES
-- ====================================
INSERT INTO express_formulas (name, description, category_id, material_catalog_id, quantity_per_m2, house_type, quality_level, is_optional, "order")
VALUES
    ('Instalación eléctrica', 'Materiales eléctricos básicos',
     (SELECT id FROM categories WHERE name = 'Instalaciones' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Cable%' LIMIT 1),
     0.8, 'todos', 'media', true, 51),
    
    ('Canaletas para cables', 'Conductos para instalaciones',
     (SELECT id FROM categories WHERE name = 'Instalaciones' LIMIT 1),
     (SELECT id FROM material_catalog WHERE name LIKE '%Caño%' OR name LIKE '%Conducto%' LIMIT 1),
     0.4, 'todos', 'media', true, 52);

-- =============================================
-- VERIFICACIONES
-- =============================================

-- Contar fórmulas insertadas
SELECT 
    COUNT(*) as "Total Fórmulas",
    COUNT(CASE WHEN is_optional = true THEN 1 END) as "Opcionales",
    COUNT(CASE WHEN is_optional = false THEN 1 END) as "Obligatorias"
FROM express_formulas;

-- Ver fórmulas por categoría
SELECT 
    c.name as "Categoría",
    COUNT(ef.id) as "Cantidad"
FROM categories c
LEFT JOIN express_formulas ef ON ef.category_id = c.id
GROUP BY c.name
ORDER BY c.name;

-- Mostrar todas las fórmulas con detalles
SELECT 
    ef.name as "Fórmula",
    ef.quantity_per_m2 as "Cantidad/m²",
    ef.house_type as "Tipo Casa",
    ef.quality_level as "Calidad",
    CASE WHEN ef.is_optional THEN 'Sí' ELSE 'No' END as "Opcional",
    c.name as "Categoría",
    m.name as "Material"
FROM express_formulas ef
LEFT JOIN categories c ON ef.category_id = c.id
LEFT JOIN material_catalog m ON ef.material_catalog_id = m.id
ORDER BY ef."order";

-- =============================================
-- RESULTADO ESPERADO:
-- =============================================
-- Total Fórmulas: 13
-- Opcionales: 2
-- Obligatorias: 11
-- =============================================
