-- ========================================
-- SCRIPT DE MIGRACIÓN: ELIMINAR AUTENTICACIÓN
-- ========================================
-- Ejecuta este script si YA habías ejecutado el SQL anterior
-- con autenticación y quieres actualizarlo para eliminarla
-- ========================================

-- 1. DESHABILITAR RLS en todas las tablas
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE house_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE material_catalog DISABLE ROW LEVEL SECURITY;
ALTER TABLE template_items DISABLE ROW LEVEL SECURITY;

-- 2. ELIMINAR TODAS LAS POLÍTICAS
-- Políticas de projects
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- Políticas de budget_items
DROP POLICY IF EXISTS "Users can view budget items of own projects" ON budget_items;
DROP POLICY IF EXISTS "Users can insert budget items of own projects" ON budget_items;
DROP POLICY IF EXISTS "Users can update budget items of own projects" ON budget_items;
DROP POLICY IF EXISTS "Users can delete budget items of own projects" ON budget_items;

-- Políticas de house_templates
DROP POLICY IF EXISTS "Anyone can view active templates" ON house_templates;
DROP POLICY IF EXISTS "Users can insert own templates" ON house_templates;
DROP POLICY IF EXISTS "Users can update own templates" ON house_templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON house_templates;

-- Políticas de project_history
DROP POLICY IF EXISTS "Users can view history of own projects" ON project_history;

-- Políticas de categories y material_catalog
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Anyone can view active materials" ON material_catalog;

-- 3. ELIMINAR COLUMNAS DE USUARIO
ALTER TABLE projects DROP COLUMN IF EXISTS owner_id;
ALTER TABLE house_templates DROP COLUMN IF EXISTS created_by;
ALTER TABLE project_history DROP COLUMN IF EXISTS user_id;

-- 4. ELIMINAR ÍNDICES RELACIONADOS CON USUARIOS
DROP INDEX IF EXISTS idx_projects_owner;

-- ========================================
-- ✅ MIGRACIÓN COMPLETADA
-- ========================================
-- Tu base de datos ahora es de acceso público
-- sin autenticación ni autorización
-- ========================================
