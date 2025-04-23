
import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';

interface EconomicBarChartProps {
  selectedCountry: string;
}

interface CropImpactData {
  [country: string]: {
    [cropType: string]: number;
  };
}

const EconomicBarChart = ({ selectedCountry }: EconomicBarChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<CropImpactData>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/climate_change_impact_on_agriculture_2024.csv');
        const text = await response.text();
        const rows = text.split('\n').slice(1);
        
        const cropImpactData: CropImpactData = {};

        rows.forEach((row) => {
          const [country, , cropType, , , impact] = row.split(',').map(item => item?.trim());
          
          if (!country || !cropType || isNaN(Number(impact))) return;

          if (!cropImpactData[country]) cropImpactData[country] = {};
          if (!cropImpactData[country][cropType]) cropImpactData[country][cropType] = 0;
          cropImpactData[country][cropType] += Number(impact);

          if (!cropImpactData["Global"]) cropImpactData["Global"] = {};
          if (!cropImpactData["Global"][cropType]) cropImpactData["Global"][cropType] = 0;
          cropImpactData["Global"][cropType] += Number(impact);
        });

        dataRef.current = cropImpactData;
        updateChart(selectedCountry);
      } catch (err) {
        console.error('Error loading CSV:', err);
      }
    };

    loadData();
  }, [selectedCountry]);

  useEffect(() => {
    if (dataRef.current) {
      updateChart(selectedCountry);
    }
  }, [selectedCountry]);

  const updateChart = (country: string) => {
    if (!chartRef.current) return;

    const cropData = dataRef.current[country];
    if (!cropData) return;

    const sortedData = Object.entries(cropData)
      .map(([crop, value]) => ({ crop, value }))
      .sort((a, b) => b.value - a.value);

    const colors = [
      '#2ca02c', // green
      '#1f77b4', // blue
      '#ff7f0e', // orange
      '#d62728', // red
      '#9467bd', // purple
      '#8c564b', // brown
      '#e377c2', // pink
      '#7f7f7f', // gray
      '#bcbd22', // yellow-green
      '#17becf'  // light blue
    ];

    const trace = {
      x: sortedData.map(item => item.crop),
      y: sortedData.map(item => item.value),
      type: "bar",
      marker: {
        color: colors.slice(0, sortedData.length)
      }
    };

    const layout = {
      title: `Dampak Ekonomi Berdasarkan Jenis Tanaman (${country})`,
      height: 500,
      width: 800,
      xaxis: { 
        title: "Jenis Tanaman",
        tickangle: -45
      },
      yaxis: { 
        title: "Dampak Ekonomi (Juta USD)",
        automargin: true
      },
      font: { size: 16 },
      margin: {
        l: 80,
        r: 50,
        t: 50,
        b: 120
      },
      showlegend: false
    };

    const config = { 
      responsive: true,
      displayModeBar: false
    };

    Plotly.newPlot(chartRef.current, [trace], layout, config);
  };

  return <div ref={chartRef} id="bar-chart" className="h-[500px] w-full" />;
};

export default EconomicBarChart;
