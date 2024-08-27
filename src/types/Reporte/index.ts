export type ReporteEvolucionMensual = {
  años: string[];
  meses: string[];
  reporte: {
    date: string;
    moderada: number;
    severa: number;
    leve: number;
    normal: number;
    pronostico: number;
    totalAnemia: number;
  }[]
}