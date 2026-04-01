"use client";

import React, { useState } from 'react';
import { isValidCUIT } from '../services/creditService';

interface SearchFormProps {
  onSearch: (cuit: string) => void;
  loading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading }) => {
  const [cuit, setCuit] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cuit.trim()) {
      setError('Ingrese un CUIT');
      return;
    }

    if (!isValidCUIT(cuit)) {
      setError('El CUIT debe tener exactamente 11 dígitos');
      return;
    }

    onSearch(cuit.trim());
  };

  const handleCuitChange = (value: string) => {
    setCuit(value);
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-2xl shadow-xl mb-6">
      <h2 className="text-2xl font-bold text-white mb-4">Consultar Deudas BCRA</h2>
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={cuit}
            onChange={(e) => handleCuitChange(e.target.value)}
            placeholder="Ingrese CUIT (ej: 20123456789 o 20-12345678-9)"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={loading || !cuit.trim() || !isValidCUIT(cuit)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Consultando...' : 'Consultar'}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;