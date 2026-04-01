import { useState, useEffect } from 'react';
import { setMockMode, getMockMode } from '../services/creditService';

export function useMockMode() {
  const [useMock, setUseMock] = useState(() => {
    // Leer del localStorage al inicializar el estado
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('deuda-check-mock-mode');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        // Sincronizar con el servicio inmediatamente
        setMockMode(parsed);
        return parsed;
      }
    }
    // Si no hay valor guardado, usar el estado inicial del servicio
    const currentMode = getMockMode();
    return currentMode;
  });

  useEffect(() => {
    // Asegurar sincronización después del montaje
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('deuda-check-mock-mode');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (parsed !== useMock) {
          setUseMock(parsed);
          setMockMode(parsed);
        }
      }
    }
  }, []);

  const toggleMock = () => {
    const newValue = !useMock;
    setUseMock(newValue);
    setMockMode(newValue); // Actualizar el servicio
    if (typeof window !== 'undefined') {
      localStorage.setItem('deuda-check-mock-mode', JSON.stringify(newValue));
    }
    console.log(`🎭 Modo mock toggled to: ${newValue}`);
  };

  return { useMock, toggleMock };
}