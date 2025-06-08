
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock } from 'lucide-react';

const BurnCost = () => {
  const navigate = useNavigate();
  const [isLocked, setIsLocked] = useState(false);

  const handleShowSummary = () => {
    navigate('/summary');
  };

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Burn Cost Calculation</h1>
          <Button 
            onClick={toggleLock}
            className={`${isLocked ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
          >
            {isLocked ? (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Unlock Cover
              </>
            ) : (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                Lock Cover
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        {isLocked && (
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-6">
            <div className="flex items-center gap-2 text-yellow-700">
              <Lock className="h-5 w-5" />
              <p className="font-medium">Cover is locked</p>
            </div>
            <p className="text-sm text-yellow-600 mt-1">
              Cover definitions and calculations are locked. You can view burn cost and summary but cannot make changes.
            </p>
          </div>
        )}
        
        <p className="text-gray-600 mb-6">Calculate and analyze burn costs here.</p>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Burn Cost Parameters</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`border p-4 rounded ${isLocked ? 'bg-gray-100' : ''}`}>
              <h3 className="font-medium mb-2">Parameters</h3>
              <p className={isLocked ? 'text-gray-500' : ''}>
                Sample burn cost parameters would go here
              </p>
              {isLocked && (
                <p className="text-sm text-gray-400 mt-2 italic">
                  (Editing disabled - cover is locked)
                </p>
              )}
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
