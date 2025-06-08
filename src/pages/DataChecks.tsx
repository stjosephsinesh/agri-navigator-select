
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DataChecks = () => {
  const navigate = useNavigate();
  const [selectedGeoLevel, setSelectedGeoLevel] = useState<string>("District");
  
  // Geographic levels for output
  const geoLevels = [
    "District", "Zone", "Taluka/Mandal", "Gram Panchayat", "Latitude/Longitude"
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">Data Checks</h1>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <div className="mb-6">
          <p className="text-gray-600 mb-4">Verify and validate your weather data before proceeding.</p>
          
          <div className="bg-green-50 p-4 rounded-md border border-green-200 mb-6">
            <div className="flex items-center gap-2 text-green-700">
              <Check className="h-5 w-5" />
              <p className="font-medium">No errors found in the weather data.</p>
            </div>
            <p className="text-sm text-green-600 mt-2">
              All weather data checks have passed successfully. You may proceed to the next step.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6">
            <h3 className="font-medium text-blue-700">Data Summary</h3>
            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
              <div>
                <p className="text-gray-600">Total Records: <span className="font-medium">1,245</span></p>
                <p className="text-gray-600">Date Range: <span className="font-medium">Jan 1, 2023 - Dec 31, 2023</span></p>
              </div>
              <div>
                <p className="text-gray-600">Districts: <span className="font-medium">15</span></p>
                <p className="text-gray-600">Weather Stations: <span className="font-medium">45</span></p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-200">
              <h4 className="font-medium text-blue-800 mb-3">Select the geographical level for output</h4>
              <div className="flex items-center gap-3">
                <Label htmlFor="geo-level" className="text-sm font-medium">Geographic Level:</Label>
                <Select value={selectedGeoLevel} onValueChange={setSelectedGeoLevel}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {geoLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-blue-600 mt-2">
                Selected level: {selectedGeoLevel}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/district-crop-selection')}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataChecks;
