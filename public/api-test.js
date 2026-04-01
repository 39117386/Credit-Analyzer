// Script de prueba para verificar la API del BCRA
// Ejecutar en la consola del navegador: copy(this) y pegar

const testAPI = async (cuit = '20123456789') => {
  console.log('🧪 Probando API del BCRA...');
  console.log('📡 URL:', `https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/${cuit}`);

  try {
    const response = await fetch(`https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/${cuit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('📊 Status:', response.status);
    console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error('❌ Error HTTP:', response.status, response.statusText);
      return;
    }

    const data = await response.json();
    console.log('📦 Respuesta completa:', data);

    // Analizar estructura
    if (data.results) {
      console.log('✅ Tiene wrapper "results"');
      console.log('📋 Denominación:', data.results.denominacion);
      console.log('📊 Periodos:', data.results.periodos?.length || 0);
    } else if (data.denominacion) {
      console.log('✅ Estructura directa');
      console.log('📋 Denominación:', data.denominacion);
      console.log('📊 Periodos:', data.periodos?.length || 0);
    } else {
      console.error('❌ Estructura desconocida');
    }

  } catch (error) {
    console.error('❌ Error de red:', error);
  }
};

// Función para probar diferentes CUITs
const testMultipleCuits = async () => {
  const cuits = ['20123456789', '27123456789', '30123456789'];

  for (const cuit of cuits) {
    console.log(`\n🔍 Probando CUIT: ${cuit}`);
    await testAPI(cuit);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
  }
};

// Exponer funciones globales
window.testAPI = testAPI;
window.testMultipleCuits = testMultipleCuits;

console.log('🎯 Funciones disponibles:');
console.log('  testAPI() - Probar API con CUIT por defecto');
console.log('  testAPI("27123456789") - Probar con CUIT específico');
console.log('  testMultipleCuits() - Probar múltiples CUITs');