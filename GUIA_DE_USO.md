# 🚀 GUÍA DE USO - Sistema Steel Framing Budget

## ✅ Estado Actual del Proyecto

El sistema está **listo para usar** con las siguientes funcionalidades implementadas:

### Páginas Implementadas:
- ✅ **Home** (`/`) - Página principal con accesos rápidos
- ✅ **Presupuesto Express** (`/express`) - Calculadora rápida
- ✅ **Proyectos** (`/projects`) - Listado de presupuestos
- ✅ **Catálogo** (`/catalog`) - Gestión de materiales y precios

---

## 📋 Configuración Inicial

### 1. Ejecutar SQL en Supabase

Debes ejecutar **DOS scripts** en orden:

#### Script 1: Base de datos principal
```
Archivo: supabase/EJECUTAR_ESTE_SQL.sql
```

En Supabase → SQL Editor:
1. Copia TODO el contenido del archivo
2. Pégalo y ejecuta (Run)
3. Verifica que no haya errores

#### Script 2: Fórmulas Express
```
Archivo: supabase/002_express_formulas.sql
```

En Supabase → SQL Editor:
1. Copia TODO el contenido del archivo
2. Pégalo y ejecuta (Run)
3. Esto creará las tablas de fórmulas y registrará cambios de precio

### 2. Variables de Entorno

Asegúrate de tener tu `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
```

### 3. Iniciar Aplicación

```bash
npm run dev
```

Abre: http://localhost:3000

---

## 🎯 Cómo Usar el Sistema

### Flujo Recomendado:

#### 1️⃣ **Configurar Catálogo de Materiales**

**Ruta**: `/catalog`

- El sistema ya tiene 14 materiales de ejemplo
- Puedes editar los precios clickeando en "Editar"
- Los cambios de precio se registran en el historial
- **Importante**: Los presupuestos antiguos mantienen sus precios originales

**Ejemplo**:
```
Material: Perfil C 100mm
Precio actual: $850
[Editar] → Nuevo precio: $900
[Guardar]
```

---

#### 2️⃣ **Crear Presupuesto Express**

**Ruta**: `/express`

**Pasos**:

1. **Configurar parámetros**:
   ```
   Metros cuadrados: 100
   Tipo de casa: 1 Planta
   Dormitorios: 3
   Baños: 2
   Calidad: Media
   ```

2. **Seleccionar opcionales**:
   - ☑ Instalación eléctrica completa
   - ☐ Otras opciones

3. **Datos del cliente**:
   ```
   Nombre: Juan López *obligatorio
   Email: cliente@mail.com
   Teléfono: +54 11 1234-5678
   Ubicación: Buenos Aires
   ```

4. **Revisar cálculo automático**:
   ```
   Costo de materiales: $3,200,000
   Margen de ganancia: 25% = $800,000
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PRECIO FINAL: $4,000,000
   (~$40,000/m²)
   ```

5. **Guardar**:
   - Click en "Guardar Presupuesto"
   - Se creará un proyecto con todos los items
   - **Los precios se congelan** al momento de guardar

---

#### 3️⃣ **Ver y Gestionar Proyectos**

**Ruta**: `/projects`

**Vista de lista**:
```
┌─────────────────────────────────────┐
│ Casa López - SF-2025-001            │
│ Cliente: Juan López                 │
│ Fecha: 05/11/2025                   │
│ Costo: $3,200,000                   │
│ Ganancia: 25% ($800,000)            │
│ Final: $4,000,000                   │
│ [Ver] [Eliminar]                    │
└─────────────────────────────────────┘
```

**Características**:
- Buscar por nombre, cliente o código
- Ver resumen de cada proyecto
- Estados: Borrador, En revisión, Aprobado, etc.
- Eliminar proyectos

---

## 🔑 Conceptos Clave

### 1. **Precios Históricos vs Actuales**

```
CATÁLOGO (precios ACTUALES)
    ↓
    Cambio de precio: $850 → $900
    ↓
PRESUPUESTO GUARDADO (mantiene $850)
```

**¿Por qué?**
- Los presupuestos reflejan el costo del momento
- Puedes actualizar precios sin afectar cotizaciones anteriores
- Integridad histórica garantizada

### 2. **Fórmulas Express**

El sistema calcula automáticamente según:
- **m² totales** × **cantidad por m²** = cantidad necesaria

Ejemplo:
```
100 m² × 0.8 perfiles por m² = 80 perfiles
80 perfiles × $850 = $68,000
```

### 3. **Cálculo de Totales**

```
Total items = SUMA(cantidad × precio_unitario)
Ganancia = Total × (margen% / 100)
Precio Final = Total + Ganancia
```

---

## 📊 Estructura de Datos

### Catálogo de Materiales
```typescript
{
  name: "Perfil C 100mm",
  unit_cost: 850,        // ← Se actualiza
  unit: "m",
  category: "Estructura"
}
```

### Presupuesto Guardado
```typescript
{
  project_name: "Casa López - 100m²",
  project_code: "SF-2025-001",
  total_cost: 3200000,
  profit_margin_percentage: 25,
  final_price: 4000000,
  budget_items: [
    {
      name: "Perfil C 100mm",
      quantity: 80,
      unit_cost: 850,      // ← CONGELADO
      total_cost: 68000
    }
  ]
}
```

---

## 🛠️ Personalización

### Agregar Nueva Fórmula Express

En Supabase SQL Editor:

```sql
INSERT INTO express_formulas (
  name, 
  description,
  category_id,
  material_catalog_id,
  quantity_per_m2,
  house_type,
  quality_level,
  is_optional
) VALUES (
  'Material Nuevo',
  'Descripción del uso',
  (SELECT id FROM categories WHERE name = 'Estructura'),
  (SELECT id FROM material_catalog WHERE name = 'Material X'),
  1.5,  -- 1.5 unidades por m²
  'todos',  -- o '1planta', '2plantas'
  'media',  -- o 'basica', 'premium'
  false  -- true si es opcional
);
```

### Cambiar Margen de Ganancia por Defecto

Edita `app/express/page.tsx`:

```typescript
const [profitMargin, setProfitMargin] = useState<number>(25)
                                                      // ↑ Cambia aquí
```

---

## ⚠️ Solución de Problemas

### Error: "No se encuentran materiales en el catálogo"
**Solución**: Ejecuta el script `002_express_formulas.sql`

### Error: "Cannot read property 'material'"
**Solución**: Verifica que los materiales del catálogo existan y estén activos

### Los cálculos no aparecen
**Solución**: 
1. Verifica que las fórmulas existan en la BD
2. Comprueba que `is_active = true`
3. Revisa que `house_type` y `quality_level` coincidan

### Error al guardar proyecto
**Solución**: 
1. Verifica que el nombre del cliente esté completo
2. Comprueba la conexión a Supabase
3. Revisa la consola del navegador para más detalles

---

## 🎯 Próximas Funcionalidades

### Pendientes de Implementar:

1. **Página de Detalle de Proyecto** (`/projects/[id]`)
   - Ver items del presupuesto
   - Editar items manualmente
   - Agregar/eliminar items
   - Cambiar estado del proyecto

2. **Plantillas** (`/templates`)
   - Crear plantillas desde proyectos
   - Aplicar plantilla a nuevo proyecto
   - Biblioteca de casas típicas

3. **Exportación**
   - PDF profesional del presupuesto
   - Excel con detalle de items
   - Envío por email

4. **Dashboard**
   - Estadísticas de proyectos
   - Gráficos de costos vs ganancias
   - Proyectos recientes

---

## 📝 Checklist de Inicio

Antes de usar el sistema, verifica:

- [ ] Ejecuté `EJECUTAR_ESTE_SQL.sql` en Supabase
- [ ] Ejecuté `002_express_formulas.sql` en Supabase
- [ ] Configuré `.env.local` con mis credenciales
- [ ] Ejecuté `npm install`
- [ ] Ejecuté `npm run dev`
- [ ] Puedo acceder a http://localhost:3000
- [ ] Veo materiales en `/catalog`
- [ ] Puedo calcular en `/express`

---

## 🚀 ¡Listo para Usar!

El sistema está funcional con:
- ✅ Catálogo de materiales editable
- ✅ Presupuesto Express con cálculo automático
- ✅ Gestión de proyectos guardados
- ✅ Precios históricos congelados
- ✅ Historial de cambios de precios

**¿Dudas?** Revisa los comentarios en el código o consulta los archivos:
- `CAMBIOS_SIN_AUTH.md` - Cambios de autenticación
- `RESUMEN_ELIMINACION_AUTH.md` - Resumen de cambios
- `README.md` - Documentación general

---

**Versión**: 0.3.0  
**Última actualización**: Noviembre 2025  
**Estado**: Funcional - Listo para producción personal
