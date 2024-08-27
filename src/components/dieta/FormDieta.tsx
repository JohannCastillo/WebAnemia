import React, { useState, useEffect } from "react";
import CountInput from "./InputNumber";
import { Select, Button, Modal, List } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetch/fetcher";
import { SuggestionsResponse } from "@/types/Dieta/suggestions";
import { useChatContext } from "../ui/chat/chat.context";
import { createDietaConversation } from "../ui/chat/services";
import { RESULTS_DIETA } from "@/types/Dieta/results";
import { config } from "@/lib/config";

const { Option } = Select;

interface FormData {
  [key: string]: number;
}

const variablesDiet = [
  "Verduras",
  "Carnes rojas",
  "Aves",
  "Huevos",
  "Pescado",
  "Leche",
  "Menestra",
  "Bocaditos Dulces",
  "Bebidas Azucaradas",
  "Embutidos",
  "Frituras",
  "Azucar",
  "Frutas",
  "Desayuno",
  "Almuerzo",
  "Cena",
];

const variablesInputName = [
  "frec_verduras",
  "frec_carnes_rojas",
  "frec_aves",
  "frec_huevos",
  "frec_pescado",
  "frec_leche",
  "frec_menestra",
  "frec_bocados_dulces",
  "frec_bebidas_azucaradas",
  "frec_embutidos",
  "frec_fritura",
  "frec_azucar",
  "frec_desayuno",
  "frec_almuerzo",
  "frec_cena",
  "frec_fruta"
];

// const url = "https://apianemia.onrender.com";
// const url = config.backendUrl

const FormDieta = () => {
  const initialValues: FormData = variablesInputName.reduce((acc, variable) => {
    acc[variable] = 4;
    return acc;
  }, {} as FormData);
  
 
  const { setOpen, setSelectedChatID } = useChatContext()
  const [dietaResultID, setDietaResultID] = useState<number | null>(null)
  const [pacientes, setPacientes] = useState<{ id: number; nombre: string }[]>([]);
  const [values, setValues] = useState<FormData>(initialValues);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPaciente, setSelectedPaciente] = useState<number | null>(null);
  const { data: session } = useSession();
  const [error, setError] = useState<boolean>(false); // Agregado aquí
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<string[]>([]); // Cambiar a string[]

  const suggestionsMutation = useMutation<SuggestionsResponse, Error, number>({
    mutationFn: async (dietaID: number) => {
      const response = await fetcher(`/dietas/recomendaciones/${dietaID}`)
      if(response.ok){
        return response.json()
      }
    },
    onError: (error) => {
      console.error("Error fetching pacientes:", error);
      setModalContent([`Error: No se pudieron obtener las recomendaciones.`]);
    },
    onSuccess: (data) => {
      setModalContent(data.suggestions);
    }
  })

  useEffect(() => {
    const fetchPacientes = async () => {
      setLoading(true);
      try {
        if (session && session.idApoderado) {
          const response = await axios.get(`${config.backendUrl}/pacientes/apoderado/${session.idApoderado}`);
          console.log(response.data);
          setPacientes(response.data);
        }
      } catch (error) {
        console.error("Error fetching pacientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, [session]);

  const handleChange = (value: number | null, variable: string) => {
    setValues((prevValues) => ({
      ...prevValues,
      [variable]: value ?? 0,
    }));
  };

  const handlePacienteChange = (value: number | null) => {
    setSelectedPaciente(value ?? null);
    setError(false); // Limpiar el error cuando se selecciona un paciente

  };

  const handleSubmit = async () => {
    if (!selectedPaciente) {
      setError(true); // Establece error si no se selecciona un paciente
      return;
    }
    
    const formData = {
      paciente_id: selectedPaciente,
      ...values,
    };

    console.log(JSON.stringify(formData))
    // console.log("FormData:");
    // console.log("FormData:");
    // Object.keys(formData).forEach((key) => {
    //   console.log(`${key}: ${typeof formData[key]}`);
    // });


    try {
      console.log("sss")
      const response = await axios.post(`${config.backendUrl}/predict/dieta`, formData);
      
      //const response = await axios.post("/api/endpoint", { /* tu payload aquí */ });
      const dieta = response.data.dieta;
      setDietaResultID(response.data.id)

      let title = "";
      setModalContent([]);
      let recommendations: string[] = [];

      suggestionsMutation.mutate(dieta);

      switch (dieta) {
        case RESULTS_DIETA.RIESGO_BAJO:
          title = "Probabilidad Baja";
          break;
        case RESULTS_DIETA.RIESGO_MODERADO:
          title = "Probabilidad Media";
          break;
        case RESULTS_DIETA.RIESGO_ALTO:
          title = "Probabilidad Alta";
          break;
        default:
          title = "Resultado no reconocido";
          recommendations = ["Por favor, inténtalo nuevamente."];
      }

      setModalTitle(title);
      // setModalContent(recommendations);
      setIsModalVisible(true);
      
      // console.log("Respuesta de la API:", response.data);
      // setModalContent(`Response: ${response.data.dieta}`); // Actualiza esto según tu estructura de respuesta
      // setIsModalVisible(true);
    } catch (error: any) {
      setModalTitle("Error");
      setModalContent([`Error: ${error.message}`]);
      setIsModalVisible(true);    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
    // Restablecer el formulario
    setSelectedPaciente(null); // Deseleccionar el paciente
    setValues(initialValues); // Reiniciar los valores del formulario a 4
  };

  return (
    <div className="bg-white">
        <h1 className="font-medium font-sans text-xl px-4 pt-4">
          Ingresa datos de la frecuencia de consumo de la dieta alimenticia
        </h1>
        <p className="px-4">
          En este formulario, podrás ingresar la frecuencia con la que consumes diferentes tipos de alimentos y bebidas. Esta información nos ayudará a entender mejor tus hábitos alimenticios y a ofrecerte recomendaciones más personalizadas para mejorar tu dieta. Por favor, completa todos los campos con la mayor precisión posible.
        </p>
        <div style={{paddingRight: "20px", paddingLeft: "20px"}}>
          <p className="py-4 font-medium">Elegir paciente</p>
          <Select
            style={{ width: "100%"}}
            placeholder="Selecciona un paciente"
            loading={loading}
            onChange={handlePacienteChange}
            value={selectedPaciente ?? undefined} // Asegura que el valor esté controlado
            className={!selectedPaciente && error ? "ant-select-error" : ""} // Agrega clase de error si no hay selección
          >
            {pacientes.map(paciente => (
              <Option key={paciente.id} value={paciente.id}>
                {paciente.nombre}
              </Option>
            ))}
          </Select>
          {!selectedPaciente && error && <div style={{ color: "red", fontSize: "12px" }}>Por favor, selecciona un paciente.</div>}

        </div>
        <div className="grid xl:grid-cols-4 sm:grid-cols-3 mt-4 px-4">
          {variablesDiet.map((variable, index) => (
            <div key={index} className="grid grid-cols-2 gap-2">
              <h4 className="mt-2 font-sans text-sm font-semibold">
                Frecuencia de {variable}:
              </h4>
              <CountInput
                variable={variablesInputName[index]}
                value={values[variablesInputName[index]] || 4}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center m-3">
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            onClick={handleSubmit}
          >
            Consultar
          </button>
        </div>
        <div>
      <Modal 
        title="Resultado de la prediccion" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleOk}
        footer={[
          <Button className="bg-blue-600 text-white"       
            onClick={async () => {
              if(!dietaResultID) return;
              const newConversation = await createDietaConversation(dietaResultID)
              if(!newConversation) return;
              setDietaResultID(null)
              setOpen(true) // Abrir el chat
              setSelectedChatID(newConversation.conversation_id)
              handleOk()
            }}
          >
            Obtener más recomendaciones
          </Button>,
          <Button key="submit" onClick={handleOk}>
            Aceptar
          </Button>,
        ]}
      >
        <h1 className="font-medium text-xl mb-4">{modalTitle}</h1>
        <p className="mb-3">
          {
            suggestionsMutation.isPending && <span>Generando recomendaciones para tu resultado ...</span>
          }
          {
            suggestionsMutation.isSuccess && <span>
              {suggestionsMutation.data.message}
            </span>
          }
        </p>
        <List
          bordered
          dataSource={modalContent}
          loading={suggestionsMutation.isPending}
          renderItem={item => (
            <List.Item>
              {item}
            </List.Item>
          )}
        />
        <p
          className="text-neutral-500 text-xs"
        >
          Estas recomendaciones son generadas por una Inteligencia Artificial, para mayor precisión, consulta a un nutricionista.
        </p>
      </Modal>
    </div>
    </div>
    
  );
};

export default FormDieta;