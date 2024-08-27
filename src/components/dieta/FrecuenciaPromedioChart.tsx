import { Line } from 'react-chartjs-2';

interface DataPoint {
  [key: string]: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

interface FrequencyChartProps {
  data: DataPoint[];
}

const FrequencyChart: React.FC<FrequencyChartProps> = ({ data }) => {
  // Calcula la frecuencia promedio de cada variable
  if (!data || data.length === 0) {
    return <div>No hay datos a mostrar, en el rango de fechas indicado.</div>;
  }
  
  const avgFrequencies: { [key: string]: number } = {};
  Object.keys(data[0]).forEach((key) => {
    if (key.startsWith('frec_')) {
      const values = data.map((item) => item[key]);
      const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
      avgFrequencies[key] = avgValue;
    }
  });

  // Crea el gráfico
  const chartData: ChartData = {
    labels: Object.keys(avgFrequencies).map((key) => key.replace('frec_', '')),
    datasets: [{
      label: 'Frecuencias',
      data: Object.values(avgFrequencies),
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(34, 139, 34, 1)',      
      //borderWidth: 1,
    }],
  };

  return (
    <div className='m-6'>
      <h2 className="font-medium text-lg mb-4">Frecuencia promedio de consumo de alimentos:</h2>
      <Line data={chartData} />
    </div>
  );
};

export default FrequencyChart;