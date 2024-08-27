import React, { createContext, useState, ReactNode } from "react";

// Define los tipos permitidos para alertType
type AlertType = "success" | "info" | "warning" | "error";

type Paciente = {
  id: number;
  codigo_cnv: string;
  dni: string;
  nombre: string;
  sexo: string;
  fecha_nacimiento: string;
  distrito: number;
};

interface PacientesContextType {
  pacientes: Paciente[]; // Reemplaza "any" con el tipo específico si es posible
  agregarPaciente: (paciente: any) => void; // Reemplaza "any" con el tipo específico si es posible
  showAlert: boolean;
  alertMessage: string;
  alertType: AlertType;
  handleShowAlert: (message: string, type: AlertType) => void;
}

const PacientesContext = createContext<PacientesContextType | undefined>(
  undefined
);

const PacientesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pacientes, setPacientes] = useState<any[]>([]); // Reemplaza "any" con el tipo específico si es posible
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>("success");

  const handleShowAlert = (message: string, type: AlertType) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const agregarPaciente = (paciente: any) => {
    // Reemplaza "any" con el tipo específico si es posible
    setPacientes([...pacientes, paciente]);
  };

  return (
    <PacientesContext.Provider
      value={{
        pacientes,
        agregarPaciente,
        showAlert,
        alertMessage,
        alertType,
        handleShowAlert,
      }}
    >
      {children}
    </PacientesContext.Provider>
  );
};

export { PacientesProvider, PacientesContext };
