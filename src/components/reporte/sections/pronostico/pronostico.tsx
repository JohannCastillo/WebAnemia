import { Card, Checkbox } from "antd";
import Reporte from "./reporte";
import { useState } from "react";

export default function Pronostico() {
  const [comparar, setComparar] = useState(false);

  return (
    <Card 
      title="Estado actual y pronóstico de prevalencia de anemia en niños en La Libertad"
      extra={<Checkbox checked={comparar} onChange={(e) => setComparar(e.target.checked)}>Hacer comparación</Checkbox>}
    >
      <div className={`grid grid-cols-1 ${comparar && "grid-cols-2"}`}>
      <Reporte/>
      {
        comparar &&
          <Reporte/>
      }
      </div>
    </Card> 
  )
}