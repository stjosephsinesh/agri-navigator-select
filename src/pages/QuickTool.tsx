
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useLocation, useNavigate } from 'react-router-dom';

// Define types for the form state
interface StrikeData {
  strike: string;
  notionalPayout: string;
}

interface PhaseData {
  trigger: string;
  strikes: StrikeData[];
  exit: string;
  maxPayout: string;
}

interface PerilData {
  phases: PhaseData[];
}

const QuickTool = () => {
  // Extract cover name from URL params
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const coverName = queryParams.get('cover') || "No cover selected";
  
  // Peril types dropdown
  const perilTypes = ["Rainfall", "Humidity", "Max Temp", "Min Temp", "Max Windspeed", "Min Windspeed"];
  const [selectedPerilType, setSelectedPerilType] = useState<string>(perilTypes[0]);

  // Template options
  const templateOptions = [
    "Rice Template 2023", 
    "Wheat Template 2023", 
    "Cotton Template 2023", 
    "Maize Template 2023",
    "Soybean Template 2023",
    "Pulses Template 2023"
  ];
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  // Form state
  const [numPerils, setNumPerils] = useState<number>(1);
  const [numPhases, setNumPhases] = useState<number>(3);
  const [numStrikes, setNumStrikes] = useState<number>(2);
  const [sameStrikeValues, setSameStrikeValues] = useState<boolean>(false);
  const [sameStrikesAcrossPerils, setSameStrikesAcrossPerils] = useState<boolean>(false);
  const [perils, setPerils] = useState<PerilData[]>([]);

  // Initialize form data when configuration changes
  useEffect(() => {
    const newPerils: PerilData[] = [];
    
    for (let perilIndex = 0; perilIndex < numPerils; perilIndex++) {
      const phases: PhaseData[] = [];
      
      for (let phaseIndex = 0; phaseIndex < numPhases; phaseIndex++) {
        // For phases after the first one, when sameStrikeValues is true, don't show strike fields
        const shouldShowStrikes = !sameStrikeValues || phaseIndex === 0;
        
        // For perils after the first one, when sameStrikesAcrossPerils is true, don't show strike fields
        const shouldShowPerilStrikes = !sameStrikesAcrossPerils || perilIndex === 0;
        
        const strikes: StrikeData[] = [];
        
        if (shouldShowStrikes && shouldShowPerilStrikes) {
          for (let strikeIndex = 0; strikeIndex < numStrikes; strikeIndex++) {
            strikes.push({
              strike: '',
              notionalPayout: ''
            });
          }
        }
        
        phases.push({
          trigger: '',
          strikes,
          exit: shouldShowStrikes && shouldShowPerilStrikes ? '' : '',
          maxPayout: shouldShowPerilStrikes ? '' : ''
        });
      }
      
      newPerils.push({ phases });
    }
    
    setPerils(newPerils);
  }, [numPerils, numPhases, numStrikes, sameStrikeValues, sameStrikesAcrossPerils]);

  // Handle value changes
  const handlePhaseInputChange = (
    perilIndex: number,
    phaseIndex: number,
    field: keyof PhaseData,
    value: string
  ) => {
    const updatedPerils = [...perils];
    
    if (field !== 'strikes') {
      // @ts-ignore - we know the field exists
      updatedPerils[perilIndex].phases[phaseIndex][field] = value;
    }
    
    setPerils(updatedPerils);
  };

  const handleStrikeInputChange = (
    perilIndex: number,
    phaseIndex: number,
    strikeIndex: number,
    field: keyof StrikeData,
    value: string
  ) => {
    const updatedPerils = [...perils];
    updatedPerils[perilIndex].phases[phaseIndex].strikes[strikeIndex][field] = value;
    setPerils(updatedPerils);
  };

  // Handle checkbox changes
  const handleSameStrikeValuesChange = (checked: boolean) => {
    setSameStrikeValues(checked);
  };

  const handleSameStrikesAcrossPerilsChange = (checked: boolean) => {
    setSameStrikesAcrossPerils(checked);
  };

  // Handle template selection
  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-500 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold">Quick Tool</h1>
        </div>

        <div className="bg-white p-6 rounded-b-lg shadow-md">
          <div className="mb-6 bg-blue-50 p-3 rounded-md">
            <h2 className="text-xl font-medium text-blue-800">Selected Cover:</h2>
            <p className="text-lg">{decodeURIComponent(coverName)}</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Quick Tool</h2>
              <div className="flex items-center space-x-2">
                <Label htmlFor="perilType" className="text-sm">Peril:</Label>
                <Select value={selectedPerilType} onValueChange={setSelectedPerilType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select peril" />
                  </SelectTrigger>
                  <SelectContent>
                    {perilTypes.map((peril) => (
                      <SelectItem key={peril} value={peril}>{peril}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-1/3">
                <Label htmlFor="numPerils" className="text-sm font-medium mb-1 block">Number of Perils</Label>
                <select 
                  id="numPerils"
                  value={numPerils}
                  onChange={(e) => setNumPerils(Number(e.target.value))}
                  className="w-full border rounded p-1 text-sm h-8"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>

              <div className="w-1/3">
                <Label htmlFor="numPhases" className="text-sm font-medium mb-1 block">Number of Phases</Label>
                <select 
                  id="numPhases"
                  value={numPhases}
                  onChange={(e) => setNumPhases(Number(e.target.value))}
                  className="w-full border rounded p-1 text-sm h-8"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="w-1/3">
                <Label htmlFor="numStrikes" className="text-sm font-medium mb-1 block">Number of Strikes</Label>
                <select 
                  id="numStrikes"
                  value={numStrikes}
                  onChange={(e) => setNumStrikes(Number(e.target.value))}
                  className="w-full border rounded p-1 text-sm h-8"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6 flex-wrap">
              {numPerils > 1 && (
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sameStrikesAcrossPerils"
                    checked={sameStrikesAcrossPerils}
                    onCheckedChange={handleSameStrikesAcrossPerilsChange}
                  />
                  <label 
                    htmlFor="sameStrikesAcrossPerils" 
                    className="text-sm font-medium cursor-pointer"
                  >
                    Check against the same strike across perils
                  </label>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sameStrikeValues"
                  checked={sameStrikeValues}
                  onCheckedChange={handleSameStrikeValuesChange}
                />
                <label 
                  htmlFor="sameStrikeValues" 
                  className="text-sm font-medium cursor-pointer"
                >
                  Same strike values covering all phases collectively
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <Button className="bg-green-500 hover:bg-green-600">
                Save as Template
              </Button>
              
              <div className="flex items-center gap-2 border rounded p-1 bg-white">
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger className="w-64 border-0 p-1 h-7">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templateOptions.map((template) => (
                      <SelectItem key={template} value={template}>{template}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button className="bg-cyan-500 hover:bg-cyan-600 h-7 py-0">
                  Load from Template
                </Button>
              </div>
            </div>
          </div>

          {perils.map((peril, perilIndex) => (
            <div key={perilIndex} className="mb-8">
              {numPerils > 1 && (
                <h3 className="text-lg font-semibold mb-4 bg-gray-100 p-2 rounded">Peril {perilIndex + 1}</h3>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 mb-2">
                  {Array.from({ length: numPhases }).map((_, phaseIndex) => (
                    <div key={phaseIndex} className="border rounded-md p-3">
                      <h4 className="font-medium mb-3">Phase {phaseIndex + 1}</h4>
                      
                      <div className="mb-3">
                        <Label className="text-xs mb-1 block">Phase Trigger</Label>
                        <Input
                          type="text"
                          value={peril.phases[phaseIndex]?.trigger || ''}
                          onChange={(e) => handlePhaseInputChange(perilIndex, phaseIndex, 'trigger', e.target.value)}
                          className="h-7 text-sm w-24"
                          placeholder="e.g. 24°C"
                        />
                      </div>

                      {/* Only show strikes for first phase if sameStrikeValues is true */}
                      {/* Or only show for first peril if sameStrikesAcrossPerils is true */}
                      {(!sameStrikeValues || phaseIndex === 0) && 
                       (!sameStrikesAcrossPerils || perilIndex === 0) && (
                        <>
                          <div className="mb-3">
                            <Label className="text-xs mb-1 block">Strikes</Label>
                            <div className="flex flex-wrap gap-2">
                              {Array.from({ length: numStrikes }).map((_, strikeIndex) => (
                                <Input
                                  key={strikeIndex}
                                  type="text"
                                  value={peril.phases[phaseIndex]?.strikes[strikeIndex]?.strike || ''}
                                  onChange={(e) => handleStrikeInputChange(perilIndex, phaseIndex, strikeIndex, 'strike', e.target.value)}
                                  className="h-7 text-sm w-16"
                                  placeholder={`Strike ${strikeIndex + 1}`}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="mb-3">
                            <Label className="text-xs mb-1 block">Notional Payouts</Label>
                            <div className="flex flex-wrap gap-2">
                              {Array.from({ length: numStrikes }).map((_, strikeIndex) => (
                                <Input
                                  key={strikeIndex}
                                  type="text"
                                  value={peril.phases[phaseIndex]?.strikes[strikeIndex]?.notionalPayout || ''}
                                  onChange={(e) => handleStrikeInputChange(perilIndex, phaseIndex, strikeIndex, 'notionalPayout', e.target.value)}
                                  className="h-7 text-sm w-16"
                                  placeholder={`Payout ${strikeIndex + 1}`}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="mb-3">
                            <Label className="text-xs mb-1 block">Exit (°C)</Label>
                            <Input
                              type="text"
                              value={peril.phases[phaseIndex]?.exit || ''}
                              onChange={(e) => handlePhaseInputChange(perilIndex, phaseIndex, 'exit', e.target.value)}
                              className="h-7 text-sm w-24"
                              placeholder="e.g. 30"
                            />
                          </div>
                        </>
                      )}

                      {!sameStrikesAcrossPerils || perilIndex === 0 ? (
                        <div className="mb-3">
                          <Label className="text-xs mb-1 block">Maximum Payout per Ha. (Rs.)</Label>
                          <Input
                            type="text"
                            value={peril.phases[phaseIndex]?.maxPayout || ''}
                            onChange={(e) => handlePhaseInputChange(perilIndex, phaseIndex, 'maxPayout', e.target.value)}
                            className="h-7 text-sm w-24"
                            placeholder="e.g. 5000"
                          />
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="mt-8">
            <div className="flex justify-center space-x-4 mb-6">
              <Button className="bg-blue-600 hover:bg-blue-700">Save to Project</Button>
              <Button className="bg-green-600 hover:bg-green-700">View Saved List</Button>
              <Button className="bg-red-600 hover:bg-red-700">Clear Project</Button>
              <Button className="bg-gray-600 hover:bg-gray-700">Download TERM Input Template Sheet</Button>
            </div>

            <div className="text-center text-gray-700 mb-6">
              <p>Please review the downloaded files and change the dates/values as per term sheet.</p>
            </div>

            <div className="flex justify-end">
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => navigate('/burn-cost')}>
                Go to Burncost
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickTool;
