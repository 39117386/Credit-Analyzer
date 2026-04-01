"use client";

import React, { useState } from 'react';
import SearchForm from '../components/SearchForm';
import Dashboard from '../components/Dashboard';
import { CreditData } from '../types/credit';
import { fetchDeudas, getMockMode } from '../services/creditService';
import { useMockMode } from '../hooks/useMockMode';

export default function Home() {
  const [data, setData] = useState<CreditData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'full' | 'status-only'>('full');
  const [debugInfo, setDebugInfo] = useState(() => {
    // Mostrar estado inicial del modo mock
    const initialMockState = getMockMode();
    return `🎭 Estado inicial - Modo mock: ${initialMockState ? 'ACTIVADO' : 'DESACTIVADO'}`;
  });
  const { useMock, toggleMock } = useMockMode();

  const handleSearch = async (cuit: string) => {
    console.log('🔍 handleSearch called with CUIT:', cuit);
    setLoading(true);
    setError(null);
    setData(null);
    setDebugInfo(`🔍 Iniciando búsqueda para CUIT: ${cuit}`);

    try {
      console.log('🚀 Llamando a fetchDeudas...');
      const result = await fetchDeudas(cuit);
      console.log('✅ fetchDeudas returned:', result);
      setData(result);
      setDebugInfo(`✅ Consulta exitosa - ${result.denominacion} (${result.periodos.length} periodos)`);
    } catch (err) {
      console.error('❌ Error en handleSearch:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setDebugInfo(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const testAPIConnection = async () => {
    setDebugInfo('🔍 Probando conexión a la API...');
    try {
      const response = await fetch('https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/20123456789', {
        method: 'HEAD', // Solo headers, no body
        signal: AbortSignal.timeout(5000),
      });
      setDebugInfo(`✅ API responde - Status: ${response.status}`);
    } catch (err) {
      setDebugInfo(`❌ Error de conexión: ${err instanceof Error ? err.message : 'Desconocido'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <SearchForm onSearch={handleSearch} loading={loading} />

        {/* Debug Panel */}
        <div className="bg-gray-800 p-4 rounded-2xl mb-6">
          <div className="flex gap-4 items-center mb-2">
            <h3 className="text-white font-semibold">🔧 Debug Panel</h3>
            <button
              onClick={testAPIConnection}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Test API
            </button>
            <button
              onClick={toggleMock}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                useMock
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {useMock ? '🎭 Mock ON' : '🌐 API Real'}
            </button>
          </div>
          {debugInfo && (
            <div className="text-sm font-mono bg-gray-700 p-2 rounded text-gray-300">
              {debugInfo}
            </div>
          )}
        </div>

        {/* Selector de vista */}
        {data && !loading && (
          <div className="flex justify-center mb-6">
            <div className="bg-gray-800 p-2 rounded-lg">
              <button
                onClick={() => setViewMode('full')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'full'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Dashboard Completo
              </button>
              <button
                onClick={() => setViewMode('status-only')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'status-only'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Solo Estado
              </button>
            </div>
          </div>
        )}

        <Dashboard
          data={data}
          loading={loading}
          error={error}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}
