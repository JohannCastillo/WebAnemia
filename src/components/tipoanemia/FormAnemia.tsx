import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Checkbox, Card } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { DiagnosticResponse } from "@/types/Diagnostico";
import { createDiagnosticConversation } from "../ui/chat/services";
import { useChatContext } from "../ui/chat/chat.context";
import { config } from "@/lib/config";

const url = config.backendUrl;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const FormAnemia: React.FC = () => {
  const [patients, setPacientes] = useState<
    Array<{ id: string; nombre: string; dni: string; distrito: string }>
  >([]);
  const { setOpen, setSelectedChatID } = useChatContext();
  const [selectedPaciente, setSelectedPaciente] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<DiagnosticResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchPacientes = async () => {
      setLoading(true);
      try {
        if (session && session.idApoderado) {
          const response = await axios.get(
            `${url}/pacientes/apoderado/${session.idApoderado}`
          );
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

  const handlePatientChange = async (value: string) => {
    const patient = patients.find((patient) => patient.id === value);
    if (patient) {
      form.setFieldsValue({
        dni: patient.dni,
      });
      setSelectedPaciente(patient.nombre);
    }
  };

  const handleSubmit = async (values: any) => {
    const formattedValues = {
      ...values,
      fecha_nacimiento: values.fecha_nacimiento
        ? values.fecha_nacimiento.toISOString().split("T")[0]
        : undefined,
    };

    try {
      const response = await axios.post(
        `${url}/pacientes/apoderado/1/create`,
        formattedValues
      );
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handlePredict = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        Paciente: values.nombre,
        Peso: values.peso,
        Talla: values.talla,
        Hemoglobina: values.hemoglobina,
        Cred: values.control_desarrollo ? 1 : 0,
        Suplementacion: values.suplementacion ? 1 : 0,
      };

      const response = await axios.post(`${url}/predict/diagnostico`, data);
      form.setFieldsValue({ resultado_prediccion: response.data.diagnostico });
      setPrediction(response.data);
    } catch (error) {
      console.error("Error predicting diagnosis:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Card
        title="Registrar Predicción de Diagnóstico"
        bordered={false}
        style={{ width: "50%" }}
      >
        <Form {...formItemLayout} form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Nombre Completo:"
            name="nombre"
            rules={[
              {
                required: true,
                message: "Seleccione el nombre completo del infante",
              },
            ]}
          >
            <Select style={{ width: "100%" }} onChange={handlePatientChange}>
              {patients.map((patient) => (
                <Option key={patient.id} value={patient.id}>
                  {patient.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="DNI:" name="dni">
            <Input readOnly />
          </Form.Item>

          <Form.Item
            label="Peso en kg:"
            name="peso"
            rules={[{ required: true, message: "Ingresar el peso en kg" }]}
          >
            <Input type="number" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Talla en cm:"
            name="talla"
            rules={[{ required: true, message: "Ingresar la talla en cm" }]}
          >
            <Input type="number" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Hemoglobina:"
            name="hemoglobina"
            rules={[
              { required: true, message: "Ingresar el nivel de hemoglobina" },
            ]}
          >
            <Input type="number" step="0.1" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "40px",
                marginLeft: "150px",
              }}
            >
              <Form.Item
                name="control_desarrollo"
                valuePropName="checked"
                style={{ marginBottom: "0" }}
              >
                <Checkbox>Control de desarrollo y crecimiento</Checkbox>
              </Form.Item>

              <Form.Item
                name="suplementacion"
                valuePropName="checked"
                style={{ marginBottom: "0" }}
              >
                <Checkbox>Suplementación</Checkbox>
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item
            label="Resultado de predicción:"
            name="resultado_prediccion"
          >
            <Input readOnly />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              style={{
                backgroundColor: "black",
                color: "white",
                marginRight: "10px",
              }}
              onClick={handlePredict}
            >
              Predecir
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <div style={{ width: "50%" }}>
        <Card title="Último resultado" bordered={false}>
          <p>Paciente: {selectedPaciente}</p>
          <p>Predicción: {prediction?.diagnostico}</p>
          {prediction && (
            <Button
              onClick={async () => {
                const newConversation = await createDiagnosticConversation(
                  prediction.id
                );
                if (!newConversation) return;
                setOpen(true); // Abrir el chat
                setSelectedChatID(newConversation.conversation_id);
              }}
            >
              Obtener recomendaciones
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default FormAnemia;
