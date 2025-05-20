
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome to RWBCIS Dashboard.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Recent Projects</h2>
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded border border-gray-100">
              <p className="font-medium">Rice - Kerala 2023</p>
              <p className="text-sm text-gray-500">Last updated: May 19, 2023</p>
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-100">
              <p className="font-medium">Wheat - Punjab 2023</p>
              <p className="text-sm text-gray-500">Last updated: April 12, 2023</p>
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-100">
              <p className="font-medium">Cotton - Gujarat 2023</p>
              <p className="text-sm text-gray-500">Last updated: March 30, 2023</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-600">Total Projects</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-green-600">Active Projects</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <p className="text-sm text-yellow-600">Weather Stations</p>
              <p className="text-2xl font-bold">450</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-sm text-purple-600">Total Covers</p>
              <p className="text-2xl font-bold">87</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate('/weather-data')}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
