
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Plus, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CustomCover {
  id: string;
  name: string;
  description: string;
  phases: number;
  conditionOperator: string;
  payoutType1: string;
  payoutType2: string;
  numberOfPerils: number;
}

interface CoverDefinition {
  type: string;
  parameter: string;
  operator: string;
}

interface Peril {
  id: number;
  type: string;
  coverDefinitions: CoverDefinition[];
}

interface GuidedCoverData {
  name: string;
  description: string;
  numberOfPerils: number;
  conditionOperator: string;
  perilTypes: string[];
  payoutType: string;
  perils: Peril[];
  actions: {
    A: string;
    B: string;
    C: string;
  };
}

const CustomCoverManager = () => {
  const navigate = useNavigate();
  const [customCovers, setCustomCovers] = useState<CustomCover[]>([]);
  const [guidedDialogOpen, setGuidedDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [guidedData, setGuidedData] = useState<GuidedCoverData>({
    name: '',
    description: '',
    numberOfPerils: 1,
    conditionOperator: 'A',
    perilTypes: [''],
    payoutType: 'Single',
    perils: [],
    actions: {
      A: 'Select',
      B: 'Select',
      C: 'Select'
    }
  });

  useEffect(() => {
    const savedCovers = JSON.parse(localStorage.getItem('customCovers') || '[]');
    setCustomCovers(savedCovers);
  }, []);

  const handleEditCover = (coverName: string) => {
    navigate(`/custom-cover-editor?edit=${encodeURIComponent(coverName)}`);
  };

  const handleCreateNewCover = () => {
    navigate('/custom-cover-editor');
  };

  const resetGuidedData = () => {
    setGuidedData({
      name: '',
      description: '',
      numberOfPerils: 1,
      conditionOperator: 'A',
      perilTypes: [''],
      payoutType: 'Single',
      perils: [],
      actions: {
        A: 'Select',
        B: 'Select',
        C: 'Select'
      }
    });
    setCurrentStep(1);
  };

  const handleGuidedNext = () => {
    if (currentStep < getTotalSteps()) {
      setCurrentStep(currentStep + 1);
      
      // Initialize data based on current step
      if (currentStep === 3 && guidedData.numberOfPerils === 1) {
        // Skip condition operator step if only 1 peril
        setCurrentStep(currentStep + 2);
        setGuidedData(prev => ({ ...prev, conditionOperator: 'A' }));
      } else if (currentStep === 5) {
        // Initialize peril types array
        const newPerilTypes = Array(guidedData.numberOfPerils).fill('');
        setGuidedData(prev => ({ ...prev, perilTypes: newPerilTypes }));
      } else if (currentStep === 7) {
        // Initialize perils with cover definitions
        const newPerils = Array(guidedData.numberOfPerils).fill(0).map((_, index) => ({
          id: index + 1,
          type: guidedData.perilTypes[index] || '',
          coverDefinitions: [
            { type: 'Select', parameter: 'Select', operator: 'Select' },
            { type: 'Select', parameter: 'Select', operator: 'Select' },
            { type: 'Select', parameter: 'Select', operator: 'Select' }
          ]
        }));
        setGuidedData(prev => ({ ...prev, perils: newPerils }));
      }
    } else {
      // Final step - create the cover
      saveCover();
    }
  };

  const handleGuidedBack = () => {
    if (currentStep > 1) {
      if (currentStep === 5 && guidedData.numberOfPerils === 1) {
        // Skip condition operator step when going back if only 1 peril
        setCurrentStep(currentStep - 2);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const getTotalSteps = () => {
    return guidedData.numberOfPerils === 1 ? 8 : 9; // Skip condition operator if 1 peril
  };

  const saveCover = () => {
    const newCover = {
      id: Date.now().toString(),
      name: guidedData.name,
      description: guidedData.description,
      phases: 1,
      conditionOperator: guidedData.conditionOperator,
      payoutType1: 'Rate',
      payoutType2: guidedData.payoutType,
      numberOfPerils: guidedData.numberOfPerils,
      perils: guidedData.perils,
      actions: guidedData.actions
    };

    const existingCovers = JSON.parse(localStorage.getItem('customCovers') || '[]');
    const updatedCovers = [...existingCovers, newCover];
    localStorage.setItem('customCovers', JSON.stringify(updatedCovers));
    
    setGuidedDialogOpen(false);
    resetGuidedData();
    
    // Navigate to edit the newly created cover
    navigate(`/custom-cover-editor?edit=${encodeURIComponent(newCover.name)}`);
  };

  const updatePerilType = (index: number, type: string) => {
    const newPerilTypes = [...guidedData.perilTypes];
    newPerilTypes[index] = type;
    setGuidedData(prev => ({ ...prev, perilTypes: newPerilTypes }));
  };

  const updatePerilCoverDefinition = (perilIndex: number, defIndex: number, field: string, value: string) => {
    const newPerils = [...guidedData.perils];
    newPerils[perilIndex].coverDefinitions[defIndex] = {
      ...newPerils[perilIndex].coverDefinitions[defIndex],
      [field]: value
    };
    setGuidedData(prev => ({ ...prev, perils: newPerils }));
  };

  const updateAction = (action: string, value: string) => {
    setGuidedData(prev => ({
      ...prev,
      actions: { ...prev.actions, [action]: value }
    }));
  };

  const renderGuidedStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="guided-name">Cover Name</Label>
              <Input
                id="guided-name"
                value={guidedData.name}
                onChange={(e) => setGuidedData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter cover name"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="guided-description">Cover Description</Label>
              <Textarea
                id="guided-description"
                value={guidedData.description}
                onChange={(e) => setGuidedData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this cover protects against"
                className="h-24"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="guided-perils">Number of Perils</Label>
              <Select 
                value={guidedData.numberOfPerils.toString()} 
                onValueChange={(value) => setGuidedData(prev => ({ ...prev, numberOfPerils: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Peril</SelectItem>
                  <SelectItem value="2">2 Perils</SelectItem>
                  <SelectItem value="3">3 Perils</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Condition Operator</Label>
              <Select 
                value={guidedData.conditionOperator} 
                onValueChange={(value) => setGuidedData(prev => ({ ...prev, conditionOperator: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="A and B">A and B</SelectItem>
                  <SelectItem value="A or B">A or B</SelectItem>
                  <SelectItem value="A and B and C">A and B and C</SelectItem>
                  <SelectItem value="A or B or C">A or B or C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label>Peril Types</Label>
              <div className="space-y-3">
                {Array.from({ length: guidedData.numberOfPerils }).map((_, index) => (
                  <div key={index}>
                    <Label className="text-sm">Peril {index + 1}</Label>
                    <Select 
                      value={guidedData.perilTypes[index] || ''} 
                      onValueChange={(value) => updatePerilType(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select peril ${index + 1} type`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Max Temperature">Max Temperature</SelectItem>
                        <SelectItem value="Min Temperature">Min Temperature</SelectItem>
                        <SelectItem value="Rainfall">Rainfall</SelectItem>
                        <SelectItem value="Humidity">Humidity</SelectItem>
                        <SelectItem value="Wind Speed">Wind Speed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <div>
              <Label>Payout Type</Label>
              <Select 
                value={guidedData.payoutType} 
                onValueChange={(value) => setGuidedData(prev => ({ ...prev, payoutType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Multiple">Multiple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-medium">Cover Definitions</Label>
              {guidedData.perils.map((peril, perilIndex) => (
                <div key={peril.id} className="mt-4 p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Peril {peril.id}: {peril.type}</h4>
                  <div className="space-y-3">
                    {peril.coverDefinitions.map((def, defIndex) => (
                      <div key={defIndex} className="grid grid-cols-3 gap-2">
                        <Select 
                          value={def.type} 
                          onValueChange={(value) => updatePerilCoverDefinition(perilIndex, defIndex, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Absolute value">Absolute value</SelectItem>
                            <SelectItem value="No. Consecutive days">No. Consecutive days</SelectItem>
                            <SelectItem value="Percentile">Percentile</SelectItem>
                            <SelectItem value="Select">Select</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select 
                          value={def.parameter} 
                          onValueChange={(value) => updatePerilCoverDefinition(perilIndex, defIndex, 'parameter', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Parameter" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Trigger1">Trigger1</SelectItem>
                            <SelectItem value="Strike1">Strike1</SelectItem>
                            <SelectItem value="Exit1">Exit1</SelectItem>
                            <SelectItem value="Select">Select</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select 
                          value={def.operator} 
                          onValueChange={(value) => updatePerilCoverDefinition(perilIndex, defIndex, 'operator', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Operator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="<"><</SelectItem>
                            <SelectItem value=">">></SelectItem>
                            <SelectItem value=">=">=</SelectItem>
                            <SelectItem value="<=">=</SelectItem>
                            <SelectItem value="=">=</SelectItem>
                            <SelectItem value="Select">Select</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-medium">Actions</Label>
              <div className="space-y-3 mt-3">
                {Object.entries(guidedData.actions).map(([action, value]) => (
                  <div key={action} className="flex items-center gap-3">
                    <Label className="w-8">{action} =</Label>
                    <Select 
                      value={value} 
                      onValueChange={(newValue) => updateAction(action, newValue)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Select">Select</SelectItem>
                        <SelectItem value="Payout">Payout</SelectItem>
                        <SelectItem value="No Payout">No Payout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-4">Review and Save</h3>
              <p className="text-gray-600 mb-4">
                Your custom cover "{guidedData.name}" is ready to be created.
              </p>
              <p className="text-sm text-gray-500">
                Click "Save Cover" to create it and open it in the custom cover editor.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Step 1: Cover Name';
      case 2: return 'Step 2: Description';
      case 3: return 'Step 3: Number of Perils';
      case 4: return 'Step 4: Condition Operator';
      case 5: return 'Step 5: Define Peril Types';
      case 6: return 'Step 6: Payout Type';
      case 7: return 'Step 7: Cover Definitions';
      case 8: return 'Step 8: Actions';
      case 9: return 'Step 9: Save Cover';
      default: return '';
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return guidedData.name.trim() !== '';
      case 2: return guidedData.description.trim() !== '';
      case 3: return guidedData.numberOfPerils > 0;
      case 4: return guidedData.conditionOperator !== '';
      case 5: return guidedData.perilTypes.every(type => type.trim() !== '');
      case 6: return guidedData.payoutType !== '';
      case 7: return guidedData.perils.every(peril => 
        peril.coverDefinitions.every(def => 
          def.type !== 'Select' && def.parameter !== 'Select' && def.operator !== 'Select'
        )
      );
      case 8: return Object.values(guidedData.actions).every(action => action !== 'Select');
      case 9: return true;
      default: return false;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Custom Cover Management</h3>
        <div className="flex gap-2">
          <Button onClick={handleCreateNewCover} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create New Cover
          </Button>
          <Dialog open={guidedDialogOpen} onOpenChange={(open) => {
            setGuidedDialogOpen(open);
            if (!open) resetGuidedData();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Wand2 className="h-4 w-4 mr-2" />
                Guided Creation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{getStepTitle()}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {renderGuidedStep()}
              </div>
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleGuidedBack}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleGuidedNext}
                  disabled={!canProceed()}
                >
                  {currentStep === getTotalSteps() ? 'Save Cover' : 'Next'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-2">
        {customCovers.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No custom covers created yet.</p>
        ) : (
          customCovers.map((cover) => (
            <div key={cover.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
              <div>
                <p className="font-medium">{cover.name}</p>
                <p className="text-sm text-gray-600">{cover.description}</p>
              </div>
              <Button
                size="sm"
                onClick={() => handleEditCover(cover.name)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomCoverManager;
