
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Summary = () => {
  // Sample data for charts
  const lineChartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 400 },
    { name: 'Jul', value: 450 },
    { name: 'Aug', value: 650 },
  ];
  
  const barChartData = [
    { name: 'Cover A', value: 2400 },
    { name: 'Cover B', value: 1398 },
    { name: 'Cover C', value: 9800 },
    { name: 'Cover D', value: 3908 },
    { name: 'Cover E', value: 4800 },
  ];

  // Sample burn cost statistics
  const burnCostStats = {
    mean: 4550.75,
    min: 2100.30,
    max: 9800.50,
    median: 4300.00
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">Summary</h1>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Burn Cost Analysis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <h3 className="text-sm text-blue-700 mb-1">Mean</h3>
              <p className="text-xl font-bold">₹{burnCostStats.mean.toFixed(2)}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md border border-green-100">
              <h3 className="text-sm text-green-700 mb-1">Minimum</h3>
              <p className="text-xl font-bold">₹{burnCostStats.min.toFixed(2)}</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-md border border-red-100">
              <h3 className="text-sm text-red-700 mb-1">Maximum</h3>
              <p className="text-xl font-bold">₹{burnCostStats.max.toFixed(2)}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
              <h3 className="text-sm text-purple-700 mb-1">Median</h3>
              <p className="text-xl font-bold">₹{burnCostStats.median.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-3">Burn Cost Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="border p-4 rounded">
            <h3 className="font-medium mb-3">Cover Comparison</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md mb-8">
          <h3 className="font-medium mb-3">Analysis Insights</h3>
          <div className="space-y-3 text-gray-700">
            <p>
              The burn cost analysis indicates a mean value of ₹4,550.75 per hectare across all selected covers.
              The minimum observed value is ₹2,100.30, while the maximum reaches ₹9,800.50.
            </p>
            <p>
              Cover C shows significantly higher burn costs compared to other covers, suggesting potential 
              risk factors that should be further investigated. Seasonal trends indicate higher 
              costs during April-May period.
            </p>
            <p>
              It is recommended to review the parameters for Cover C and consider adjustments to 
              the strike values to better balance risk and premium costs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
