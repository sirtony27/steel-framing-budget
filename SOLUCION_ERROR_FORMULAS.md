# 🔧 SOLUCIÓN: Error al Cargar Fórmulas

## ❌ Problema

```
Error loading formulas: {}
```

Este error ocurre cuando la tabla `express_formulas` no existe o está vacía en Supabase.

---

## ✅ SOLUCIÓN PASO A PASO

### 1. **Verificar que ejecutaste el primer script**

Antes de ejecutar el script de fórmulas, **DEBES** haber ejecutado el script principal:

```
📁 supabase/EJECUTAR_ESTE_SQL.sql
```

Este script crea:
- Tablas: `categories`, `material_catalog`, `projects`, `budget_items`, etc.
- Datos de ejemplo: categorías y materiales

---

### 2. **Ejecutar el Script de Fórmulas ACTUALIZADO**

El script ha sido **corregido y mejorado**. Ahora incluye:

✅ PGC cada 40cm (cantidad correcta: 2.5 m/m²)  
✅ Cálculos para 1 y 2 plantas  
✅ Fórmulas obligatorias y opcionales  
✅ Validaciones y verificaciones  

#### **En Supabase:**

1. Ve a tu proyecto en Supabase
2. Click en **SQL Editor** (menú izquierdo)
3. Click en **New query**
4. Copia **TODO** el contenido de:
   ```
   📁 supabase/002_express_formulas.sql
   ```
5. Pega en el editor
6. Click en **RUN** o presiona `Ctrl + Enter`

#### **Resultado Esperado:**

Deberías ver al final:

```sql
-- Total de fórmulas
total_formulas | opcionales | obligatorias
     13        |     2      |     11

-- Fórmulas creadas
✅ Montantes verticales PGC
✅ Soleras horizontales PGU
✅ Tabiques divisorios
✅ Placas interiores
✅ Placas exteriores
✅ Aislante térmico
✅ Barrera vapor
✅ Tornillos autoperforantes
✅ (y más...)
```

---

### 3. **Verificar que se crearon las fórmulas**

En Supabase SQL Editor, ejecuta:

```sql
SELECT COUNT(*) as total FROM express_formulas;
```

**Resultado esperado**: `total = 13` (o más)

---

### 4. **Ver las fórmulas creadas**

```sql
SELECT 
    name,
    quantity_per_m2,
    house_type,
    quality_level,
    is_optional
FROM express_formulas
ORDER BY "order";
```

Deberías ver todas las fórmulas listadas.

---

### 5. **Refrescar la Aplicación**

1. Ve a tu navegador
2. Abre la consola de desarrollador (F12)
3. Refresca la página (F5)
4. Ve a: `http://localhost:3000/express`
5. Deberías ver la calculadora funcionando

---

## 📊 Fórmulas Incluidas (Actualizado)

### **ESTRUCTURA - 1 Planta**
```
Montantes PGC cada 40cm → 2.5 m/m²
Soleras PGU → 0.5 m/m²
Tabiques internos → 1.8 m/m²
```

### **ESTRUCTURA - 2 Plantas**
```
Montantes PGC → 3.2 m/m²
Soleras PGU → 0.8 m/m²
```

### **CERRAMIENTOS**
```
Placas interiores → 2.2 m²/m²
Placas exteriores → 1.1 m²/m²
```

### **AISLACIÓN**
```
Lana de vidrio → 1.1 m²/m²
Barrera vapor → 1.1 m²/m²
```

### **FIJACIONES**
```
Tornillos → 0.05 kg/m²
```

### **OPCIONALES**
```
Instalación eléctrica → 0.8 m/m²
Canaletas → 0.4 m/m²
```

---

## 🔍 Troubleshooting

### Error: "relation express_formulas does not exist"

**Causa**: No se ejecutó el script  
**Solución**: Ejecuta `002_express_formulas.sql`

---

### Error: "null value in column material_catalog_id"

**Causa**: No existen materiales en el catálogo  
**Solución**: 
1. Ejecuta primero `EJECUTAR_ESTE_SQL.sql`
2. Luego ejecuta `002_express_formulas.sql`

---

### Formulas cargadas: 0

**Causa**: Las fórmulas no se insertaron  
**Solución**: 
1. Verifica que los materiales existan:
   ```sql
   SELECT name FROM material_catalog LIMIT 5;
   ```
2. Si no hay materiales, ejecuta `EJECUTAR_ESTE_SQL.sql`
3. Luego ejecuta nuevamente `002_express_formulas.sql`

---

### Las cantidades no parecen correctas

**Actualizado**: Las cantidades ahora consideran:
- PGC cada 40cm (2.5 montantes por metro lineal)
- Altura estándar de 2.4m
- Doble cobertura de placas en interiores
- Pérdidas y desperdicio del 10%

---

## 📝 Orden de Ejecución CORRECTO

```
1️⃣ supabase/EJECUTAR_ESTE_SQL.sql
    ↓ (crea tablas y datos base)
    
2️⃣ supabase/002_express_formulas.sql
    ↓ (crea fórmulas y trigger de precios)
    
3️⃣ Refrescar aplicación
    ↓
    
4️⃣ ✅ ¡Funciona!
```

---

## 🎯 Verificación Final

Después de ejecutar ambos scripts, verifica:

```sql
-- 1. Categorías creadas
SELECT COUNT(*) FROM categories; 
-- Resultado: 5+

-- 2. Materiales creados
SELECT COUNT(*) FROM material_catalog;
-- Resultado: 14+

-- 3. Fórmulas creadas
SELECT COUNT(*) FROM express_formulas;
-- Resultado: 13+

-- 4. Todo conectado correctamente
SELECT 
    ef.name,
    m.name as material,
    c.name as categoria
FROM express_formulas ef
JOIN material_catalog m ON ef.material_catalog_id = m.id
JOIN categories c ON ef.category_id = c.id
LIMIT 5;
-- Resultado: 5 filas con datos completos
```

---

## 💡 Mejora Implementada

El script ahora incluye:
- ✅ `IF NOT EXISTS` para evitar errores de duplicados
- ✅ `DROP TRIGGER IF EXISTS` para recrear triggers
- ✅ `DELETE FROM express_formulas` para limpiar datos antiguos
- ✅ Queries de verificación al final
- ✅ Cantidades corregidas según estándar argentino
- ✅ Comentarios explicativos en el código

---

## 🆘 Si Nada Funciona

1. **Borra las tablas manualmente**:
   ```sql
   DROP TABLE IF EXISTS express_formulas CASCADE;
   DROP TABLE IF EXISTS price_history CASCADE;
   ```

2. **Ejecuta el script completo nuevamente**

3. **Si persiste el error**, verifica en Supabase Dashboard:
   - Table Editor → express_formulas
   - Deberías ver las 13 filas creadas

---

**Última actualización**: 05/11/2025  
**Versión script**: 2.0 (con PGC cada 40cm)  
**Estado**: ✅ Corregido y verificado
