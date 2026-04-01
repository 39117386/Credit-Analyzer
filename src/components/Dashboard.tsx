import React from 'react';
import { CreditData } from '../types/credit';
import CreditScore from './CreditScore';
import DeudaCard from './DeudaCard';
import CreditStatusMessage from './CreditStatusMessage';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface DashboardProps {
  data: CreditData | null;
  loading: boolean;
  error: string | null;
  viewMode?: 'full' | 'status-only';
}

const Dashboard: React.FC<DashboardProps> = ({
  data,
  loading,
  error,
  viewMode = 'full'
}) => {
  if (loading) {
    return <LoadingSpinner message="Cargando datos..." />;
  }

  if (error) {
    // Si el error indica que no hay deudas, mostrar mensaje verde
    if (error.includes('no registra') || error.includes('No se registran')) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="bg-green-100 border-2 border-green-500 text-green-800 px-6 py-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-2">✓ Sin Deuda</h2>
              <p className="text-lg font-semibold mb-4">{error}</p>
              <div className="bg-green-500 h-2 rounded-full w-full"></div>
              <p className="text-green-700 mt-4 text-sm">Score: 800/850</p>
            </div>
          </div>
        </div>
      );
    }

    return <ErrorMessage message={error} title="No se encontró información" />;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Bienvenido al Dashboard de Deudas BCRA</h2>
          <p className="text-gray-400">Ingresa un CUIT para consultar la información crediticia.</p>
        </div>
      </div>
    );
  }

  // Si el modo es solo estado, mostrar el mensaje simple
  if (viewMode === 'status-only') {
    return <CreditStatusMessage data={data} />;
  }

  // Modo completo del dashboard
  const allEntidades = data.periodos.flatMap(periodo => periodo.entidades);

  if (allEntidades.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-green-100 border-2 border-green-500 text-green-800 px-6 py-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-2">✓ Sin Deuda</h2>
            <p className="text-lg font-semibold mb-4">No se registran deudas a nombre de {data.denominacion}</p>
            <div className="bg-green-500 h-2 rounded-full w-full"></div>
            <p className="text-green-700 mt-4 text-sm">Score: 800/850</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CreditScore data={data} />
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Resumen</h2>
            <div className="space-y-2 text-gray-300">
              <p><strong>Denominación:</strong> {data.denominacion}</p>
              <p><strong>Total Entidades:</strong> {allEntidades.length}</p>
              <p><strong>Monto Total:</strong> ${allEntidades.reduce((sum, e) => sum + e.monto, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Detalle por Entidad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allEntidades.map((entidad, index) => (
              <DeudaCard key={index} entidad={entidad} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;