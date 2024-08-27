import React, { useState, useEffect, useContext } from "react";
import { Divider, List } from "antd";
import axios from "axios";
import { PacientesContext } from "@/providers/pacientesContext";
import { useSession } from "next-auth/react";
import { config } from "@/lib/config";
import { Paciente } from "@/types/Paciente";

const boxStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 23,
  padding: 25,
};

const App: React.FC = () => {
  const context = useContext(PacientesContext);

  // Manejar el caso en que el contexto es undefined
  
  // const { pacientes } = context;
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [refreshPacientes, setRefreshPacientes] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    // Función para obtener datos de la API
    const fetchPacientes = async () => {
      try {
        if (session && session.idApoderado) {
          const response = await axios.get(
            `${config.backendUrl}/pacientes/apoderado/${session.idApoderado}`
          );
          setRefreshPacientes(response.data);
        }
        //agregarPaciente(response.data);
      } catch (error) {
        console.error("Error fetching provincias:", error);
      }
    };

    fetchPacientes();
  }, [pacientes]);

  useEffect(() => {
    if(context){
      setPacientes(context.pacientes);
    }
  },[context]);


  if (!context) {
    return <div>Loading...</div>; // O cualquier otro mensaje o componente que indique que el contexto está cargando
  }

  return (
    <>
      <div style={{ padding: "25px" }}>
        <Divider orientation="left">Listado de pacientes:</Divider>
        <List
          size="small"
          bordered
          dataSource={refreshPacientes}
          renderItem={(item : Paciente) => <List.Item>{item.nombre}</List.Item>}
        />
      </div>
    </>
  );
};

export default App;
