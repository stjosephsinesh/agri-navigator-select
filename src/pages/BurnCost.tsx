
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const BurnCost = () => {
  const navigate = useNavigate();

  const handleShowSummary = () => {
    navigate('/summary');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">Burn Cost Calculation</h1>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <p className="text-gray-600 mb-6">Calculate and analyze burn costs here.</p>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Burn Cost Parameters</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border p-4 rounded">
              <h3 className="font-medium mb-2">Parameters</h3>
              <p>Sample burn cost parameters would go here</p>
            </div>
            
            <div className="border p-4 rounded">
              <h3 className="font-medium mb-2">Results</h3>
              <p>Sample burn cost results would go here</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleShowSummary}
          >
            Show Graphs and Summary
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BurnCost;
