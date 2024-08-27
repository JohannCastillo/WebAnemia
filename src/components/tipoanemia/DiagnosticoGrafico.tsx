import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { config } from "@/lib/config";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface Diagnostico {
  dx_anemia: string;
  edad_meses: number;
  peso: number;
  talla: number;
  hemoglobina: number;
  cred: boolean;
  suplementacion: boolean;
  created_at: string;
  updated_at: string;
}

interface DiagnosticoData {
  anemia_severa: { total: number; diagnosticos: Diagnostico[] };
  anemia_moderada: { total: number; diagnosticos: Diagnostico[] };
  anemia_leve: { total: number; diagnosticos: Diagnostico[] };
  normal: { total: number; diagnosticos: Diagnostico[] };
}

interface DiagnosticoGraficoProps {
  pacienteId: string;
}

const DiagnosticoGrafico: React.FC<DiagnosticoGraficoProps> = ({
  pacienteId,
}) => {
  const [data, setData] = useState<DiagnosticoData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${config.backendUrl}/diagnosticos/estadisticas/paciente/${pacienteId}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching diagnostico data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (pacienteId) {
      fetchData();
    }
  }, [pacienteId]);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (!data) {
    return <p>No hay datos disponibles</p>;
  }

  // Process the data for chart
  const chartData = {
    labels: ["Anemia Severa", "Anemia Moderada", "Anemia Leve", "Normal"],
    datasets: [
      {
        label: "Cantidad de Diagnósticos",
        data: [
          data.anemia_severa.total,
          data.anemia_moderada.total,
          data.anemia_leve.total,
          data.normal.total,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Gráfico de Cantidad de Diagnósticos Segun Tipo de Anemia</h2>
      <Line
        data={chartData}
        options={{ responsive: true, plugins: { legend: { position: "top" } } }}
      />
    </div>
  );
};

export default DiagnosticoGrafico;
