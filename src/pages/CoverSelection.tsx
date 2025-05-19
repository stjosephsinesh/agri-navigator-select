
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Umbrella, Thermometer, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CoverSelection = () => {
  const [selectedCovers, setSelectedCovers] = useState<Record<string, string[]>>({
    rainfall: [],
    temperature: [],
    otherCovers: [],
    customCovers: []
  });
  
  const navigate = useNavigate();

  const coverCategories = {
    rainfall: [
      "Consecutive N day's rainfall in excess of TRIGGER1 plus subsequent day's rainfall if it is greater than TRIGGER2 (in subsequent day's rainfall M days gap is allowed) - Rate",
      "Count of Rainy days - Rate",
      "Daily Rainfall (multiple Event) - Rate (Multiple)",
      "Deficit aggregate rainfall - Rate",
      "Maximum number of consecutive dry days(CDD) over period - Rate"
    ],
    temperature: [
      "Cover 1 - Temperature",
      "Cover 2 - Temperature",
      "Cover 3 - Temperature",
      "Cover 4 - Temperature",
      "Cover 5 - Temperature"
    ],
    otherCovers: [
      "Cover 1 - Other",
      "Cover 2 - Other",
      "Cover 3 - Other",
      "Cover 4 - Other",
      "Cover 5 - Other"
    ],
    customCovers: [
      "Cover 1 - Custom",
      "Cover 2 - Custom",
      "Cover 3 - Custom",
      "Cover 4 - Custom",
      "Cover 5 - Custom"
    ]
  };

  const handleCoverToggle = (category: string, cover: string) => {
    setSelectedCovers(prev => {
      const current = [...prev[category as keyof typeof prev]];
      
      if (current.includes(cover)) {
        return {
          ...prev,
          [category]: current.filter(c => c !== cover)
        };
      } else {
        return {
          ...prev,
          [category]: [...current, cover]
        };
      }
    });
  };

  const handleUncheckAll = (category: string) => {
    setSelectedCovers(prev => ({
      ...prev,
      [category]: []
    }));
  };

  const getSelectedCount = (category: string) => {
    return selectedCovers[category as keyof typeof selectedCovers].length;
  };

  const handleContinue = () => {
    navigate('/quick-tool');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">Cover Selection</h1>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <p className="text-lg mb-6">Select cover options for your crop.</p>
        
        <div className="space-y-4">
          <Accordion type="multiple" defaultValue={["rainfall"]}>
            <AccordionItem value="rainfall" className="border-0">
              <div className="bg-sky-200 rounded-t-md">
                <div className="flex justify-between items-center p-2">
                  <div className="flex items-center gap-2">
                    <Umbrella className="h-5 w-5" />
                    <AccordionTrigger className="hover:no-underline p-0 text-md font-medium">
                      Rainfall
                    </AccordionTrigger>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUncheckAll('rainfall')}
                      className="bg-white text-sm py-1 px-2 rounded border"
                    >
                      Uncheck All
                    </button>
                    <span className="text-sm">{getSelectedCount('rainfall')} covers selected</span>
                  </div>
                </div>
              </div>
              <AccordionContent className="mt-0 pt-0 border border-t-0 rounded-b-md">
                <div className="p-2 space-y-2">
                  {coverCategories.rainfall.map((cover) => (
                    <div 
                      key={cover} 
                      className="flex items-center gap-2 hover:bg-gray-100 rounded p-1 cursor-pointer"
                      onClick={() => handleCoverToggle('rainfall', cover)}
                    >
                      <Checkbox
                        id={`rainfall-${cover}`}
                        checked={selectedCovers.rainfall.includes(cover)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`rainfall-${cover}`}
                        className="text-sm text-gray-700 leading-tight cursor-pointer flex-grow"
                      >
                        {cover}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="temperature" className="border-0">
              <div className="bg-yellow-100 rounded-t-md">
                <div className="flex justify-between items-center p-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5" />
                    <AccordionTrigger className="hover:no-underline p-0 text-md font-medium">
                      Temperature
                    </AccordionTrigger>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUncheckAll('temperature')}
                      className="bg-white text-sm py-1 px-2 rounded border"
                    >
                      Uncheck All
                    </button>
                    <span className="text-sm">{getSelectedCount('temperature')} covers selected</span>
                  </div>
                </div>
              </div>
              <AccordionContent className="mt-0 pt-0 border border-t-0 rounded-b-md">
                <div className="p-2 space-y-2">
                  {coverCategories.temperature.map((cover) => (
                    <div 
                      key={cover} 
                      className="flex items-center gap-2 hover:bg-gray-100 rounded p-1 cursor-pointer"
                      onClick={() => handleCoverToggle('temperature', cover)}
                    >
                      <Checkbox
                        id={`temperature-${cover}`}
                        checked={selectedCovers.temperature.includes(cover)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`temperature-${cover}`}
                        className="text-sm text-gray-700 leading-tight cursor-pointer flex-grow"
                      >
                        {cover}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="otherCovers" className="border-0">
              <div className="bg-green-100 rounded-t-md">
                <div className="flex justify-between items-center p-2">
                  <div className="flex items-center gap-2">
                    <Umbrella className="h-5 w-5" />
                    <AccordionTrigger className="hover:no-underline p-0 text-md font-medium">
                      Other Covers
                    </AccordionTrigger>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUncheckAll('otherCovers')}
                      className="bg-white text-sm py-1 px-2 rounded border"
                    >
                      Uncheck All
                    </button>
                    <span className="text-sm">{getSelectedCount('otherCovers')} covers selected</span>
                  </div>
                </div>
              </div>
              <AccordionContent className="mt-0 pt-0 border border-t-0 rounded-b-md">
                <div className="p-2 space-y-2">
                  {coverCategories.otherCovers.map((cover) => (
                    <div 
                      key={cover}
                      className="flex items-center gap-2 hover:bg-gray-100 rounded p-1 cursor-pointer" 
                      onClick={() => handleCoverToggle('otherCovers', cover)}
                    >
                      <Checkbox
                        id={`otherCovers-${cover}`}
                        checked={selectedCovers.otherCovers.includes(cover)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`otherCovers-${cover}`}
                        className="text-sm text-gray-700 leading-tight cursor-pointer flex-grow"
                      >
                        {cover}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="customCovers" className="border-0">
              <div className="bg-gray-100 rounded-t-md">
                <div className="flex justify-between items-center p-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    <AccordionTrigger className="hover:no-underline p-0 text-md font-medium">
                      Custom Covers
                    </AccordionTrigger>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUncheckAll('customCovers')}
                      className="bg-white text-sm py-1 px-2 rounded border"
                    >
                      Uncheck All
                    </button>
                    <span className="text-sm">{getSelectedCount('customCovers')} covers selected</span>
                  </div>
                </div>
              </div>
              <AccordionContent className="mt-0 pt-0 border border-t-0 rounded-b-md">
                <div className="p-2 space-y-2">
                  {coverCategories.customCovers.map((cover) => (
                    <div 
                      key={cover} 
                      className="flex items-center gap-2 hover:bg-gray-100 rounded p-1 cursor-pointer"
                      onClick={() => handleCoverToggle('customCovers', cover)}
                    >
                      <Checkbox
                        id={`customCovers-${cover}`}
                        checked={selectedCovers.customCovers.includes(cover)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`customCovers-${cover}`}
                        className="text-sm text-gray-700 leading-tight cursor-pointer flex-grow"
                      >
                        {cover}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoverSelection;
