import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import Chart from "./chart";
import { useQuery } from "@tanstack/react-query";
import { ReporteEvolucionMensual } from "@/types/Reporte";
import { config } from "@/lib/config";
import { useEffect, useState } from "react";

export default function Reporte() {
  const [formattedData, setFormattedData] = useState<any>([]);
  const [rangoFrom, setRangoFrom] = useState<string | null>(null);
  const [rangoTo, setRangoTo] = useState<string | null>(null);

  const fetchReporte = async () => {
    try {
      const searchParams = new URLSearchParams();
      if (rangoFrom) searchParams.set("rango_from", rangoFrom);
      if (rangoTo) searchParams.set("rango_to", rangoTo);
      const response = await fetch(
        `${
          config.backendUrl
        }/diagnosticos/estadisticas/evolucion-mensual?${searchParams.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching departamentos:", error);
    }
  };

  const { data, isLoading, isError } = useQuery<ReporteEvolucionMensual>({
    queryKey: ["departamentos", rangoFrom, rangoTo],
    queryFn: fetchReporte,
  });

  useEffect(() => {
    if (data) {
      setFormattedData(
        data.reporte.map((entry) => ({
          date: entry.date,
          moderada: entry.moderada,
          severa: entry.severa,
          leve: entry.leve,
          normal: entry.normal,
          pronostico: (entry.pronostico * 10).toFixed(2),
        }))
      );
    }
  }, [data]);

  return (
    <article>
      <div className="flex items-center gap-4">
        <label htmlFor="rango">Seleccione un rango de fechas</label>
        <Space direction="horizontal">
          <DatePicker.RangePicker
            picker="month"
            minDate={dayjs("2019-01-01")} // dayjs instance of the first day of the month
            placeholder={["Fecha de inicio", "Fecha de fin"]}
            onChange={(value) => {
              if (value) {
                const [start, end] = value;
                if (start && end) {
                  setRangoFrom(start.format("YYYY-MM"));
                  setRangoTo(end.format("YYYY-MM"));
                }
              } else {
                setRangoFrom(null);
                setRangoTo(null);
              }
            }}
          />
        </Space>
      </div>
      <div className="h-[500px] w-full">
        <Chart data={formattedData ?? []} />
      </div>
    </article>
  );
}
