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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomCoverManager from '@/components/CustomCoverManager';

interface StrikeData {
  strike: string;
  notionalPayout: string;
}

interface PhaseData {
  trigger: string;
  trigger2: string;
  operator: string;
  strikeOperator: string;
  strikes: StrikeData[];
  exit: string;
  maxPayout: string;
  coveragePeriodFrom: string;
  coveragePeriodTo: string;
}

interface PerilData {
  phases: PhaseData[];
}

const QuickTool = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const coverName = queryParams.get('cover') || "No cover selected";
  const isMultiPeril = queryParams.get('multiPeril') === 'true';
  
  const perilTypes = ["Rainfall", "Humidity", "Max Temp", "Min Temp", "Max Windspeed", "Min Windspeed"];
  const [selectedPerilType, setSelectedPerilType] = useState<string>(perilTypes[0]);

  const operators = ["<=", "<", "=", ">", ">=", "between"];
  
  const templateOptions = [
    "Rice Template 2023", 
    "Wheat Template 2023", 
    "Cotton Template 2023", 
    "Maize Template 2023",
    "Soybean Template 2023",
    "Pulses Template 2023"
  ];
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  
  const [calculationMethod, setCalculationMethod] = useState<string>("Rate");
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [numTriggerBoxes, setNumTriggerBoxes] = useState<number>(1);
  const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set());
  
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newCoverName, setNewCoverName] = useState("");

  const [numPhases, setNumPhases] = useState<number>(3);
  const [numStrikes, setNumStrikes] = useState<number>(2);
  const [sameStrikeValues, setSameStrikeValues] = useState<boolean>(false);
  const [sameStrikeBothPerils, setSameStrikeBothPerils] = useState<boolean>(false);
  const [perils, setPerils] = useState<PerilData[]>([{ phases: [] }]);

  const [perilCollapseStates, setPerilCollapseStates] = useState<boolean[]>([true, true]);

  useEffect(() => {
    const newPerils: PerilData[] = [];
    
    const perilCount = isMultiPeril ? 2 : 1;
    
    for (let perilIndex = 0; perilIndex < perilCount; perilIndex++) {
      const phases: PhaseData[] = [];
      
      if (perilIndex === 1 && sameStrikeBothPerils) {
        for (let phaseIndex = 0; phaseIndex < numPhases; phaseIndex++) {
          phases.push({
            trigger: '',
            trigger2: '',
            operator: operators[0],
            strikeOperator: operators[0],
            strikes: [],
            exit: '',
            maxPayout: '',
            coveragePeriodFrom: '',
            coveragePeriodTo: ''
          });
        }
      } else {
        for (let phaseIndex = 0; phaseIndex < numPhases; phaseIndex++) {
          const shouldShowStrikes = !sameStrikeValues || phaseIndex === 0;
          
          const strikes: StrikeData[] = [];
          
          if (shouldShowStrikes) {
            for (let strikeIndex = 0; strikeIndex < numStrikes; strikeIndex++) {
              strikes.push({
                strike: '',
                notionalPayout: ''
              });
            }
          }
          
          phases.push({
            trigger: '',
            trigger2: '',
            operator: operators[0],
            strikeOperator: operators[0],
            strikes,
            exit: shouldShowStrikes ? '' : '',
            maxPayout: '',
            coveragePeriodFrom: '',
            coveragePeriodTo: ''
          });
        }
      }
      
      newPerils.push({ phases });
    }
    
    setPerils(newPerils);
  }, [numPhases, numStrikes, sameStrikeValues, sameStrikeBothPerils, isMultiPeril, operators]);

  const handlePhaseInputChange = (
    perilIndex: number,
    phaseIndex: number,
    field: keyof PhaseData,
    value: string | string[]
  ) => {
    const updatedPerils = [...perils];
    
    if (field !== 'strikes') {
      // @ts-ignore
      updatedPerils[perilIndex].phases[phaseIndex][field] = value;
    }
    
    setPerils(updatedPerils);
    
    const fieldKey = `${perilIndex}-${phaseIndex}-${field}`;
    setHighlightedFields(prev => new Set(prev).add(fieldKey));
    
    setTimeout(() => {
      setHighlightedFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldKey);
        return newSet;
      });
    }, 3000);
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
    
    const fieldKey = `${perilIndex}-${phaseIndex}-strike-${strikeIndex}-${field}`;
    setHighlightedFields(prev => new Set(prev).add(fieldKey));
    
    setTimeout(() => {
      setHighlightedFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldKey);
        return newSet;
      });
    }, 3000);
  };

  const handleSameStrikeValuesChange = (checked: boolean) => {
    setSameStrikeValues(checked);
  };

  const handleSameStrikeBothPerilsChange = (checked: boolean) => {
    setSameStrikeBothPerils(checked);
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
  };

  const handleSaveAsNewCover = () => {
    setSaveDialogOpen(true);
  };

  const handleSaveNewCover = () => {
    console.log(`Saving new cover: ${newCoverName}`, perils);
    setSaveDialogOpen(false);
    setNewCoverName("");
  };

  const togglePerilCollapse = (perilIndex: number) => {
    setPerilCollapseStates(prev => {
      const newStates = [...prev];
      newStates[perilIndex] = !newStates[perilIndex];
      return newStates;
    });
  };

  const getFieldHighlight = (fieldKey: string) => {
    return highlightedFields.has(fieldKey) ? "ring-2 ring-yellow-400 bg-yellow-50" : "";
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
              <div className="flex items-center space-x-4">
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
                <div className="flex items-center space-x-2">
                  <Label htmlFor="calculationMethod" className="text-sm">Method:</Label>
                  <Select value={calculationMethod} onValueChange={setCalculationMethod}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rate">Rate</SelectItem>
                      <SelectItem value="Benefit">Benefit</SelectItem>
                      <SelectItem value="Combo">Combo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="numPhases" className="text-sm font-medium mb-1 block">Number of Phases</Label>
                <select 
                  id="numPhases"
                  value={numPhases}
                  onChange={(e) => setNumPhases(Number(e.target.value))}
                  className="w-full border rounded p-2 text-sm h-9"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="numStrikes" className="text-sm font-medium mb-1 block">Number of Strikes</Label>
                <select 
                  id="numStrikes"
                  value={numStrikes}
                  onChange={(e) => setNumStrikes(Number(e.target.value))}
                  className="w-full border rounded p-2 text-sm h-9"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center mb-6">
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
                  Same Strike Across All Phases
                </label>
              </div>
            </div>

            {isMultiPeril && (
              <div className="flex items-center mb-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sameStrikeBothPerils"
                    checked={sameStrikeBothPerils}
                    onCheckedChange={handleSameStrikeBothPerilsChange}
                  />
                  <label 
                    htmlFor="sameStrikeBothPerils" 
                    className="text-sm font-medium cursor-pointer"
                  >
                    Same strike value for both perils
                  </label>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <Button className="bg-green-500 hover:bg-green-600">
                Save as Template
              </Button>
              
              <Button 
                onClick={handleSaveAsNewCover}
                className="bg-amber-500 hover:bg-amber-600"
              >
                Save as New Cover
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
              {isMultiPeril ? (
                <Collapsible 
                  open={perilCollapseStates[perilIndex]} 
                  onOpenChange={() => togglePerilCollapse(perilIndex)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between bg-blue-100 p-3 rounded-md hover:bg-blue-200 transition-colors">
                      <h3 className="text-lg font-semibold">
                        Peril {perilIndex + 1}
                      </h3>
                      {perilCollapseStates[perilIndex] ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        {Array.from({ length: numPhases }).map((_, phaseIndex) => (
                          <div key={phaseIndex} className="border rounded-md p-3">
                            <h4 className="font-medium mb-3">Phase {phaseIndex + 1}</h4>
                            
                            <div className="mb-3">
                              <Label className="text-xs mb-1 block">Coverage Period</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="text"
                                  value={peril.phases[phaseIndex]?.coveragePeriodFrom || ''}
                                  onChange={(e) => handlePhaseInputChange(perilIndex, phaseIndex, 'coveragePeriodFrom', e.target.value)}
                                  className={`h-7 text-sm w-20 ${getFieldHighlight(`${perilIndex}-${phaseIndex}-coveragePeriodFrom`)}`}
                                  placeholder="From"
                                />
                                <Input
                                  type="text"
                                  value={peril.phases[phaseIndex]?.coveragePeriodTo || ''}
                                  onChange={(e) => handlePhaseInputChange(perilIndex, phaseIndex, 'coveragePeriodTo', e.target.value)}
                                  className={`h-7 text-sm w-20 ${getFieldHighlight(`${perilIndex}-${phaseIndex}-coveragePeriodTo`)}`}
                                  placeholder="To"
                                />
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <Label className="text-xs mb-1 block">Phase Triggers</Label>
                              <div className="space-y-1">
                                {Array.from({ length: numTriggerBoxes }).map((_, triggerIndex) => (
                                  <div key={triggerIndex} className="flex gap-1">
                                    <Input
                                      type="text"
                                      value={triggerIndex === 0 ? (peril.phases[phaseIndex]?.trigger || '') : (peril.phases[phaseIndex]?.trigger2 || '')}
                                      onChange={(e) => handlePhaseInputChange(perilIndex, phaseIndex, triggerIndex === 0 ? 'trigger' : 'trigger2', e.target.value)}
                                      className={`h-7 text-sm w-16 ${getFieldHighlight(`${perilIndex}-${phaseIndex}-trigger${triggerIndex + 1}`)}`}
                                      placeholder={`T${triggerIndex + 1}`}
                                    />
                                    <Select 
                                      value={peril.phases[phaseIndex]?.operator || operators[0]}
                                      onValueChange={(value) => handlePhaseInputChange(perilIndex, phaseIndex, 'operator', value)}
                                    >
                                      <SelectTrigger className="h-7 text-sm w-16">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {operators.map((op) => (
                                          <SelectItem key={op} value={op}>{op}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {(!sameStrikeValues || phaseIndex === 0) && (
                              <>
                                <div className="mb-3">
                                  <Label className="text-xs mb-1 block">Strike Operator</Label>
                                  <Select 
                                    value={peril.phases[phaseIndex]?.strikeOperator || operators[0]}
                                    onValueChange={(value) => handlePhaseInputChange(perilIndex, phaseIndex, 'strikeOperator', value)}
                                  >
                                    <SelectTrigger className="h-7 text-sm w-20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {operators.map((op) => (
                                        <SelectItem key={op} value={op}>{op}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="mb-3">
                                  <Label className="text-xs mb-1 block">Strikes</Label>
                                  <div className="flex flex-wrap gap-2">
                                    {Array.from({ length: numStrikes }).map((_, strikeIndex) => (
                                      <Input
                                        key={strikeIndex}
                                        type="text"
                                        value={peril.phases[phaseIndex]?.strikes[strikeIndex]?.strike || ''}
                                        onChange={(e) => handleStrikeInputChange(perilIndex, phaseIndex, strikeIndex, 'strike', e.target.value)}
                                        className={`h-7 text-sm w-16 ${getFieldHighlight(`${perilIndex}-${phaseIndex}-strike-${strikeIndex}-strike`)}`}
                                        placeholder={`S${strikeIndex + 1}`}
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
                                        className={`h-7 text-sm w-16 ${getFieldHighlight(`${perilIndex}-${phaseIndex}-strike-${strikeIndex}-notionalPayout`)}`}
                                        placeholder={`P${strikeIndex + 1}`}
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
                                    className={`h-7 text-sm w-24 ${getFieldHighlight(`${perilIndex}-${phaseIndex}-exit`)}`}
                                    placeholder="e.g. 30"
                                  />
                                </div>
                              </>
                            )}

                            <div className="mb-3">
                              <Label className="text-xs mb-1 block">Maximum Payout per Ha. (Rs.)</Label>
                              <Input
                                type="text"
                                value={peril.phases[phaseIndex]?.maxPayout || ''}
                                onChange={(e) => handlePhaseInputChange(perilIndex, phaseIndex, 'maxPayout', e.target.value)}
                                className={`h-7 text-sm w-24 ${getFieldHighlight(`${perilIndex}-${phaseIndex}-maxPayout`)}`}
                                placeholder="e.g. 5000"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    {Array.from({ length: numPhases }).map((_, phaseIndex) => (
                      <div key={phaseIndex} className="border rounded-md p-3">
                        <h4 className="font-medium mb-3">Phase {phaseIndex + 1}</h4>
                        
                        <div className="mb-3">
                          <Label className="text-xs mb-1 block">Coverage Period</Label>
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              value={peril.phases[phaseIndex]?.coveragePeriodFrom || ''}
                              onChange={(e) => handlePhaseInputChange(0, phaseIndex, 'coveragePeriodFrom', e.target.value)}
                              className={`h-7 text-sm w-20 ${getFieldHighlight(`0-${phaseIndex}-coveragePeriodFrom`)}`}
                              placeholder="From"
                            />
                            <Input
                              type="text"
                              value={peril.phases[phaseIndex]?.coveragePeriodTo || ''}
                              onChange={(e) => handlePhaseInputChange(0, phaseIndex, 'coveragePeriodTo', e.target.value)}
                              className={`h-7 text-sm w-20 ${getFieldHighlight(`0-${phaseIndex}-coveragePeriodTo`)}`}
                              placeholder="To"
                            />
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <Label className="text-xs mb-1 block">Phase Triggers</Label>
                          <div className="space-y-1">
                            {Array.from({ length: numTriggerBoxes }).map((_, triggerIndex) => (
                              <div key={triggerIndex} className="flex gap-1">
                                <Input
                                  type="text"
                                  value={triggerIndex === 0 ? (peril.phases[phaseIndex]?.trigger || '') : (peril.phases[phaseIndex]?.trigger2 || '')}
                                  onChange={(e) => handlePhaseInputChange(0, phaseIndex, triggerIndex === 0 ? 'trigger' : 'trigger2', e.target.value)}
                                  className={`h-7 text-sm w-16 ${getFieldHighlight(`0-${phaseIndex}-trigger${triggerIndex + 1}`)}`}
                                  placeholder={`T${triggerIndex + 1}`}
                                />
                                <Select 
                                  value={peril.phases[phaseIndex]?.operator || operators[0]}
                                  onValueChange={(value) => handlePhaseInputChange(0, phaseIndex, 'operator', value)}
                                >
                                  <SelectTrigger className="h-7 text-sm w-16">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {operators.map((op) => (
                                      <SelectItem key={op} value={op}>{op}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            ))}
                          </div>
                        </div>

                        {(!sameStrikeValues || phaseIndex === 0) && (
                          <>
                            <div className="mb-3">
                              <Label className="text-xs mb-1 block">Strike Operator</Label>
                              <Select 
                                value={peril.phases[phaseIndex]?.strikeOperator || operators[0]}
                                onValueChange={(value) => handlePhaseInputChange(0, phaseIndex, 'strikeOperator', value)}
                              >
                                <SelectTrigger className="h-7 text-sm w-20">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {operators.map((op) => (
                                    <SelectItem key={op} value={op}>{op}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="mb-3">
                              <Label className="text-xs mb-1 block">Strikes</Label>
                              <div className="flex flex-wrap gap-2">
                                {Array.from({ length: numStrikes }).map((_, strikeIndex) => (
                                  <Input
                                    key={strikeIndex}
                                    type="text"
                                    value={peril.phases[phaseIndex]?.strikes[strikeIndex]?.strike || ''}
                                    onChange={(e) => handleStrikeInputChange(0, phaseIndex, strikeIndex, 'strike', e.target.value)}
                                    className={`h-7 text-sm w-16 ${getFieldHighlight(`0-${phaseIndex}-strike-${strikeIndex}-strike`)}`}
                                    placeholder={`S${strikeIndex + 1}`}
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
                                    onChange={(e) => handleStrikeInputChange(0, phaseIndex, strikeIndex, 'notionalPayout', e.target.value)}
                                    className={`h-7 text-sm w-16 ${getFieldHighlight(`0-${phaseIndex}-strike-${strikeIndex}-notionalPayout`)}`}
                                    placeholder={`P${strikeIndex + 1}`}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="mb-3">
                              <Label className="text-xs mb-1 block">Exit (°C)</Label>
                              <Input
                                type="text"
                                value={peril.phases[phaseIndex]?.exit || ''}
                                onChange={(e) => handlePhaseInputChange(0, phaseIndex, 'exit', e.target.value)}
                                className={`h-7 text-sm w-24 ${getFieldHighlight(`0-${phaseIndex}-exit`)}`}
                                placeholder="e.g. 30"
                              />
                            </div>
                          </>
                        )}

                        <div className="mb-3">
                          <Label className="text-xs mb-1 block">Maximum Payout per Ha. (Rs.)</Label>
                          <Input
                            type="text"
                            value={peril.phases[phaseIndex]?.maxPayout || ''}
                            onChange={(e) => handlePhaseInputChange(0, phaseIndex, 'maxPayout', e.target.value)}
                            className={`h-7 text-sm w-24 ${getFieldHighlight(`0-${phaseIndex}-maxPayout`)}`}
                            placeholder="e.g. 5000"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save as New Cover</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Cover Name
              </Label>
              <Input
                id="name"
                value={newCoverName}
                onChange={(e) => setNewCoverName(e.target.value)}
                className="col-span-3"
                placeholder="Enter new cover name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSaveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleSaveNewCover}
              disabled={!newCoverName.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuickTool;
