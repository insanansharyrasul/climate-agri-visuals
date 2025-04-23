
import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';

interface EmissionsLineChartProps {
  selectedCountry: string;
}

interface EmissionsData {
  [country: string]: {
    [year: string]: number;
  };
}

const EmissionsLineChart = ({ selectedCountry }: EmissionsLineChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<EmissionsData>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/climate_change_impact_on_agriculture_2024.csv');
        const text = await response.text();
        const rows = text.split('\n').slice(1);
        
        const emissionsData: EmissionsData = {};

        rows.forEach((row) => {
          const [country, year, , , emissions] = row.split(',').map(item => item?.trim());
          
          if (!country || !year || isNaN(Number(emissions))) return;

          if (!emissionsData[country]) emissionsData[country] = {};
          if (!emissionsData[country][year]) emissionsData[country][year] = 0;
          emissionsData[country][year] += Number(emissions);

          if (!emissionsData["Global"]) emissionsData["Global"] = {};
          if (!emissionsData["Global"][year]) emissionsData["Global"][year] = 0;
          emissionsData["Global"][year] += Number(emissions);
        });

        dataRef.current = emissionsData;
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

    const countryData = dataRef.current[country];
    if (!countryData) return;

    const dataPoints = Object.entries(countryData).map(([year, emissions]) => ({
      year: parseInt(year),
      emissions
    })).sort((a, b) => a.year - b.year);

    const trace = {
      x: dataPoints.map(d => d.year),
      y: dataPoints.map(d => d.emissions),
      type: "scatter",
      mode: "lines+markers",
      name: country,
      line: { width: 2 },
      marker: { size: 6 }
    };

    const layout = {
      title: `CO₂ Emissions Over Time (${country})`,
      height: 500,
      width: 800,
      xaxis: {
        title: "Year",
        tickmode: "linear",
        dtick: 5
      },
      yaxis: {
        title: "Emissions (MT)",
        rangemode: "tozero"
      },
      font: { size: 16 },
      margin: {
        l: 80,
        r: 50,
        t: 50,
        b: 50
      }
    };

    const config = { 
      responsive: true,
      displayModeBar: false
    };

    Plotly.newPlot(chartRef.current, [trace], layout, config);
  };

  return <div ref={chartRef} id="line-chart" className="h-[500px] w-full" />;
};

export default EmissionsLineChart;
