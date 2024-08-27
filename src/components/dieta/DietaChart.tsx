import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Define la interfaz para la dieta
interface Paciente {
  id: number;
  codigo_cnv: string;
  dni: string;
  nombre: string;
  sexo: string;
  fecha_nacimiento: string;
  distrito: number;
}

interface Dieta {
  id: number;
  paciente: Paciente;
  frec_verduras: number;
  frec_carnes_rojas: number;
  frec_aves: number;
  frec_huevos: number;
  frec_pescado: number;
  frec_leche: number;
  frec_menestra: number;
  frec_bocados_dulc: number;
  frec_bebidas_az: number;
  frec_embutidos_consv: number;
  frec_fritura: number;
  frec_azucar: number;
  frec_desayuno: number;
  frec_almuerzo: number;
  frec_cena: number;
  frec_fruta: number;
  dx_dieta: number;
  created_at: string;
  updated_at: string;
}

// Define la interfaz para los datos que recibe el componente
interface HistorialGraficoProps {
  dietas: Dieta[];
}

// Registra los componentes de Chart.js que usarás
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const HistorialGrafico: React.FC<HistorialGraficoProps> = ({ dietas }) => {
  // // Verifica el tipo de datos y su contenido
  // const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  // const [fechaFin, setFechaFin] = useState<Date | null>(null);

  // const handleFechaChange = (fechaInicio: Date, fechaFin: Date) => {
  //   setFechaInicio(fechaInicio);
  //   setFechaFin(fechaFin);
  //   onFechaChange(fechaInicio, fechaFin); // Pasar fechas al abuelo
  // };

  if (!dietas || dietas.length === 0) {
    return <div>No hay datos a mostrar, en el rango de fechas indicado.</div>;
  }

  const data = dietas;

  const labels = data.map((d) => d.created_at.slice(0, 10)); // Fechas

  const chartData = {
    labels,
    datasets: [
      {
        label: "DX Dieta",
        data: data.map((d) => d.dx_dieta),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  return (
    <div className="bg-white p-4">
      <h2 className="font-medium text-lg mb-4">
        Resultados de probabilidad de Anemia:
      </h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          scales: {
            y: {
              title: {
                display: true,
                text: "Probabilidad de Anemia",
              },
              min: 0,
              max: 4,
              ticks: {
                callback: (value) => {
                  switch (value) {
                    case 1:
                      return "Baja";
                    case 2:
                      return "Media";
                    case 3:
                      return "Alta";
                    default:
                      return "";
                  }
                },
              },
            },
          },
          plugins: {
            legend: {
              position: "top" as const,
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `Probabilidad: ${tooltipItem.raw}`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default HistorialGrafico;
