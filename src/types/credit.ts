export interface Entidad {
  entidad: string;
  situacion: number;
  monto: number;
}

export interface Periodo {
  entidades: Entidad[];
}

export interface CreditData {
  denominacion: string;
  periodos: Periodo[];
}

export interface ApiResponse {
  results: CreditData;
}