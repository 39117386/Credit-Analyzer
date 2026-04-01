import React from 'react';
import { Entidad } from '../types/credit';
import { getRiesgo } from '../services/creditService';

interface DeudaCardProps {
  entidad: Entidad;
}

const DeudaCard: React.FC<DeudaCardProps> = ({ entidad }) => {
  const riesgo = getRiesgo(entidad.situacion);

  const cardColors = {
    green: 'border-green-500 bg-green-50',
    yellow: 'border-yellow-500 bg-yellow-50',
    red: 'border-red-500 bg-red-50',
  };

  return (
    <div className={`p-4 rounded-2xl border-2 shadow-lg ${cardColors[riesgo.color as keyof typeof cardColors]}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{entidad.entidad}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          riesgo.color === 'green' ? 'bg-green-200 text-green-800' :
          riesgo.color === 'yellow' ? 'bg-yellow-200 text-yellow-800' :
          'bg-red-200 text-red-800'
        }`}>
          {riesgo.nivel}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Monto:</span>
        <span className="text-lg font-bold text-gray-800">${entidad.monto.toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-sm text-gray-600">Situación:</span>
        <span className="text-sm font-medium text-gray-700">{entidad.situacion}</span>
      </div>
    </div>
  );
};

export default DeudaCard;