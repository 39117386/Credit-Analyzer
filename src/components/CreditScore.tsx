import React from 'react';
import { CreditData } from '../types/credit';
import { calcularScore, getRiesgo } from '../services/creditService';

interface CreditScoreProps {
  data: CreditData;
}

const CreditScore: React.FC<CreditScoreProps> = ({ data }) => {
  const score = calcularScore(data);
  const situaciones = data.periodos.flatMap(periodo => periodo.entidades.map(entidad => entidad.situacion));
  const peorSituacion = situaciones.length > 0 ? Math.max(...situaciones) : 0;
  const riesgo = getRiesgo(peorSituacion);

  // Normalizar score para la barra de progreso (0-100)
  const progressPercentage = ((score - 300) / (850 - 300)) * 100;

  // Colores Tailwind para el badge
  const badgeColors = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  };

  // Colores para la barra
  const barColors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Score Crediticio</h2>
      <div className="text-center mb-4">
        <p className="text-lg mb-2">{data.denominacion}</p>
        <span className="text-5xl font-bold text-white">{score}</span>
        <span className="text-xl text-gray-400"> / 850</span>
      </div>
      
      {/* Badge de riesgo */}
      <div className="flex justify-center mb-4">
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${badgeColors[riesgo.color as keyof typeof badgeColors]}`}>
          {riesgo.nivel}
        </span>
      </div>
      
      {/* Barra de progreso */}
      <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${barColors[riesgo.color as keyof typeof barColors]}`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="text-center text-sm text-gray-400">
        Basado en la peor situación: {peorSituacion || 'Sin deuda'}
      </div>
    </div>
  );
};

export default CreditScore;