import React, { useContext } from "react";
import FormPaciente from "@/components/pacientes/FormPaciente";
import ListPacientes from "@/components/pacientes/ListPacientes";
import {
  PacientesContext,
  PacientesProvider,
} from "@/providers/pacientesContext";
import { Alert } from "antd";

const boxStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 23,
  padding: 25,
  backgroundColor: "white",
};

function Registro() {
  const context = useContext(PacientesContext);

  if (!context) {
    throw new Error("PacientesContext must be used within a PacientesProvider");
  }

  const { showAlert, alertMessage, alertType } = context;

  return (
    <>
      <div>
        {showAlert && (
          <Alert
            message={alertMessage}
            type={alertType}
            showIcon
            style={{ margin: "20px" }}
          />
        )}
      </div>
      <div style={boxStyle} className="grid xs:grid-cols-1 md:grid-cols-2">
        <FormPaciente />
        <ListPacientes />
      </div>
    </>
  );
}

const RegistroPage: React.FC = () => {
  return (
    <PacientesProvider>
      <Registro />
    </PacientesProvider>
  );
};

export default RegistroPage;
