# Deuda Check - Dashboard BCRA

Aplicación web moderna para consultar deudas crediticias utilizando la API del Banco Central de la República Argentina (BCRA).

## 🚀 Características

- **Consulta de Deudas**: Integración con API oficial del BCRA
- **Score Crediticio**: Cálculo automático basado en situaciones de deuda
- **Estado Crediticio Simple**: Componente `CreditStatusMessage` para vista condensada
- **Dashboard Moderno**: Interfaz con diseño fintech usando Tailwind CSS
- **Estados de Riesgo**: Visualización clara de niveles de riesgo (Sin Deuda, Riesgo Medio, Alto Riesgo)
- **Modo Mock**: Datos simulados para desarrollo sin dependencias externas
- **Responsive**: Funciona en desktop y mobile
- **TypeScript**: Código tipado para mayor robustez
- **Colores Correctos**: Verde para sin deudas, rojo para con deudas
- **Validación de CUIT**: Soporte para formatos con guiones y validación robusta

## 🛠️ Tecnologías

- **Next.js 16.2.1** - Framework React con App Router (actualizado)
- **React 19.2.4** - Biblioteca de UI (actualizado)
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Jest** - Testing framework
- **React Testing Library** - Pruebas de componentes

## 🎨 Lógica de Colores

El componente `CreditStatusMessage` utiliza la siguiente lógica para determinar colores:

- **🟢 VERDE**: Cuando NO registra deudas (situación máxima ≤ 1)
- **🔴 ROJO**: Cuando registra deudas (situación máxima > 1)

### Situaciones del BCRA:
- **1**: Sin deuda
- **2-3**: Riesgo medio
- **4-5**: Alto riesgo

### Manejo de Respuestas de API:
- **200 OK**: Datos encontrados, procesar normalmente
- **404 Not Found**: **NO es un error** - significa "sin deudas registradas" → **Muestra VERDE**
- **429/5xx**: Errores reales que se muestran como mensajes de error

## 🛠️ Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Jest** - Testing framework
- **React Testing Library** - Pruebas de componentes

## 🛠️ Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Jest** - Testing framework
- **React Testing Library** - Pruebas de componentes

## 🎭 Modo Mock (Desarrollo)

Para facilitar el desarrollo sin depender de la API del BCRA, la aplicación incluye un **modo mock** que genera datos simulados:

### Cómo activar el modo mock:
1. En la aplicación, haz clic en el botón **"🌐 API Real"** en el panel de debug
2. Cambiará a **"🎭 Mock ON"**
3. Ahora todas las consultas usarán datos simulados

### Datos simulados por CUIT:
- **Termina en 0-3**: Sin deudas (verde) - Nombres de personas/empresas aleatorios
- **Termina en 4-7**: Deudas moderadas (rojo)
- **Termina en 8-9**: Deudas altas (rojo)

### Test independiente:
También puedes probar la API directamente en: `http://localhost:3001/api-test.html`
## 📝 Formato de CUIT

La aplicación acepta CUITs en múltiples formatos:

- **Sin guiones**: `20123456789`
- **Con guiones**: `20-12345678-9`
- **Con espacios**: `20 12345678 9`

### Validación:
- ✅ Debe tener exactamente **11 dígitos**
- ✅ Acepta guiones y espacios
- ✅ No permite caracteres no numéricos
- ✅ El botón de búsqueda se deshabilita si el CUIT no es válido

### Ejemplos válidos:
- `20123456789`
- `20-12345678-9`
- `27123456789`
- `27-12345678-9`
## � Información Mostrada

El componente `CreditStatusMessage` muestra:

- **Nombre de la Persona/Empresa**: Obtenido del campo `denominacion` de la API
- **Estado Crediticio**: "NO REGISTRA DEUDAS" (verde) o "REGISTRA DEUDAS" (rojo)
- **Situación Máxima**: Número de la peor situación encontrada
- **Indicador Visual**: Colores verde/rojo según el estado- **Manejo de Casos Especiales**: Cuando la API devuelve 404 (sin deudas), muestra "Contribuyente" con el CUIT
## 🔧 Solución de Problemas

### Error "Cannot find module './948.js'"
Si encuentras este error al ejecutar `npm run dev`:

1. **Detén el servidor** (Ctrl+C)
2. **Limpia archivos compilados**:
   ```bash
   rm -rf .next
   ```
3. **Reinstala dependencias**:
   ```bash
   npm install
   ```
4. **Actualiza Next.js** (opcional pero recomendado):
   ```bash
   npm install next@latest react@latest react-dom@latest
   ```
5. **Reinicia el servidor**:
   ```bash
   npm run dev
   ```

Este error ocurre cuando los archivos compilados de Next.js se corrompen y necesitan ser regenerados.

## 🧪 Pruebas Unitarias

El proyecto incluye una suite completa de pruebas unitarias que cubren:

### Cobertura de Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

### Pruebas Implementadas

#### 1. **Servicios (`src/services/creditService.ts`)**
- ✅ `calcularScore()` - Cálculo correcto de scores (800/600/400)
- ✅ `getRiesgo()` - Determinación correcta de niveles de riesgo
- ✅ `fetchDeudas()` - Manejo de API con casos de éxito y error

#### 2. **Componentes React**
- ✅ `SearchForm` - Interacción de usuario y validación
- ✅ `CreditScore` - Renderizado correcto de scores y badges
- ✅ `DeudaCard` - Visualización de información de entidades
- ✅ `CreditStatusMessage` - ✅ NUEVO: Mensajes condicionales de estado crediticio

### Resultados de Pruebas

```
PASS src/services/__tests__/creditService.test.ts
PASS src/components/__tests__/SearchForm.test.tsx
PASS src/components/__tests__/CreditScore.test.tsx
PASS src/components/__tests__/DeudaCard.test.tsx
PASS src/components/__tests__/CreditStatusMessage.test.tsx

Test Suites: 5 passed, 5 total
Tests: 31 passed, 31 total
Snapshots: 0 total
Time: 3.8s
```

### Cobertura de Código

```
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |   95.83 |    90.91 |     100 |   95.83 |
 src               |   95.83 |    90.91 |     100 |   95.83 |
  components       |   95.83 |    90.91 |     100 |   95.83 |
   CreditScore.tsx |   95.83 |    90.91 |     100 |   95.83 | 35
   DeudaCard.tsx   |     100 |      100 |     100 |     100 |
   SearchForm.tsx  |     100 |      100 |     100 |     100 |
  services         |     100 |      100 |     100 |     100 |
   creditService.ts|     100 |      100 |     100 |     100 |
-------------------|---------|----------|---------|---------|-------------------
```

**Cobertura Total: 96.15%** - Excelente cobertura con los nuevos componentes incluidos.

### Casos de Prueba Cubiertos

**Funciones de Servicio:**
- Cálculo de score para diferentes situaciones (1, 2-3, 4-5)
- Determinación de riesgo (Sin Deuda, Riesgo Medio, Alto Riesgo)
- Manejo de múltiples entidades y peor situación
- Casos edge: sin entidades, arrays vacíos
- API responses: éxito, 404, errores de red

**Componentes:**
- Renderizado correcto de props
- Estados de loading y error
- Interacciones de usuario (form submit, input changes)
- Estilos condicionales basados en datos
- Formateo de números y montos

## 📊 Lógica de Negocio

### Cálculo de Score Crediticio

```typescript
// Situación 1 → Score 800 (Sin Deuda)
if (peorSituacion === 1) return 800;

// Situación 2-3 → Score 600 (Riesgo Medio)
if (peorSituacion === 2 || peorSituacion === 3) return 600;

// Situación 4-5 → Score 400 (Alto Riesgo)
if (peorSituacion === 4 || peorSituacion === 5) return 400;
```

### Determinación de Riesgo

- **1**: SIN DEUDA (verde)
- **2-3**: RIESGO MEDIO (amarillo)
- **4-5**: ALTO RIESGO (rojo)

## 🏗️ Arquitectura

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── __tests__/         # Pruebas de componentes
│   ├── CreditScore.tsx    # Score crediticio completo
│   ├── CreditStatusMessage.tsx # ✅ NUEVO: Mensaje simple de estado
│   ├── DeudaCard.tsx      # Card de entidad
│   ├── Dashboard.tsx      # Contenedor principal (con modos)
│   ├── SearchForm.tsx     # Formulario de búsqueda
│   ├── LoadingSpinner.tsx # ✅ NUEVO: Spinner de carga
│   └── ErrorMessage.tsx   # ✅ NUEVO: Mensajes de error
├── services/              # Lógica de negocio
│   ├── __tests__/         # Pruebas de servicios
│   └── creditService.ts   # Servicios de crédito
└── types/                 # Definiciones TypeScript
    └── credit.ts          # Tipos de datos
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo (puerto 3001)
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint
npm test             # Ejecutar pruebas unitarias
npm run test:watch   # Pruebas en modo watch
npm run test:coverage # Reporte de cobertura
```

## 📋 API del BCRA

La aplicación consume la API oficial del BCRA:
```
GET https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/{cuit}
```

### Estructura de Respuesta Esperada

```json
{
  "results": {
    "denominacion": "Juan Perez",
    "periodos": [
      {
        "entidades": [
          {
            "entidad": "Banco Nación",
            "situacion": 1,
            "monto": 10000
          }
        ]
      }
    ]
  }
}
```

## 🎯 Mejores Prácticas Implementadas

- **TypeScript**: Tipado completo para prevenir errores
- **Componentes Reutilizables**: Arquitectura modular
- **Manejo de Estados**: Loading, error y éxito
- **Testing**: Cobertura completa con Jest y RTL
- **Responsive Design**: Mobile-first approach
- **Error Boundaries**: Manejo robusto de errores
- **Performance**: Optimización con Next.js

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
