import React, { useEffect, useState, useContext } from "react";
import { Button, DatePicker, Form, Input, Select } from "antd";
import { Flex } from "antd";
import { useSession } from 'next-auth/react';
import axios from "axios";
import { PacientesContext } from "@/providers/pacientesContext";
import { config } from "@/lib/config";

// const url = 'https://apianemia.onrender.com';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 }, // Aumenta el ancho del label
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
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
      offset: 10, // Ajusta el offset para alinear con el label
    },
  },
};

const boxStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 23,
  padding: 25,
};

interface FormPacienteProps {
  //handleShowAlert: (mensaje: string, type: string) => void;
}

const FormPaciente: React.FC<FormPacienteProps> = () => {
  const [provinces, setProvinces] = useState<Array<{ id: string, provincia: string }>>([]);
  const [distritos, setDistritos] = useState<Array<{ id: string, distrito: string }>>([]);
  const [provinciaSelected, setProvinciaSelected] = useState<string | undefined>(undefined);
  const [form] = Form.useForm();
  const { data: session, status } = useSession();


  const context = useContext(PacientesContext);

  if (!context) {
    throw new Error('PacientesContext must be used within a PacientesProvider');
  }

  const { pacientes, agregarPaciente, showAlert, alertMessage, alertType, handleShowAlert } = context;
  
  useEffect(() => {
    // Función para obtener datos de la API
    console.log(config.backendUrl);
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/provincias`);
        setProvinces(response.data);
      } catch (error) {
        console.error("Error fetching provincias:", error);
      }
    };

    fetchProvinces();
  }, []);

  const handleChangeProvincia = async (value: string) => {
    setProvinciaSelected(value); 
    try {
      const response = await axios.get(`${config.backendUrl}/distritos/provincia/${value}`);
      setDistritos(response.data);
    } catch (error) {
      console.error('Error fetching distritos:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    const formattedValues = {
        ...values,
        fecha_nacimiento: values.fecha_nacimiento ? values.fecha_nacimiento.toISOString().split('T')[0] : undefined,
      };
    
    if (!formattedValues.dni) {
        delete formattedValues.dni;
    }

    const jsonData = JSON.stringify(formattedValues);
    console.log('Datos del formulario en JSON:', jsonData);
    try {
      if (session && session.idApoderado) {
        const response = await axios.post(`${config.backendUrl}/pacientes/apoderado/${session.idApoderado}/create`, formattedValues);
        console.log('Respuesta de la API:', response.data);
        agregarPaciente(response.data);
        form.resetFields(); // Clear the form fields
        setProvinciaSelected(undefined); // Reset the Select component
        handleShowAlert('Paciente registrado correctamente!', 'success');
        console.log(pacientes);
      }
    } catch (error) {
      console.error('Error submitting form:', error);

      const errorMessage = axios.isAxiosError(error) && error.response?.data
            ? Object.values(error.response.data)
                .flat()
                .map(msg => `• ${msg}`)
                .join('\n') // Usa salto de línea para mostrar cada error en una línea separada
            : 'Error desconocido';

      handleShowAlert(errorMessage, 'error');
    }
  };

  return (

    <>
        <div>
            <h1 className='text-xl font-semibold text-center'>Registrar paciente:</h1>
            <p className='text-sm p-4'>Ingrese los datos del menor.</p>
            <Flex gap="middle" align="start" vertical>
            <Flex style={boxStyle} justify="center" align="center">
                <Form
                {...formItemLayout}
                form={form}
                variant="filled"
                onFinish={handleSubmit} // Configura el manejador de envío del formulario
                >
                <Form.Item
                    label="DNI:"
                    name="dni"
                    rules={[{ message: "Ingresar DNI del infante" }]}
                >
                    <Input style={{ marginLeft: '12px' }} />
                </Form.Item>

                <Form.Item
                    label="Código Nacido Vivo:"
                    name="codigo_cnv"
                    rules={[{ required: true, message: 'Ingresar codigo de certificado de nacido vivo' }]}
                >
                    <Input style={{ marginLeft: '12px' }} />
                </Form.Item>

                <Form.Item
                    label="Nombre Completo:"
                    name="nombre"
                    rules={[{ required: true, message: 'Ingresar nombre completo del infante' }]}
                >
                    <Input style={{ marginLeft: '12px' }} />
                </Form.Item>

                <Form.Item
                    label="Provincia:"
                    rules={[{ required: true, message: 'Seleccione la provincia' }]}
                >
                    <Select
                    style={{ marginLeft: '12px' }}
                    onChange={handleChangeProvincia}
                    value={provinciaSelected}
                    >
                    {provinces.map(province => (
                        <Option key={province.id} value={province.id}>
                        {province.provincia}
                        </Option>
                    ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Distrito:"
                    name="distrito"
                    rules={[{ required: true, message: 'Seleccione el distrito' }]}
                >
                    <Select style={{ marginLeft: '12px' }}>
                    {distritos.map(district => (
                        <Option key={district.id} value={district.id}>
                        {district.distrito}
                        </Option>
                    ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Sexo:"
                    name="sexo"
                    rules={[{ required: true, message: 'Ingresar el sexo' }]}
                >
                    <Select style={{ marginLeft: '12px' }}>
                    <Option key={1} value="M">MASCULINO</Option>
                    <Option key={2} value="F">FEMENINO</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Fecha Nacimiento:"
                    name="fecha_nacimiento"
                    rules={[{ required: true, message: "Ingresar la fecha de nacimiento" }]}
                >
                <DatePicker format="YYYY-MM-DD" style={{ marginLeft: '12px' }} />          
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary"  htmlType="submit"
                    style={{ backgroundColor: 'black', color: 'white' }}>
                    Registrar
                    </Button>
                </Form.Item>
                </Form>
            </Flex>
            </Flex>
        </div>
    </>
  );
};

export default FormPaciente;