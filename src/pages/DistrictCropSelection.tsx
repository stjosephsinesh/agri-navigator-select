
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DistrictCropSelection = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  
  const districts = ["District 1", "District 2", "District 3", "District 4", "District 5"];
  const crops = [
    "Rice", "Wheat", "Maize", "Barley", "Bajra", 
    "Jowar", "Pulses", "Sugarcane", "Cotton", "Groundnut", 
    "Mustard", "Tea", "Coffee", "Turmeric"
  ];

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
  };

  const handleCropChange = (value: string) => {
    setSelectedCrop(value);
  };

  const handleProceed = () => {
    console.log("Proceeding with:", { selectedDistrict, selectedCrop });
    // Add navigation or further action here
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">District and Crop Selection</h1>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">State:</h2>
          <p className="text-gray-700 p-2 bg-gray-100 rounded">Himachal Pradesh</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">District Selection:</h2>
          <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
            <SelectTrigger className="w-full max-w-sm">
              <SelectValue placeholder="Select a district" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedDistrict && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Crop Selection:</h2>
            <Select value={selectedCrop} onValueChange={handleCropChange}>
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue placeholder="Select a crop" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {crops.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedDistrict && selectedCrop && (
          <div className="flex justify-end mt-8">
            <Button 
              onClick={handleProceed} 
              className="bg-blue-500 hover:bg-blue-600"
            >
              Proceed
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistrictCropSelection;
