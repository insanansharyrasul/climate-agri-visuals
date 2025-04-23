
import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';

interface AdaptationPieChartProps {
  selectedCountry: string;
}

interface AdaptationData {
  [country: string]: {
    [strategy: string]: number;
  };
}

const AdaptationPieChart = ({ selectedCountry }: AdaptationPieChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<AdaptationData>({});

  useEffect(() => {
    // Load and process CSV data
    const loadData = async () => {
      try {
        const response = await fetch('/data/climate_change_impact_on_agriculture_2024.csv');
        const text = await response.text();
        const rows = text.split('\n').slice(1); // Skip header row
        
        const adaptationData: AdaptationData = {};

        rows.forEach((row) => {
          const [country, strategy] = row.split(',').map(item => item?.trim());
          
          if (!country || !strategy) return;

          if (!adaptationData[country]) {
            adaptationData[country] = {};
          }
          if (!adaptationData[country][strategy]) {
            adaptationData[country][strategy] = 0;
          }
          adaptationData[country][strategy] += 1;

          if (!adaptationData["Global"]) {
            adaptationData["Global"] = {};
          }
          if (!adaptationData["Global"][strategy]) {
            adaptationData["Global"][strategy] = 0;
          }
          adaptationData["Global"][strategy] += 1;
        });

        dataRef.current = adaptationData;
        updateChart(selectedCountry);
      } catch (err) {
        console.error('Error loading CSV:', err);
      }
    };

    loadData();
  }, [selectedCountry]); // Run once on mount

  useEffect(() => {
    if (dataRef.current) {
      updateChart(selectedCountry);
    }
  }, [selectedCountry]);

  const updateChart = (country: string) => {
    if (!chartRef.current) return;

    const data = dataRef.current[country];
    if (!data) return;

    const strategies = Object.keys(data);
    const values = strategies.map((key) => data[key]);

    const trace = {
      labels: strategies,
      values: values,
      type: "pie",
      textposition: 'outside',
      textinfo: "label+percent",
      hoverinfo: "label+value",
      marker: {
        line: {
          width: 2,
          color: "white"
        }
      }
    };

    const layout = {
      title: `Distribusi Strategi Adaptasi (${country})`,
      font: { size: 16 },
      height: 500,
      width: 800,
      showlegend: false,
      margin: {
        l: 50, r: 50,
        t: 50, b: 50
      }
    };

    const config = { 
      responsive: true,
      displayModeBar: false
    };

    Plotly.newPlot(chartRef.current, [trace], layout, config);
  };

  return <div ref={chartRef} id="pie-chart" className="h-[500px] w-full" />;
};

export default AdaptationPieChart;
