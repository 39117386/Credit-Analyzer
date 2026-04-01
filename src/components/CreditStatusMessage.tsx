"use client";

import React from 'react';
import { CreditData } from '../types/credit';

interface CreditStatusMessageProps {
  data: CreditData;
}

const CreditStatusMessage: React.FC<CreditStatusMessageProps> = ({ data }) => {
  // Obtener todas las situaciones de todas las entidades en todos los periodos
  const allSituaciones = data.periodos.flatMap(periodo =>
    periodo.entidades.map(entidad => entidad.situacion)
  );

  // Si no hay situaciones, asumir que no hay deudas (situación 1)
  const peorSituacion = allSituaciones.length > 0 ? Math.max(...allSituaciones) : 1;

  // Determinar si tiene deudas (alguna situación > 1)
  const tieneDeudas = peorSituacion > 1;

  // Determinar el color basado en la situación
  const getColorClasses = (hasDebt: boolean) => {
    return hasDebt
      ? {
          text: 'text-red-400',
          bg: 'bg-red-900',
          border: 'border-red-500',
          textSecondary: 'text-red-200'
        }
      : {
          text: 'text-green-400',
          bg: 'bg-green-900',
          border: 'border-green-500',
          textSecondary: 'text-green-200'
        };
  };

  const colors = getColorClasses(tieneDeudas);

  // Determinar si es un placeholder de CUIT
  const isCuitPlaceholder = data.denominacion.startsWith('CUIT ');
  const displayName = isCuitPlaceholder ? 'Contribuyente' : data.denominacion;

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl text-center">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-2">Estado Crediticio</h2>
            <p className="text-gray-300 text-lg font-semibold">{displayName}</p>
            <p className="text-gray-400 text-sm">
              {isCuitPlaceholder ? `CUIT: ${data.denominacion.replace('CUIT ', '')}` : 'CUIT consultado'}
            </p>
          </div>

          <div className={`text-3xl font-bold mb-4 ${colors.text}`}>
            {tieneDeudas ? 'REGISTRA DEUDAS' : 'NO REGISTRA DEUDAS'}
          </div>

          <div className={`inline-block px-6 py-3 rounded-full text-lg font-semibold ${colors.bg} ${colors.textSecondary} border-2 ${colors.border}`}>
            {displayName} {tieneDeudas ? 'registra deudas' : 'no registra deudas'}
          </div>

          <div className="mt-4 text-sm text-gray-400">
            Situación máxima encontrada: {peorSituacion}
            {allSituaciones.length === 0 && ' (sin registros)'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditStatusMessage;