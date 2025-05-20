
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const burnCostData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 400 },
  { name: 'Jul', value: 300 },
  { name: 'Aug', value: 450 },
  { name: 'Sep', value: 470 },
  { name: 'Oct', value: 520 },
  { name: 'Nov', value: 550 },
  { name: 'Dec', value: 420 },
];

const districtData = [
  { name: 'District 1', value: 5000 },
  { name: 'District 2', value: 7000 },
  { name: 'District 3', value: 4000 },
  { name: 'District 4', value: 6000 },
  { name: 'District 5', value: 8000 },
];

const Summary = () => {
  // Sample burn cost statistics
  const burnCostStats = {
    mean: 485.83,
    max: 800,
    min: 300,
    median: 460
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">Summary</h1>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Mean Burn Cost</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-bold">₹ {burnCostStats.mean.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Max Burn Cost</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-bold">₹ {burnCostStats.max.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Min Burn Cost</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-bold">₹ {burnCostStats.min.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Median Burn Cost</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-bold">₹ {burnCostStats.median.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Burn Cost Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={burnCostData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" name="Burn Cost" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">District-wise Burn Cost</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" name="Burn Cost" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overall Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Based on the analysis, the burn cost exhibits significant variation throughout the year,
                with peak values occurring in April (₹800) and lowest values in February and July (₹300).
                The overall mean burn cost is ₹485.83, which is within expected parameters for the selected covers and districts.
              </p>
              <p className="text-gray-700 mt-4">
                District-wise analysis shows that District 5 has the highest burn cost implications at ₹8,000,
                while District 3 shows the lowest at ₹4,000. This variance can be attributed to differences in
                weather patterns, crop selection, and cover parameters.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Summary;
