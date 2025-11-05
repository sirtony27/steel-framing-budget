# 💵 CONFIGURACIÓN DE PRECIO POR M² EN USD

## ✨ Nueva Funcionalidad

Sistema de configuración para establecer el **precio por metro cuadrado en dólares (USD)** que el usuario cobra por sus proyectos.

---

## 🎯 Características

### 1. **Configuración Persistente**
- El precio por m² se guarda en la base de datos
- Se mantiene entre sesiones
- Fácil de actualizar en cualquier momento

### 2. **Interfaz Simple y Clara**
- Diseñada para personas mayores
- Elementos grandes y legibles
- Ejemplo de cálculo en tiempo real
- Botones claros y mensajes de confirmación

### 3. **Configuraciones Incluidas**
- 💵 **Precio por m² (USD)**: Lo que cobras por cada m² construido
- 📈 **Margen de ganancia (%)**: Tu porcentaje de ganancia sobre materiales
- 💱 **Moneda**: USD por defecto

---

## 📋 Archivos Nuevos Creados

### 1. **Script SQL**
```
📁 supabase/003_config_pricing.sql
```

**Crea**:
- Tabla `system_config` para configuraciones globales
- Valores por defecto (800 USD/m², 25% margen)
- Trigger para actualizar timestamp automáticamente

**Ejecutar DESPUÉS** de `002_express_formulas.sql`

---

### 2. **Componente React**
```
📁 components/PricingSettings.tsx
```

**Funcionalidad**:
- Lee configuración desde Supabase
- Permite modificar precio por m²
- Permite ajustar margen de ganancia
- Muestra ejemplo de cálculo en tiempo real
- Guarda cambios en la base de datos
- Mensajes de confirmación

---

### 3. **Página de Configuración**
```
📁 app/settings/page.tsx
```

**Contiene**:
- Botón "Volver al Inicio"
- Título y descripción
- Componente `PricingSettings`

---

### 4. **Actualización Home**
```
📁 app/page.tsx (modificado)
```

**Cambios**:
- Agregado link a "Configuración"
- Grid de 3 columnas (Catálogo, Plantillas, Configuración)
- Icono Settings con color verde

---

### 5. **Tipos TypeScript**
```
📁 lib/types/database.types.ts (modificado)
```

**Agregado**:
```typescript
export interface SystemConfig {
  id: string
  config_key: string
  config_value: string
  description: string | null
  updated_at: string
}
```

---

## 🗄️ Estructura de Base de Datos

### Tabla: `system_config`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | ID único |
| `config_key` | TEXT | Clave única (ej: 'price_per_m2_usd') |
| `config_value` | TEXT | Valor configurado |
| `description` | TEXT | Descripción de la configuración |
| `updated_at` | TIMESTAMP | Última actualización |

### Datos Iniciales:

```sql
price_per_m2_usd       → 800   (USD por m²)
profit_margin_percent  → 25    (% de ganancia)
currency_display       → USD   (Moneda)
```

---

## 🚀 Cómo Usar

### Paso 1: Ejecutar Script SQL

1. Abre Supabase SQL Editor
2. Ejecuta: `supabase/003_config_pricing.sql`
3. Verifica que se crearon 3 registros en `system_config`

### Paso 2: Acceder desde la App

1. Inicia la aplicación: `npm run dev`
2. Ve al home: `http://localhost:3000`
3. Click en **"Configuración"** (tercera opción)
4. Ajusta tu precio por m² en USD
5. Ajusta tu margen de ganancia
6. Click en **"Guardar Configuración"**

---

## 💡 Ejemplo de Uso

### Configuración:
```
Precio por m²: $800 USD
Margen de ganancia: 25%
```

### Para una casa de 100 m²:
```
Costo base:        100 m² × $800 = $80,000 USD
Margen (25%):                       $20,000 USD
Total a cobrar:                     $100,000 USD
```

### Para una casa de 150 m²:
```
Costo base:        150 m² × $800 = $120,000 USD
Margen (25%):                       $30,000 USD
Total a cobrar:                     $150,000 USD
```

---

## 🎨 Diseño de la Interfaz

### Elementos Grandes (Senior-Friendly):
- ✅ Inputs de 64px de altura
- ✅ Texto de 2xl (24px)
- ✅ Botones de 64px
- ✅ Iconos de 40px
- ✅ Ejemplo de cálculo visible
- ✅ Mensajes de confirmación grandes

### Colores:
- 🔵 Azul para la card principal
- 🟢 Verde para botón "Guardar"
- 🟡 Amarillo para nota importante
- ⚪ Blanco para el ejemplo de cálculo

---

## 🔗 Integración con Express

En futuras versiones, el **Presupuesto Express** usará automáticamente:
- El precio por m² configurado
- El margen de ganancia configurado
- Para calcular el total a cobrar

---

## 📊 Roadmap Futuro

### Fase 1 (Actual) ✅
- Configuración de precio por m² USD
- Configuración de margen de ganancia
- Persistencia en base de datos
- Interfaz amigable

### Fase 2 (Próxima)
- Integrar con cálculo de Express
- Mostrar precio total automático
- Comparación: costo materiales vs precio final
- Gráficos de rentabilidad

### Fase 3 (Futura)
- Múltiples tarifas por tipo de construcción
- Historial de precios por m²
- Cotización de dólar automática
- Conversión ARS ↔ USD

---

## 🛠️ Personalización

### Cambiar Valores por Defecto:

Edita en `003_config_pricing.sql`:

```sql
INSERT INTO system_config (config_key, config_value, description)
VALUES 
    ('price_per_m2_usd', '1000', 'Tu precio aquí'),  -- Cambia 800 por tu precio
    ('profit_margin_percent', '30', 'Tu margen aquí'), -- Cambia 25 por tu margen
    ...
```

### Agregar Nuevas Configuraciones:

```sql
INSERT INTO system_config (config_key, config_value, description)
VALUES 
    ('mi_nueva_config', 'valor', 'Descripción de la config');
```

---

## ✅ Verificación

### En Supabase:

```sql
-- Ver todas las configuraciones
SELECT * FROM system_config;

-- Ver solo precio por m²
SELECT config_value FROM system_config 
WHERE config_key = 'price_per_m2_usd';
```

### En la App:

1. Abre DevTools (F12)
2. Ve a la pestaña Console
3. Deberías ver: "Configuración guardada correctamente"

---

## 🔒 Seguridad

- ✅ Solo se puede editar desde la interfaz
- ✅ Validación de números positivos
- ✅ Timestamp de última actualización
- ✅ Historial de cambios (futuro)

---

## 📱 Responsive

La interfaz es completamente responsive:
- ✅ Desktop: 2 columnas
- ✅ Tablet: 1 columna
- ✅ Móvil: 1 columna con scroll

---

**Versión**: 0.6.0  
**Fecha**: 05/11/2025  
**Estado**: ✅ Configuración de precio USD implementada  
**Próximo paso**: Integrar con cálculo de presupuestos
