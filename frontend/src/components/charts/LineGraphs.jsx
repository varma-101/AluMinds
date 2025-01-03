import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineGraphs = ({ refresh }) => {
  const [chartData, setChartData] = useState([]);

  const minMaxValues = {
    elongation: { min: 5, max: 25},
    conductivity: { min: 60, max: 70 },
    uts: { min: 5, max: 15 },
  };

  useEffect(() => {
    axios.get('http://localhost:5001/getdata')
      .then((response) => {
        const dataArray = Object.values(response.data);
        const processedData = dataArray.map((prediction, index) => ({
          name: `${index + 1}`,
          elongation: prediction.type === "prediction" 
            ? prediction.output?.elongation || null 
            : prediction.input?.elongation || null,
          conductivity: prediction.type === "prediction" 
            ? prediction.output?.conductivity || null 
            : prediction.input?.conductivity || null,
          uts: prediction.type === "prediction" 
            ? prediction.output?.uts || null 
            : prediction.input?.uts || null,
        }));

        setChartData(processedData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [refresh]);

  const convertToPercentage = (value, min, max) => {
    if (value === null) return null;
    return ((value) / (max)) * 100;
  };

  // Custom function to format X-axis labels as ranges
  const formatXAxisLabel = (index, totalLength) => {
    const start = index * 20 + 1;
    const end = Math.min((index + 1) * 20, totalLength);
    return `${start}-${end}`;
  };

  const CustomTooltip = ({ payload }) => {
    if (!payload || payload.length === 0) return null;

    const data = payload[0].payload;

    return (
      <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '5px' }}>
        {payload.map((entry, index) => {
          const field = entry.dataKey;
          const value = entry.value;
          const { min, max } = minMaxValues[field] || { min: 0, max: 100 };
          const percentage = convertToPercentage(value, min, max);

          return (
            <p key={index} style={{ margin: 0 }}>
              <strong>{field}:</strong> {value !== null ? `${value} (${percentage.toFixed(2)}%)` : 'N/A'}
            </p>
          );
        })}
      </div>
    );
  };

  // Function to get the max value for each graph
  const getMaxValue = (key) => {
    const values = chartData.map(item => item[key]).filter(value => value !== null);
    return Math.max(...values);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)', // Three columns
        gap: '20px', // Space between cards
        padding: '20px',
      }}
    >
      {/* Elongation Graph */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          height: '230px',
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} style={{ marginLeft: "-25px" }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tickFormatter={(value, index) => formatXAxisLabel(index, chartData.length)} // Format labels as ranges
            />
            <YAxis domain={[0, getMaxValue('elongation')]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="elongation" stroke="#ff5722" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Conductivity Graph */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          height: '230px',
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} style={{ marginLeft: "-25px" }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tickFormatter={(value, index) => formatXAxisLabel(index, chartData.length)} // Format labels as ranges
            />
            <YAxis domain={[0, getMaxValue('conductivity')]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="conductivity" stroke="#3f51b5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tensile Strength Graph */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          height: '230px',
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} style={{ marginLeft: "-25px" }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tickFormatter={(value, index) => formatXAxisLabel(index, chartData.length)} // Format labels as ranges
            />
            <YAxis domain={[0, getMaxValue('uts')]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="uts" stroke="#ff5722" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineGraphs;
