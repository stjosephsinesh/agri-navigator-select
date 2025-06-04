
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

interface GuidedCoverData {
  name: string;
  description: string;
  numberOfPerils: number;
  perilNames: string[];
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
    perilNames: ['']
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

  const handleGuidedNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 3) {
        // Initialize peril names array based on number of perils
        const newPerilNames = Array(guidedData.numberOfPerils).fill('').map((_, index) => 
          guidedData.perilNames[index] || `Peril ${index + 1}`
        );
        setGuidedData(prev => ({ ...prev, perilNames: newPerilNames }));
      }
    } else {
      // Final step - create the cover
      const newCover = {
        id: Date.now().toString(),
        name: guidedData.name,
        description: guidedData.description,
        phases: 1,
        conditionOperator: guidedData.numberOfPerils === 1 ? 'A' : 'A and B',
        payoutType1: 'Rate',
        payoutType2: 'Single',
        numberOfPerils: guidedData.numberOfPerils,
        perils: guidedData.perilNames.map((name, index) => ({
          id: index + 1,
          type: name,
          coverDefinitions: [
            { type: 'Absolute value', parameter: `Trigger${index + 1}`, operator: '<' },
            { type: 'No. Consecutive days', parameter: 'Strike1', operator: '>=' },
            { type: 'Select', parameter: 'Select', operator: 'Select' }
          ]
        })),
        actions: {
          A: 'Select',
          B: 'Select',
          C: 'Select'
        }
      };

      const existingCovers = JSON.parse(localStorage.getItem('customCovers') || '[]');
      const updatedCovers = [...existingCovers, newCover];
      localStorage.setItem('customCovers', JSON.stringify(updatedCovers));
      
      setGuidedDialogOpen(false);
      setCurrentStep(1);
      setGuidedData({ name: '', description: '', numberOfPerils: 1, perilNames: [''] });
      
      // Navigate to edit the newly created cover
      navigate(`/custom-cover-editor?edit=${encodeURIComponent(newCover.name)}`);
    }
  };

  const handleGuidedBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePerilName = (index: number, name: string) => {
    const newPerilNames = [...guidedData.perilNames];
    newPerilNames[index] = name;
    setGuidedData(prev => ({ ...prev, perilNames: newPerilNames }));
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
              <Label>Peril Names</Label>
              <div className="space-y-3">
                {Array.from({ length: guidedData.numberOfPerils }).map((_, index) => (
                  <Input
                    key={index}
                    value={guidedData.perilNames[index] || ''}
                    onChange={(e) => updatePerilName(index, e.target.value)}
                    placeholder={`Peril ${index + 1} name (e.g., Rainfall, Temperature)`}
                  />
                ))}
              </div>
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
      case 4: return 'Step 4: Define Peril Names';
      default: return '';
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return guidedData.name.trim() !== '';
      case 2: return guidedData.description.trim() !== '';
      case 3: return guidedData.numberOfPerils > 0;
      case 4: return guidedData.perilNames.every(name => name.trim() !== '');
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
          <Dialog open={guidedDialogOpen} onOpenChange={setGuidedDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Wand2 className="h-4 w-4 mr-2" />
                Guided Creation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
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
                  {currentStep === 4 ? 'Create Cover' : 'Next'}
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
