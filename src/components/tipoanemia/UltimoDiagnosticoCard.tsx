import React, { useState, useEffect } from "react";
import axios from "axios";
import { config } from "@/lib/config";

interface UltimoDiagnosticoCardProps {
  pacienteId: string;
}

const UltimoDiagnosticoCard: React.FC<UltimoDiagnosticoCardProps> = ({
  pacienteId,
}) => {
  const [ultimoDiagnostico, setUltimoDiagnostico] = useState<any>(null);

  useEffect(() => {
    const fetchUltimoDiagnostico = async () => {
      try {
        const response = await axios.get(
          `${config.backendUrl}/diagnosticos/estadisticas/paciente/${pacienteId}`
        );
        const data = response.data;
        let nivelAnemia = "";
        let ultimo = null;

        if (data.anemia_severa.total > 0) {
          nivelAnemia = "Anemia Severa";
          ultimo = data.anemia_severa.diagnosticos.data[0];
        } else if (data.anemia_moderada.total > 0) {
          nivelAnemia = "Anemia Moderada";
          ultimo = data.anemia_moderada.diagnosticos.data[0];
        } else if (data.anemia_leve.total > 0) {
          nivelAnemia = "Anemia Leve";
          ultimo = data.anemia_leve.diagnosticos.data[0];
        } else if (data.normal.total > 0) {
          nivelAnemia = "Normal";
          ultimo = data.normal.diagnosticos.data[0];
        }

        if (ultimo) {
          setUltimoDiagnostico({
            nivelAnemia,
            fecha: ultimo.updated_at,
          });
        }
      } catch (error) {
        console.error("Error al obtener el último diagnóstico:", error);
      }
    };

    fetchUltimoDiagnostico();
  }, [pacienteId]);

  const tiempoTranscurrido = (fecha: string) => {
    const ahora = new Date();
    const fechaDiagnostico = new Date(fecha);
    const diferencia = ahora.getTime() - fechaDiagnostico.getTime();

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    if (dias > 0) return `Hace ${dias} días`;

    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    if (horas > 0) return `Hace ${horas} horas`;

    const minutos = Math.floor(diferencia / (1000 * 60));
    return `Hace ${minutos} minutos`;
  };

  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <div className="card mx-auto mt-6 max-w-sm rounded-lg bg-white p-4 shadow-lg">
      {ultimoDiagnostico ? (
        <>
          <h3 className="mb-2 text-xl font-semibold text-gray-800">
            Último Diagnóstico
          </h3>
          <p className="mb-2 text-gray-600">
            Nivel de Anemia:{" "}
            <span className="font-medium">{ultimoDiagnostico.nivelAnemia}</span>
          </p>
          <p className="text-sm text-gray-500">
            {tiempoTranscurrido(ultimoDiagnostico.fecha)}
          </p>
        </>
      ) : (
        <p className="text-gray-500">No hay diagnósticos disponibles.</p>
      )}
    </div>
  );
};

export default UltimoDiagnosticoCard;
