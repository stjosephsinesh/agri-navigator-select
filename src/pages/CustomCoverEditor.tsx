
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowLeft, Save, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface CustomCover {
  id: string;
  name: string;
  description: string;
  phases: number;
  conditionOperator: string;
  payoutType1: string;
  payoutType2: string;
  numberOfPerils: number;
  perils: {
    id: number;
    type: string;
    coverDefinitions: {
      type: string;
      parameter: string;
      operator: string;
    }[];
  }[];
  actions: {
    A: string;
    B: string;
    C: string;
  };
}

const CustomCoverEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editCoverName = queryParams.get('edit');
  const isEditing = !!editCoverName;
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const [coverData, setCoverData] = useState<CustomCover>({
    id: '',
    name: '',
    description: '',
    phases: 1,
    conditionOperator: 'A',
    payoutType1: 'Rate',
    payoutType2: 'Single',
    numberOfPerils: 1,
    perils: [
      {
        id: 1,
        type: 'Maximum Temperature',
        coverDefinitions: [
          { type: 'Absolute value', parameter: 'Trigger1', operator: '<' },
          { type: 'No. Consecutive days', parameter: 'Strike1', operator: '>=' },
          { type: 'Select', parameter: 'Select', operator: 'Select' }
        ]
      }
    ],
    actions: {
      A: 'Select',
      B: 'Select',
      C: 'Select'
    }
  });

  // Generate conditional operators based on number of perils
  const getConditionalOperators = (perilCount: number) => {
    switch (perilCount) {
      case 1:
        return ['A'];
      case 2:
        return ['A and B', 'A or B'];
      case 3:
        return [
          'A and (B or C)',
          'A or (B and C)',
          '(A and B) or C',
          '(A or B) and C',
          'A or B or C',
          'A and B and C'
        ];
      default:
        return ['A'];
    }
  };

  // Update perils when numberOfPerils changes
  useEffect(() => {
    const currentPerilCount = coverData.perils.length;
    const newPerilCount = coverData.numberOfPerils;
    
    if (currentPerilCount !== newPerilCount) {
      const perilTypes = ['Maximum Temperature', 'Minimum Temperature', 'Humidity', 'Rainfall', 'Wind Speed'];
      
      if (newPerilCount > currentPerilCount) {
        // Add new perils
        const newPerils = [...coverData.perils];
        for (let i = currentPerilCount; i < newPerilCount; i++) {
          newPerils.push({
            id: i + 1,
            type: perilTypes[i % perilTypes.length],
            coverDefinitions: [
              { type: 'Absolute value', parameter: `Trigger${i + 1}`, operator: '<' },
              { type: 'No. Consecutive days', parameter: 'Strike1', operator: '>=' },
              { type: 'Select', parameter: 'Select', operator: 'Select' }
            ]
          });
        }
        setCoverData(prev => ({ ...prev, perils: newPerils }));
      } else {
        // Remove excess perils
        setCoverData(prev => ({ 
          ...prev, 
          perils: prev.perils.slice(0, newPerilCount) 
        }));
      }
      
      // Update conditional operator to first available option
      const operators = getConditionalOperators(newPerilCount);
      setCoverData(prev => ({ 
        ...prev, 
        conditionOperator: operators[0] 
      }));
    }
  }, [coverData.numberOfPerils]);

  // Load existing cover data if editing
  useEffect(() => {
    if (isEditing && editCoverName) {
      setCoverData(prev => ({
        ...prev,
        id: editCoverName,
        name: editCoverName,
        description: `Description for ${editCoverName}`
      }));
    }
  }, [isEditing, editCoverName]);

  const handleInputChange = (field: keyof CustomCover, value: any) => {
    setCoverData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePerilChange = (perilIndex: number, field: string, value: string) => {
    setCoverData(prev => ({
      ...prev,
      perils: prev.perils.map((peril, index) => 
        index === perilIndex 
          ? { ...peril, [field]: value }
          : peril
      )
    }));
  };

  const handleCoverDefinitionChange = (perilIndex: number, defIndex: number, field: string, value: string) => {
    setCoverData(prev => ({
      ...prev,
      perils: prev.perils.map((peril, pIndex) => 
        pIndex === perilIndex 
          ? {
              ...peril,
              coverDefinitions: peril.coverDefinitions.map((def, dIndex) =>
                dIndex === defIndex ? { ...def, [field]: value } : def
              )
            }
          : peril
      )
    }));
  };

  const handleActionChange = (action: 'A' | 'B' | 'C', value: string) => {
    setCoverData(prev => ({
      ...prev,
      actions: {
        ...prev.actions,
        [action]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving cover:', coverData);
    
    // Store the cover in localStorage to simulate saving
    const existingCovers = JSON.parse(localStorage.getItem('customCovers') || '[]');
    const updatedCovers = isEditing 
      ? existingCovers.map((cover: any) => cover.name === editCoverName ? coverData : cover)
      : [...existingCovers, coverData];
    
    localStorage.setItem('customCovers', JSON.stringify(updatedCovers));
    
    // Show save confirmation
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 2000);
  };

  const handleGoBack = () => {
    navigate(`/cover-selection?highlight=${encodeURIComponent(coverData.name)}`);
  };

  const coverDefinitionTypes = ['Absolute value', 'No. Consecutive days', 'Select'];
  const parameterOptions = ['Trigger1', 'Trigger2', 'Strike1', 'Select'];
  const operatorOptions = ['<', '<=', '=', '>', '>=', 'Select'];
  const perilTypes = ['Maximum Temperature', 'Minimum Temperature', 'Humidity', 'Rainfall', 'Wind Speed'];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Save Confirmation */}
      {showSaveConfirmation && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <Check size={20} />
          Cover saved successfully!
        </div>
      )}

      <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Custom Cover' : 'Create New Custom Cover'}
        </h1>
        <div className="flex gap-2">
          <Button 
            onClick={handleGoBack}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Go Back
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <Save size={16} /> Save Cover
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md space-y-6">
        {/* Header Information */}
        <div className="bg-sky-100 p-4 rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label className="block mb-2 font-medium text-sm">Cover Name</Label>
                <Input
                  value={coverData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter cover name"
                  className="w-full h-9"
                />
              </div>
              
              <div>
                <Label className="block mb-2 font-medium text-sm">Cover Description</Label>
                <Textarea
                  value={coverData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter cover description"
                  className="w-full h-20 resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="block mb-2 font-medium text-sm">Phases</Label>
                  <Input
                    type="number"
                    value={coverData.phases}
                    onChange={(e) => handleInputChange('phases', parseInt(e.target.value))}
                    min="1"
                    max="5"
                    className="w-full h-9"
                  />
                </div>
                
                <div>
                  <Label className="block mb-2 font-medium text-sm">Number of Perils</Label>
                  <Select value={coverData.numberOfPerils.toString()} onValueChange={(value) => handleInputChange('numberOfPerils', parseInt(value))}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label className="block mb-2 font-medium text-sm">Condition Operator</Label>
                <Select value={coverData.conditionOperator} onValueChange={(value) => handleInputChange('conditionOperator', value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getConditionalOperators(coverData.numberOfPerils).map(operator => (
                      <SelectItem key={operator} value={operator}>{operator}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block mb-2 font-medium text-sm">Rate / Benefit</Label>
                <Select value={coverData.payoutType1} onValueChange={(value) => handleInputChange('payoutType1', value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rate">Rate</SelectItem>
                    <SelectItem value="Benefit">Benefit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block mb-2 font-medium text-sm">Single / Multiple</Label>
                <Select value={coverData.payoutType2} onValueChange={(value) => handleInputChange('payoutType2', value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Multiple">Multiple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Perils Section */}
        <div className="space-y-4">
          {coverData.perils.map((peril, perilIndex) => (
            <div key={peril.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-800">Peril {peril.id}</h3>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-4 gap-3 mb-4 text-sm">
                  <div>
                    <Label className="block mb-2 font-medium text-sm">Peril Type</Label>
                    <Select value={peril.type} onValueChange={(value) => handlePerilChange(perilIndex, 'type', value)}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {perilTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="font-medium text-center flex items-end pb-2">Cover Definition</div>
                  <div className="font-medium text-center flex items-end pb-2">Parameter</div>
                  <div className="font-medium text-center flex items-end pb-2">Operator</div>
                </div>
                
                {peril.coverDefinitions.map((def, defIndex) => (
                  <div key={defIndex} className="grid grid-cols-4 gap-3 mb-3">
                    <div></div>
                    <div>
                      <Select 
                        value={def.type} 
                        onValueChange={(value) => handleCoverDefinitionChange(perilIndex, defIndex, 'type', value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {coverDefinitionTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select 
                        value={def.parameter} 
                        onValueChange={(value) => handleCoverDefinitionChange(perilIndex, defIndex, 'parameter', value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {parameterOptions.map(param => (
                            <SelectItem key={param} value={param}>{param}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select 
                        value={def.operator} 
                        onValueChange={(value) => handleCoverDefinitionChange(perilIndex, defIndex, 'operator', value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {operatorOptions.map(op => (
                            <SelectItem key={op} value={op}>{op}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-base">Then</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 text-sm font-medium">A =</span>
                  <Select value={coverData.actions.A} onValueChange={(value) => handleActionChange('A', value)}>
                    <SelectTrigger className="flex-1 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Select">Select</SelectItem>
                      <SelectItem value="Action 1">Action 1</SelectItem>
                      <SelectItem value="Action 2">Action 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {coverData.numberOfPerils >= 2 && (
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-sm font-medium">B =</span>
                    <Select value={coverData.actions.B} onValueChange={(value) => handleActionChange('B', value)}>
                      <SelectTrigger className="flex-1 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Select">Select</SelectItem>
                        <SelectItem value="Action 1">Action 1</SelectItem>
                        <SelectItem value="Action 2">Action 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-600">of A</span>
                  </div>
                )}
                {coverData.numberOfPerils >= 3 && (
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-sm font-medium">C =</span>
                    <Select value={coverData.actions.C} onValueChange={(value) => handleActionChange('C', value)}>
                      <SelectTrigger className="flex-1 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Select">Select</SelectItem>
                        <SelectItem value="Action 1">Action 1</SelectItem>
                        <SelectItem value="Action 2">Action 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-600">of B</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-base">Action</h3>
              <div className="text-sm text-gray-600">
                Configure the actions that will be triggered based on the peril conditions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCoverEditor;
