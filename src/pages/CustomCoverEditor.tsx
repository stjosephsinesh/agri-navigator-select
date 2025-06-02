
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
import { ArrowLeft, Save } from 'lucide-react';
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

  const [coverData, setCoverData] = useState<CustomCover>({
    id: '',
    name: '',
    description: '',
    phases: 1,
    conditionOperator: 'A and B',
    payoutType1: 'Rate',
    payoutType2: 'Single',
    numberOfPerils: 2,
    perils: [
      {
        id: 1,
        type: 'Maximum Temperature',
        coverDefinitions: [
          { type: 'Absolute value', parameter: 'Trigger1', operator: '<' },
          { type: 'No. Consecutive days', parameter: 'Strike1', operator: '>=' },
          { type: 'Select', parameter: 'Select', operator: 'Select' }
        ]
      },
      {
        id: 2,
        type: 'Humidity',
        coverDefinitions: [
          { type: 'Absolute value', parameter: 'Trigger2', operator: '>' },
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

  // Load existing cover data if editing
  useEffect(() => {
    if (isEditing && editCoverName) {
      // In a real app, this would load from a database or API
      // For now, we'll populate with default data and set the name
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
    // In a real app, this would save to a database or API
    console.log('Saving cover:', coverData);
    
    // Navigate back to cover selection with the new/edited cover name
    navigate(`/cover-selection?highlight=${encodeURIComponent(coverData.name)}`);
  };

  const handleGoBack = () => {
    navigate('/cover-selection');
  };

  const coverDefinitionTypes = ['Absolute value', 'No. Consecutive days', 'Select'];
  const parameterOptions = ['Trigger1', 'Trigger2', 'Strike1', 'Select'];
  const operatorOptions = ['<', '<=', '=', '>', '>=', 'Select'];
  const perilTypes = ['Maximum Temperature', 'Minimum Temperature', 'Humidity', 'Rainfall', 'Wind Speed'];

  return (
    <div className="p-6 max-w-6xl mx-auto">
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

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        {/* Header Information */}
        <div className="bg-sky-200 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label className="block mb-2 font-medium">Cover Name</Label>
                <Input
                  value={coverData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter cover name"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label className="block mb-2 font-medium">Cover Description</Label>
                <Textarea
                  value={coverData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter cover description"
                  className="w-full h-16"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block mb-2 font-medium">Phases</Label>
                  <Input
                    type="number"
                    value={coverData.phases}
                    onChange={(e) => handleInputChange('phases', parseInt(e.target.value))}
                    min="1"
                    max="5"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label className="block mb-2 font-medium">Condition Operator</Label>
                  <Select value={coverData.conditionOperator} onValueChange={(value) => handleInputChange('conditionOperator', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A and B">A and B</SelectItem>
                      <SelectItem value="A or B">A or B</SelectItem>
                      <SelectItem value="A and (B or C)">A and (B or C)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label className="block mb-2 font-medium">Payout Type 1 - Rate / Benefit</Label>
                <Select value={coverData.payoutType1} onValueChange={(value) => handleInputChange('payoutType1', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rate">Rate</SelectItem>
                    <SelectItem value="Benefit">Benefit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block mb-2 font-medium">Payout Type 2 - Single / Multiple</Label>
                <Select value={coverData.payoutType2} onValueChange={(value) => handleInputChange('payoutType2', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Multiple">Multiple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block mb-2 font-medium">Number of Perils</Label>
                <Select value={coverData.numberOfPerils.toString()} onValueChange={(value) => handleInputChange('numberOfPerils', parseInt(value))}>
                  <SelectTrigger>
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
        </div>

        {/* Perils Section */}
        <div className="space-y-6">
          {coverData.perils.slice(0, coverData.numberOfPerils).map((peril, perilIndex) => (
            <div key={peril.id} className="border border-gray-300 rounded-lg">
              <div className="bg-gray-100 p-3 border-b">
                <h3 className="text-lg font-semibold">Peril {peril.id}</h3>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div className="font-medium">
                    <Select value={peril.type} onValueChange={(value) => handlePerilChange(perilIndex, 'type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {perilTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="font-medium text-center">Cover Definition</div>
                  <div className="font-medium text-center">Parameter</div>
                  <div className="font-medium text-center">Operator</div>
                  <div></div>
                </div>
                
                {peril.coverDefinitions.map((def, defIndex) => (
                  <div key={defIndex} className="grid grid-cols-5 gap-4 mb-2">
                    <div></div>
                    <div>
                      <Select 
                        value={def.type} 
                        onValueChange={(value) => handleCoverDefinitionChange(perilIndex, defIndex, 'type', value)}
                      >
                        <SelectTrigger>
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
                        <SelectTrigger>
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
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {operatorOptions.map(op => (
                            <SelectItem key={op} value={op}>{op}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions Section */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Then</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-8">A =</span>
                  <Select value={coverData.actions.A} onValueChange={(value) => handleActionChange('A', value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Select">Select</SelectItem>
                      <SelectItem value="Action 1">Action 1</SelectItem>
                      <SelectItem value="Action 2">Action 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8">B =</span>
                  <Select value={coverData.actions.B} onValueChange={(value) => handleActionChange('B', value)}>
                    <SelectTrigger className="flex-1">
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
                <div className="flex items-center gap-2">
                  <span className="w-8">C =</span>
                  <Select value={coverData.actions.C} onValueChange={(value) => handleActionChange('C', value)}>
                    <SelectTrigger className="flex-1">
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
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Action</h3>
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
