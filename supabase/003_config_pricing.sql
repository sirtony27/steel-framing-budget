-- =============================================
-- SCRIPT: Configuración de Precios por m²
-- =============================================
-- Ejecutar DESPUÉS de 002_express_formulas.sql
-- =============================================

-- Tabla para configuración global
CREATE TABLE IF NOT EXISTS system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key TEXT UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_system_config_key ON system_config(config_key);

-- Insertar valores por defecto
INSERT INTO system_config (config_key, config_value, description)
VALUES 
    ('price_per_m2_usd', '800', 'Precio base por metro cuadrado en dólares (USD)'),
    ('profit_margin_percent', '25', 'Margen de ganancia por defecto (%)'),
    ('currency_display', 'USD', 'Moneda de visualización')
ON CONFLICT (config_key) DO NOTHING;

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_system_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar timestamp
DROP TRIGGER IF EXISTS trigger_update_system_config ON system_config;
CREATE TRIGGER trigger_update_system_config
    BEFORE UPDATE ON system_config
    FOR EACH ROW
    EXECUTE FUNCTION update_system_config_timestamp();

-- Verificar datos
SELECT 
    config_key as "Configuración",
    config_value as "Valor",
    description as "Descripción"
FROM system_config
ORDER BY config_key;

-- =============================================
-- RESULTADO ESPERADO:
-- =============================================
-- price_per_m2_usd       | 800  | Precio base por metro cuadrado en dólares
-- profit_margin_percent  | 25   | Margen de ganancia por defecto (%)
-- currency_display       | USD  | Moneda de visualización
-- =============================================
