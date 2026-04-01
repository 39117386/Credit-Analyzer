import { CreditData } from '../types/credit';

export function calcularScore(data: CreditData): number {
  // Encontrar la peor situación (mayor número)
  const situaciones = data.periodos.flatMap(periodo => periodo.entidades.map(entidad => entidad.situacion));
  const peorSituacion = Math.max(...situaciones, 0); // Si no hay situaciones, 0

  // Calcular score basado en la peor situación
  if (peorSituacion === 1) {
    return 800;
  } else if (peorSituacion === 2 || peorSituacion === 3) {
    return 600;
  } else if (peorSituacion === 4 || peorSituacion === 5) {
    return 400;
  } else {
    return 800; // Sin deuda
  }
}

export function getRiesgo(situacion: number): { nivel: string; color: string } {
  if (situacion === 1) {
    return { nivel: 'SIN DEUDA', color: 'green' };
  } else if (situacion === 2 || situacion === 3) {
    return { nivel: 'RIESGO MEDIO', color: 'yellow' };
  } else {
    return { nivel: 'ALTO RIESGO', color: 'red' };
  }
}

// Función mock para desarrollo cuando la API real no funciona
export function fetchDeudasMock(cuit: string): Promise<CreditData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simular diferentes escenarios basado en el CUIT
      const lastDigit = parseInt(cuit.slice(-1));

      let mockData: CreditData;

      // Nombres más realistas
      const nombres = [
        'Juan Carlos Pérez',
        'María González',
        'Carlos Rodríguez',
        'Ana Martínez',
        'Luis López',
        'Carmen Sánchez',
        'José García',
        'Isabel Fernández',
        'Francisco Díaz',
        'Teresa Moreno'
      ];

      const empresas = [
        'Tech Solutions SRL',
        'Comercial del Sur SA',
        'Industria Argentina Ltda',
        'Servicios Integrales S.A.',
        'Distribuidora Norte SRL'
      ];

      const nombreAleatorio = nombres[Math.floor(Math.random() * nombres.length)];
      const empresaAleatoria = empresas[Math.floor(Math.random() * empresas.length)];

      if (lastDigit <= 3) {
        // Sin deudas - devolver datos vacíos o con situación 1
        mockData = {
          denominacion: lastDigit <= 1 ? nombreAleatorio : empresaAleatoria,
          periodos: [
            {
              entidades: [
                { entidad: 'Banco Nación', situacion: 1, monto: 0 }
              ]
            }
          ]
        };
      } else if (lastDigit <= 7) {
        // Con deudas moderadas
        mockData = {
          denominacion: lastDigit <= 5 ? nombreAleatorio : empresaAleatoria,
          periodos: [
            {
              entidades: [
                { entidad: 'Banco Nación', situacion: 1, monto: 10000 },
                { entidad: 'Santander', situacion: 3, monto: 50000 },
                { entidad: 'BBVA', situacion: 2, monto: 25000 }
              ]
            }
          ]
        };
      } else {
        // Con deudas altas
        mockData = {
          denominacion: lastDigit <= 8 ? nombreAleatorio : empresaAleatoria,
          periodos: [
            {
              entidades: [
                { entidad: 'Banco Provincia', situacion: 4, monto: 100000 },
                { entidad: 'ICBC', situacion: 5, monto: 75000 }
              ]
            }
          ]
        };
      }

      console.log('🎭 Usando datos mock:', mockData);
      resolve(mockData);
    }, 1500); // Simular delay de red
  });
}

// Estado global para modo mock - DESACTIVADO por defecto
let globalUseMockData = false;

export function setMockMode(enabled: boolean) {
  globalUseMockData = enabled;
  console.log(`🎭 Modo mock ${enabled ? 'activado' : 'desactivado'} - Estado global: ${globalUseMockData}`);
}

export function getMockMode(): boolean {
  console.log(`🎭 Consultando modo mock - Estado global: ${globalUseMockData}`);
  return globalUseMockData;
}

// Función para limpiar el CUIT (quitar guiones, espacios y caracteres no numéricos)
export function cleanCUIT(cuit: string): string {
  return cuit.replace(/[^0-9]/g, '');
}

// Función para validar CUIT (debe tener exactamente 11 dígitos)
export function isValidCUIT(cuit: string): boolean {
  const cleaned = cleanCUIT(cuit);
  return cleaned.length === 11 && /^\d{11}$/.test(cleaned);
}

export async function fetchDeudas(cuit: string): Promise<CreditData> {
  console.log('🚀 fetchDeudas called with CUIT:', cuit);

  // Limpiar el CUIT antes de procesar
  const cleanedCUIT = cleanCUIT(cuit);
  console.log('🧹 CUIT cleaned:', cleanedCUIT);

  // Verificar si está en modo mock
  const isMockMode = getMockMode();
  console.log('🎭 Mock mode check:', isMockMode);

  // Si está en modo mock, usar datos simulados
  if (isMockMode) {
    console.log('🎭 MODO MOCK ACTIVADO - Usando datos simulados para CUIT:', cleanedCUIT);
    return fetchDeudasMock(cleanedCUIT);
  }

  console.log('🌐 MODO API REAL - Consultando API del BCRA');
  try {
    console.log('🔍 Consultando API del BCRA para CUIT:', cleanedCUIT);
    console.log('📡 URL:', `https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/${cleanedCUIT}`);

    const response = await fetch(`https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/${cleanedCUIT}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Agregar timeout
      signal: AbortSignal.timeout(10000), // 10 segundos timeout
    });

    console.log('📊 Status de respuesta:', response.status);
    console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      if (response.status === 404) {
        // 404 significa que no hay deudas registradas - esto es un caso exitoso
        console.log('✅ No se encontraron deudas registradas para este CUIT (404) - Caso exitoso');

        // Intentar obtener algún dato de la respuesta de error
        let denominacion = `CUIT ${cleanedCUIT}`;
        try {
          const errorData = await response.json();
          if (errorData.denominacion) {
            denominacion = errorData.denominacion;
          }
        } catch (e) {
          // Si no hay datos en la respuesta de error, usar placeholder
          console.log('ℹ️ No se pudo obtener denominación del error 404, usando placeholder');
        }

        return {
          denominacion: denominacion,
          periodos: [] // Sin periodos = sin deudas
        };
      }
      if (response.status === 429) {
        throw new Error('Demasiadas consultas. Intente nuevamente en unos minutos');
      }
      if (response.status >= 500) {
        throw new Error('Error del servidor. Intente nuevamente más tarde');
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 Datos recibidos:', data);

    // Verificar diferentes estructuras posibles
    let creditData: CreditData;

    if (data.results) {
      // Estructura con wrapper results
      creditData = data.results;
      console.log('✅ Usando estructura data.results');
    } else if (data.denominacion && data.periodos) {
      // Estructura directa
      creditData = data;
      console.log('✅ Usando estructura directa');
    } else {
      console.error('❌ Estructura de datos inesperada:', data);
      throw new Error('La respuesta de la API no tiene el formato esperado');
    }

    // Validar que tenga la estructura mínima
    if (!creditData.denominacion) {
      throw new Error('No se pudo obtener la denominación del contribuyente');
    }

    if (!creditData.periodos || !Array.isArray(creditData.periodos)) {
      console.log('⚠️ No hay periodos o periodos no es array, asumiendo sin deudas');
      creditData.periodos = [];
    }

    console.log('✅ Datos procesados correctamente:', {
      denominacion: creditData.denominacion,
      periodosCount: creditData.periodos.length,
      totalEntidades: creditData.periodos.reduce((sum, p) => sum + p.entidades.length, 0)
    });

    return creditData;

  } catch (error) {
    console.error('❌ Error en fetchDeudas:', error);

    if (error instanceof Error) {
      // Re-throw con mensaje más específico
      if (error.name === 'TimeoutError') {
        throw new Error('La consulta tardó demasiado tiempo. Verifique su conexión a internet');
      }
      if (error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con la API del BCRA. Verifique su conexión a internet');
      }
      throw error;
    }

    throw new Error('Error desconocido al consultar la API');
  }
}