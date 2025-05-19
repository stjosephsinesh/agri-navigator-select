
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from 'react-router-dom';

const DistrictCropSelection = () => {
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState<boolean>(false);
  const [isCropDropdownOpen, setIsCropDropdownOpen] = useState<boolean>(false);
  
  const navigate = useNavigate();
  
  const districts = ["District 1", "District 2", "District 3", "District 4", "District 5"];
  const crops = [
    "Rice", "Wheat", "Maize", "Barley", "Bajra", 
    "Jowar", "Pulses", "Sugarcane", "Cotton", "Groundnut", 
    "Mustard", "Tea", "Coffee", "Turmeric"
  ];

  const handleDistrictToggle = (district: string) => {
    setSelectedDistricts(prev => {
      if (prev.includes(district)) {
        return prev.filter(d => d !== district);
      } else {
        return [...prev, district];
      }
    });
  };

  const handleCropToggle = (crop: string) => {
    setSelectedCrops(prev => {
      if (prev.includes(crop)) {
        return prev.filter(c => c !== crop);
      } else {
        return [...prev, crop];
      }
    });
  };

  const handleProceed = () => {
    console.log("Proceeding with:", { selectedDistricts, selectedCrops });
    navigate('/cover-selection');
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
          <div className="relative">
            <button
              onClick={() => setIsDistrictDropdownOpen(!isDistrictDropdownOpen)}
              className="w-full max-w-sm flex justify-between items-center border rounded-md p-2 bg-white"
            >
              <span className="text-sm">
                {selectedDistricts.length === 0
                  ? "Select districts"
                  : `${selectedDistricts.length} district(s) selected`}
              </span>
              <span>▼</span>
            </button>
            
            {isDistrictDropdownOpen && (
              <div className="absolute z-10 w-full max-w-sm mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {districts.map((district) => (
                  <div 
                    key={district} 
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleDistrictToggle(district)}
                  >
                    <Checkbox 
                      id={`district-${district}`}
                      checked={selectedDistricts.includes(district)}
                      className="mr-2"
                    />
                    <label htmlFor={`district-${district}`} className="flex-grow cursor-pointer">
                      {district}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedDistricts.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">Selected Districts:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedDistricts.map(district => (
                  <span 
                    key={district}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                  >
                    {district}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Crop Selection:</h2>
          <div className="relative">
            <button
              onClick={() => setIsCropDropdownOpen(!isCropDropdownOpen)}
              className="w-full max-w-sm flex justify-between items-center border rounded-md p-2 bg-white"
            >
              <span className="text-sm">
                {selectedCrops.length === 0
                  ? "Select crops"
                  : `${selectedCrops.length} crop(s) selected`}
              </span>
              <span>▼</span>
            </button>
            
            {isCropDropdownOpen && (
              <div className="absolute z-10 w-full max-w-sm mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {crops.map((crop) => (
                  <div 
                    key={crop} 
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCropToggle(crop)}
                  >
                    <Checkbox 
                      id={`crop-${crop}`}
                      checked={selectedCrops.includes(crop)}
                      className="mr-2"
                    />
                    <label htmlFor={`crop-${crop}`} className="flex-grow cursor-pointer">
                      {crop}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedCrops.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">Selected Crops:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCrops.map(crop => (
                  <span 
                    key={crop}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedDistricts.length > 0 && selectedCrops.length > 0 && (
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
