import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { config } from "@/lib/config";

// Configuración de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const NivelAnemiaChart = ({ pacienteId, nivelAnemia } : { pacienteId : number, nivelAnemia : string }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Hemoglobina",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Peso",
        data: [],
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
      },
      {
        label: "Estatura",
        data: [],
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${config.backendUrl}/diagnosticos/estadisticas/paciente/${pacienteId}`
        );

        const data = response.data[nivelAnemia].diagnosticos.data;

        const labels = data.map((diagnostico) =>
          new Date(diagnostico.created_at).toLocaleDateString()
        );
        const hemoglobina = data.map((diagnostico) => diagnostico.hemoglobina);
        const peso = data.map((diagnostico) => diagnostico.peso);
        const estatura = data.map((diagnostico) => diagnostico.talla);

        setChartData({
          labels,
          datasets: [
            {
              label: "Hemoglobina",
              data: hemoglobina,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
            {
              label: "Peso",
              data: peso,
              borderColor: "rgba(153, 102, 255, 1)",
              backgroundColor: "rgba(153, 102, 255, 0.2)",
            },
            {
              label: "Estatura",
              data: estatura,
              borderColor: "rgba(255, 159, 64, 1)",
              backgroundColor: "rgba(255, 159, 64, 0.2)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (pacienteId && nivelAnemia) {
      fetchData();
    }
  }, [pacienteId, nivelAnemia]);

  return (
    <div>
      <h2>Datos del Nivel de Anemia: {nivelAnemia}</h2>
      <Line data={chartData} />
    </div>
  );
};

export default NivelAnemiaChart;
