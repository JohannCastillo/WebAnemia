import { Button, Select, Card } from "antd";
export default function ReportePorPaciente() {
  return (
    <div>
      <Card title="Reporte de diagnósticos de anemia por paciente">
        <label htmlFor="paciente"></label>
        <Select
          showSearch
          id="paciente"
          className="w-full"
          placeholder="Select a person"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={[
            { value: "1", label: "Jack" },
            { value: "2", label: "Lucy" },
            { value: "3", label: "Tom" },
          ]}
        />
      </Card>
      <Card title="Reporte de diagnósticos">
        <Card title="Último diagnóstico" content="XD"></Card>
      </Card>
    </div>
  );
}
