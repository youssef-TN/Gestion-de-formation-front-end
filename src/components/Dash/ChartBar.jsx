import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function BarChart({ data, labels, datasets }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets.map(ds => ({
          ...ds,
          borderWidth: 1
        }))
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    return () => chart.destroy();
  }, [data, labels, datasets]);

  return (
    <div className="relative h-80">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}