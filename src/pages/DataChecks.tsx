
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const DataChecks = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('status');
  const [selectedGeoLevels, setSelectedGeoLevels] = useState<string[]>([]);
  
  // Sample field mapping options
  const fieldMappingOptions = [
    "Field1", "Field2", "Field3", "Field4", "Temperature", 
    "DateField", "Rain", "WindSpeed", "State_Name", "District_Name"
  ];

  // Define the weather data fields that need mapping
  const weatherDataFields = [
    "Date", "State", "District", "Weather Station", 
    "Maximum Temperature", "Minimum Temperature", "Rainfall (mm)",
    "Humidity", "Maximum Wind Speed", "Minimum Wind Speed"
  ];

  // Geographic levels for output
  const geoLevels = [
    "District", "Zone", "Taluka/Mandal", "Gram Panchayat", "Latitude/Longitude"
  ];

  // State for selected mapping values
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});

  const handleMappingChange = (field: string, value: string) => {
    setFieldMappings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGeoLevelChange = (level: string) => {
    setSelectedGeoLevels(prev => {
      if (prev.includes(level)) {
        return prev.filter(l => l !== level);
      } else {
        return [...prev, level];
      }
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">Data Checks</h1>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <div className="mb-6">
          <p className="text-gray-600 mb-4">Verify and validate your weather data before proceeding.</p>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="status">Check Weather Data Status</TabsTrigger>
              <TabsTrigger value="mapping">Mapping Fields</TabsTrigger>
            </TabsList>
            
            <TabsContent value="status" className="space-y-4">
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="h-5 w-5" />
                  <p className="font-medium">No errors found in the weather data.</p>
                </div>
                <p className="text-sm text-green-600 mt-2">
                  All weather data checks have passed successfully. You may proceed to the next step.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
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
              </div>
            </TabsContent>
            
            <TabsContent value="mapping" className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
                <h3 className="font-medium text-yellow-800">Link field names according to your input file</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Map your input file's column names to the system field names. This is optional - by default, we'll try to match automatically.
                </p>
              </div>
              
              <div className="mb-6 border p-4 rounded-md bg-blue-50">
                <h3 className="font-medium text-blue-800 mb-2">Select the geographical level for output</h3>
                <div className="space-y-2">
                  {geoLevels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`geo-level-${level}`} 
                        checked={selectedGeoLevels.includes(level)}
                        onCheckedChange={() => handleGeoLevelChange(level)}
                      />
                      <Label htmlFor={`geo-level-${level}`}>{level}</Label>
                    </div>
                  ))}
                </div>
                {selectedGeoLevels.length > 0 && (
                  <p className="text-sm text-blue-600 mt-2">
                    Selected levels: {selectedGeoLevels.join(', ')}
                  </p>
                )}
              </div>
              
              <div className="space-y-3">
                {weatherDataFields.map((field) => (
                  <div key={field} className="flex items-center gap-3">
                    <div className="w-1/3 text-gray-700 font-medium">{field}</div>
                    <div className="w-2/3">
                      <Select
                        value={fieldMappings[field] || ""}
                        onValueChange={(value) => handleMappingChange(field, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto-detect">Auto-detect</SelectItem>
                          {fieldMappingOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
