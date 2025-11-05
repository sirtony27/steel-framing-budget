# Sistema de Presupuestos para Steel Framing 🏗️

Sistema profesional para gestionar presupuestos de casas en steel framing con cálculo automático de costos, márgenes de ganancia y exportación de reportes.

**IMPORTANTE**: Sistema simplificado sin autenticación, diseñado para uso personal.

## 🚀 Tecnologías

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Estilos**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **UI Components**: Radix UI + shadcn/ui
- **Formularios**: React Hook Form + Zod
- **State Management**: Zustand
- **Gráficos**: Recharts

## 📋 Características

- ✅ Gestión de múltiples proyectos/presupuestos
- ✅ Plantillas de casas reutilizables
- ✅ Cálculo automático de costos y ganancias
- ✅ Catálogo de materiales y precios
- ✅ Organización por categorías (Estructura, Cerramientos, etc.)
- ✅ Exportación a PDF y Excel
- ✅ Historial de cambios
- ✅ **Sin autenticación** - Acceso directo

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

#### a) Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Guarda la **URL** y **anon key** del proyecto

#### b) Configurar variables de entorno

Crea/edita el archivo `.env.local` con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

#### c) Ejecutar migración de base de datos

1. Ve al panel de Supabase → **SQL Editor**
2. Crea un nuevo query
3. Copia todo el contenido del archivo `supabase/EJECUTAR_ESTE_SQL.sql`
4. Pégalo en el editor y ejecuta (Run)

Esto creará:
- Todas las tablas necesarias
- Funciones y triggers para cálculos automáticos
- Datos iniciales (categorías y materiales de ejemplo)
- **Sin Row Level Security** (acceso público)

### 3. Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
steel-framing-budget/
├── app/                          # Rutas de Next.js (App Router)
│   ├── projects/                 # Gestión de proyectos
│   ├── templates/                # Plantillas de casas
│   ├── catalog/                  # Catálogo de materiales
│   ├── settings/                 # Configuración
│   └── page.tsx                  # Página principal
├── components/
│   ├── ui/                       # Componentes base (Button, Input, etc.)
│   ├── projects/                 # Componentes de proyectos
│   ├── templates/                # Componentes de plantillas
│   └── shared/                   # Componentes compartidos
├── lib/
│   ├── supabase/                 # Configuración de Supabase
│   │   ├── client.ts             # Cliente para browser
│   │   └── server.ts             # Cliente para server
│   ├── types/                    # Tipos TypeScript
│   │   └── database.types.ts     # Tipos de la base de datos
│   ├── utils/                    # Utilidades
│   │   ├── calculations.ts       # Cálculos de presupuestos
│   │   ├── formatters.ts         # Formateo de moneda y números
│   │   └── validators.ts         # Validaciones con Zod
│   └── hooks/                    # React hooks personalizados
├── supabase/
│   └── EJECUTAR_ESTE_SQL.sql     # Script SQL completo
└── .env.local                    # Variables de entorno
```

## 🗄️ Base de Datos

### Tablas Principales

1. **categories** - Categorías de items (Estructura, Cerramientos, etc.)
2. **house_templates** - Plantillas de casas reutilizables
3. **projects** - Proyectos/presupuestos de clientes
4. **budget_items** - Items individuales de cada presupuesto
5. **material_catalog** - Catálogo de materiales y precios
6. **template_items** - Items predefinidos en plantillas
7. **project_history** - Historial de cambios

## 🔧 Próximos Pasos de Desarrollo

### Fase Actual: Implementación de Vistas
- [ ] Página de listado de proyectos
- [ ] Página de creación/edición de proyectos
- [ ] Página de catálogo de materiales
- [ ] Página de plantillas

### Siguientes Fases
- Dashboard con estadísticas
- Gestión completa de items del presupuesto
- Sistema de plantillas completo
- Exportación a PDF/Excel

## 📝 Scripts Disponibles

```bash
npm run dev          # Ejecutar en desarrollo
npm run build        # Construir para producción
npm start            # Ejecutar producción
npm run lint         # Linter
```

## ⚠️ Importante: Seguridad

Este sistema **NO tiene autenticación ni autorización**. Está diseñado para:
- Uso personal
- Redes privadas
- Entornos controlados

**NO usar en producción pública** sin implementar autenticación adecuada.

## 📚 Recursos

- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## 📄 Documentación Adicional

- `CAMBIOS_SIN_AUTH.md` - Detalles de la eliminación de autenticación
- `RESUMEN_IMPLEMENTACION.md` - Estado actual del proyecto
- `INSTRUCCIONES_SUPABASE.md` - Guía detallada de Supabase

---

**Versión**: 0.2.0 (Sin autenticación)  
**Desarrollado con ❤️ para profesionales del Steel Framing**
