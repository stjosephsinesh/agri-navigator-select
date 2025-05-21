
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Database, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const WeatherData = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<string>('district');
  
  const calculationLevels = [
    { value: 'district', label: 'District' },
    { value: 'zone', label: 'Zone' },
    { value: 'taluka', label: 'Taluka/Mandal' },
    { value: 'gramPanchayat', label: 'Gram Panchayat' },
    { value: 'latlong', label: 'Latitude/Longitude' },
  ];
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">Weather Data Input</h1>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">Upload or input your weather data to continue.</p>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {calculationLevels.find(level => level.value === selectedLevel)?.label || 'Select Level'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Choose the level to calculate burn cost for</h4>
                <RadioGroup value={selectedLevel} onValueChange={setSelectedLevel}>
                  {calculationLevels.map((level) => (
                    <div key={level.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={level.value} id={level.value} />
                      <Label htmlFor={level.value}>{level.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
            <Upload size={36} className="text-blue-500 mb-2" />
            <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Drag and drop your CSV file here or click to browse
            </p>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Select File
            </Button>
          </div>
          
          <div className="border rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
            <Database size={36} className="text-green-500 mb-2" />
            <h3 className="text-lg font-medium mb-2">Import From Database</h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Connect and import data from your database
            </p>
            <Button className="bg-green-500 hover:bg-green-600">
              Connect Database
            </Button>
          </div>
        </div>
        
        <div className="border rounded-md p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="text-blue-500" />
            <h3 className="font-medium">Sample Files</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <FileText size={16} className="mr-2" /> Download Sample CSV Template
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText size={16} className="mr-2" /> View Format Documentation
            </Button>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/data-checks')}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WeatherData;
