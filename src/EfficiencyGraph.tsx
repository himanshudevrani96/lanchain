import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

interface EfficiencyData {
  overallEfficiency: number;
  strengths: string[];
  weaknesses: string[];
  areasForImprovement: string[];
}

const EfficiencyGraph: React.FC<{ efficiencyData: EfficiencyData }> = ({ efficiencyData }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (efficiencyData) {
      const data = {
        labels: ['Overall Efficiency', 'Strengths', 'Weaknesses', 'Areas for Improvement'],
        datasets: [
          {
            label: 'Developer Efficiency',
            data: [
              efficiencyData.overallEfficiency,
              efficiencyData.strengths.length,
              efficiencyData.weaknesses.length,
              efficiencyData.areasForImprovement.length,
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };

      setChartData(data);
    }
  }, [efficiencyData]);

  return (
    <div>
      <h2>Developer Efficiency Graph</h2>
      {chartData && <Bar data={chartData} />}
    </div>
  );
};

export default EfficiencyGraph;
