import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function PieChart({ labels, data, colors }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          }
        }
      }
    });

    return () => chart.destroy();
  }, [labels, data, colors]);

  return (
    <div className="relative h-80">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}