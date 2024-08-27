import React, { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { config } from "@/lib/config";

const url = config.backendUrl;
const { Option } = Select;

const PacienteSelector: React.FC<{ onPacienteChange: (id: string) => void }> = ({ onPacienteChange }) => {
  const [pacientes, setPacientes] = useState<Array<{ id: string; nombre: string }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPacientes = async () => {
      if (!session || !session.idApoderado) return;

      setLoading(true);
      try {
        const response = await axios.get(`${url}/pacientes/apoderado/${session.idApoderado}`);
        setPacientes(response.data);
      } catch (error) {
        console.error("Error fetching pacientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, [session]);

  return (
    <div>
      {loading ? (
        <Spin />
      ) : (
        <Select
          style={{ width: "100%" }}
          placeholder="Seleccionar paciente"
          onChange={onPacienteChange}
        >
          {pacientes.map((paciente) => (
            <Option key={paciente.id} value={paciente.id}>
              {paciente.nombre}
            </Option>
          ))}
        </Select>
      )}
    </div>
  );
};

export default PacienteSelector;
