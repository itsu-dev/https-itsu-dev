'use client';

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as CTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  CTitle,
  Tooltip,
  Legend,
);

export default function OsirifukiGraph({ data, }: { data: OsirifukiResponse }) {
  const graphData = {
    labels: new Array(288).fill(0).map((_, i) => `${Math.floor((5 * i) / 60)}時${(5 * i) % 60}分`),
    datasets: [
      {
        label: '心拍数',
        data: data.heartBeats,
        borderColor: 'rgb(75, 192, 192)',
        width: 1,
      },
    ],
  };

  const options: {} = {
    maintainAspectRatio: true,
  };

  return (
    <Line
      height={300}
      width={300}
      data={graphData}
      options={options}
      id='chart-key'
    />
  )
}