import React, { PureComponent } from "react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Line,
} from "recharts";

const monthTickFormatter = (tick: any) => {
  const [year, month] = tick.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("es-ES", { month: "short" });
};

const renderMonthTick = (props: any) => {
  const { x, y, payload, index, visibleTicksCount } = props;
  const date = new Date(payload.value);
  const month = date.toLocaleString("es-ES", { month: "short" });
  const year = date.getFullYear();

  // Only render the year in the middle tick
  const isMiddleTick = index === Math.floor(visibleTicksCount / 2);

  return (
    <g transform={`translate(${x},${y})`}>
      {isMiddleTick && (
        <text x={0} y={0} dy={-5} textAnchor="middle" fill="#666">
          {year}
        </text>
      )}
    </g>
  );
};

interface IProps {
  data: any;
}

export default class Example extends PureComponent<IProps> {
  render() {
    const { data } = this.props;

    const dataWithTotal = data.map((entry: any) => ({
      ...entry,
      totalAnemia: entry.moderada + entry.severa + entry.leve,
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={500}
          height={300}
          data={dataWithTotal}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="date" tickFormatter={monthTickFormatter} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={renderMonthTick}
            height={1}
            scale="band"
            xAxisId="quarter"
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="severa" fill="#D8261A" />
          <Bar dataKey="moderada" fill="#E6AD09" />
          <Bar dataKey="leve" fill="#FF6C37" />
          <Bar dataKey="normal" fill="#0C8F3D" />
          <Area
            type="monotone"
            dataKey="pronostico"
            name="Pronóstico"
            fill="#8884d8"
            stroke="#8884d8"
            fillOpacity={0.1}
          />
          <Line
            type="monotone"
            dataKey="totalAnemia"
            name="Total diagnósticos"
            stroke="#ff7300"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}
