import React from 'react';
import { Line } from 'react-chartjs-2';

const LineChart = ({ data }) => {
  // Extract years and sums from data array
  const years = data.map(item => item.year);
  const sums = data.map(item => item.sum);

  // Chart data
  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Total Echeance credit annuel',
        data: sums,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Chart options
  const options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
      }],
    },
  };

  return (
    <div style={{ width: '100%'}}>
        <div style={{overflowX:"scroll"}}>  
            <Line data={chartData} options={options} style={{width:"100%"}}/>
        </div>
    </div>
  );
};

export default LineChart;
