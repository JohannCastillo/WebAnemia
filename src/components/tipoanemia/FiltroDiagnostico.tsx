// FiltroDiagnostico.tsx

import React, { useEffect, useState } from "react";
import { Select, Spin, Card, Table } from "antd";
import axios from "axios";
import { config } from "@/lib/config";

const url = config.backendUrl;
const { Option } = Select;

const FiltroDiagnostico: React.FC<{
  pacienteId: string;
  nivelAnemia: string | null;
  onDataChange: (data: any[]) => void;
}> = ({ pacienteId, nivelAnemia, onDataChange }) => {
  const [nivelesAnemia, setNivelesAnemia] = useState<any[]>([]);
  const [diagnosticos, setDiagnosticos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchNivelesAnemia = async () => {
      try {
        const response = await axios.get(`${url}/niveles-anemia`);
        setNivelesAnemia(response.data);
      } catch (error) {
        console.error("Error fetching niveles de anemia:", error);
      }
    };

    fetchNivelesAnemia();
  }, []);

  useEffect(() => {
    if (pacienteId && nivelAnemia) {
      const fetchDiagnosticos = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${url}/diagnosticos/estadisticas/paciente/${pacienteId}`);
          console.log("Diagnosticos fetched:", response.data);

          const { anemia_severa, anemia_moderada, anemia_leve, normal } = response.data;
          let filteredDiagnosticos = [];

          switch (nivelAnemia) {
            case "anemia_severa":
              filteredDiagnosticos = anemia_severa.diagnosticos.data;
              break;
            case "anemia_moderada":
              filteredDiagnosticos = anemia_moderada.diagnosticos.data;
              break;
            case "anemia_leve":
              filteredDiagnosticos = anemia_leve.diagnosticos.data;
              break;
            case "normal":
              filteredDiagnosticos = normal.diagnosticos.data;
              break;
            default:
              filteredDiagnosticos = [];
          }

          setDiagnosticos(filteredDiagnosticos);
          onDataChange(filteredDiagnosticos);
        } catch (error) {
          console.error("Error fetching diagnosticos:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDiagnosticos();
    }
  }, [pacienteId, nivelAnemia]);

  const columns = [
    {
      title: "Diagnóstico",
      dataIndex: "dx_anemia",
      key: "dx_anemia",
    },
    {
      title: "Peso (kg)",
      dataIndex: "peso",
      key: "peso",
    },
    {
      title: "Talla (cm)",
      dataIndex: "talla",
      key: "talla",
    },
    {
      title: "Hgb",
      dataIndex: "hemoglobina",
      key: "hemoglobina",
    },
    {
      title: "C",
      dataIndex: "cred",
      key: "cred",
      render: (cred: boolean) => (cred ? "Sí" : "No"),
    },
    {
      title: "S",
      dataIndex: "suplementacion",
      key: "suplementacion",
      render: (suplementacion: boolean) => (suplementacion ? "Sí" : "No"),
    },
  ];

  return (
    <Card title="Diagnósticos" bordered={false}>
      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={diagnosticos}
          rowKey="id"
          pagination={{ pageSize: 4 }}
        />
      )}
    </Card>
  );
};

export default FiltroDiagnostico;
