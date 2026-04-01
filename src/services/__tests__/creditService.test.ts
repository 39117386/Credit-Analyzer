import { calcularScore, getRiesgo, fetchDeudas, cleanCUIT, isValidCUIT } from '../services/creditService';
import { CreditData } from '../types/credit';

// Mock de fetch global
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('Credit Service', () => {
  describe('calcularScore', () => {
    it('debe calcular score correctamente', () => {
      const dataSinDeuda: CreditData = {
        denominacion: 'Juan Perez',
        periodos: [{ entidades: [{ entidad: 'Banco Nación', situacion: 1, monto: 0 }] }]
      };
      expect(calcularScore(dataSinDeuda)).toBe(800);

      const dataRiesgoMedio: CreditData = {
        denominacion: 'Maria Garcia',
        periodos: [{ entidades: [{ entidad: 'Santander', situacion: 2, monto: 50000 }] }]
      };
      expect(calcularScore(dataRiesgoMedio)).toBe(600);

      const dataAltoRiesgo: CreditData = {
        denominacion: 'Carlos Lopez',
        periodos: [{ entidades: [{ entidad: 'Banco Provincia', situacion: 4, monto: 100000 }] }]
      };
      expect(calcularScore(dataAltoRiesgo)).toBe(400);
    });
  });

  describe('getRiesgo', () => {
    it('debe retornar el nivel de riesgo correcto', () => {
      expect(getRiesgo(1)).toEqual({ nivel: 'SIN DEUDA', color: 'green' });
      expect(getRiesgo(2)).toEqual({ nivel: 'RIESGO MEDIO', color: 'yellow' });
      expect(getRiesgo(4)).toEqual({ nivel: 'ALTO RIESGO', color: 'red' });
    });
  });

  describe('fetchDeudas', () => {
    beforeEach(() => {
      mockFetch.mockClear();
    });

    it('debe funcionar con API exitosa', async () => {
      const mockResponse = {
        denominacion: 'Juan Perez',
        periodos: [{ entidades: [{ entidad: 'Banco Nación', situacion: 1, monto: 10000 }] }]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await fetchDeudas('20123456789');
      expect(result.denominacion).toBe('Juan Perez');
    });

    it('debe manejar 404 como sin deudas', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      } as Response);

      const result = await fetchDeudas('99999999999');
      expect(result.periodos).toEqual([]);
    });
  });

  describe('cleanCUIT', () => {
    it('debe limpiar CUIT correctamente', () => {
      expect(cleanCUIT('20-12345678-9')).toBe('20123456789');
      expect(cleanCUIT('20 12345678 9')).toBe('20123456789');
      expect(cleanCUIT('20-abc123def456ghi78-jkl9')).toBe('20123456789');
    });
  });

  describe('isValidCUIT', () => {
    it('debe validar CUIT correctamente', () => {
      expect(isValidCUIT('20123456789')).toBe(true);
      expect(isValidCUIT('20-12345678-9')).toBe(true);
      expect(isValidCUIT('2012345678')).toBe(false);
      expect(isValidCUIT('201234567890')).toBe(false);
    });
  });
});