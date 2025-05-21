
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const ProjectInfo = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<string>('');
  const [projectYear, setProjectYear] = useState<string>('');
  const [season, setSeason] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [projectType, setProjectType] = useState<string>('underwriting');
  const [templateDataType, setTemplateDataType] = useState<string>('fullData');
  const [useOldTemplate, setUseOldTemplate] = useState<boolean>(false);
  
  const states = [
    "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", 
    "Telangana", "Uttar Pradesh", "West Bengal"
  ];

  const years = ['2023', '2024', '2025', '2026'];
  
  const handleContinue = () => {
    navigate('/weather-data');
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">Project Information</h1>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Project Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="project-year">Project Year</Label>
                  <Select value={projectYear} onValueChange={setProjectYear}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Project Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="season">Season</Label>
                  <Select value={season} onValueChange={setSeason}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Season" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rabi">Rabi</SelectItem>
                      <SelectItem value="kharif">Kharif</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description">Project Description</Label>
                  <Input 
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter project description"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">Project Type</h2>
              <RadioGroup value={projectType} onValueChange={setProjectType} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="underwriting" id="underwriting" />
                  <Label htmlFor="underwriting">Underwriting</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="claim" id="claim" />
                  <Label htmlFor="claim">Claim</Label>
                </div>
              </RadioGroup>

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3">Template File Data Type</h2>
                <RadioGroup value={templateDataType} onValueChange={setTemplateDataType} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fullData" id="fullData" />
                    <Label htmlFor="fullData">Full Data - any existing data will be overwritten with uploaded data.</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="appendData" id="appendData" />
                    <Label htmlFor="appendData">Append Data - copy data from previous project and add uploaded data.</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3">Use Old Template Data</h2>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="copyTermSheets"
                    checked={useOldTemplate}
                    onCheckedChange={(checked) => setUseOldTemplate(checked as boolean)}
                  />
                  <Label htmlFor="copyTermSheets">Copy term sheets from previous project</Label>
                </div>
              </div>

              {(templateDataType === 'appendData' || useOldTemplate) && (
                <div className="mt-4">
                  <Label htmlFor="previous-term-sheet">Select Previous Term Sheet</Label>
                  <div className="space-y-4 mt-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Previous Term Sheet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sheet1">Term Sheet 2023 - Rabi</SelectItem>
                        <SelectItem value="sheet2">Term Sheet 2023 - Kharif</SelectItem>
                        <SelectItem value="sheet3">Term Sheet 2022 - Rabi</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>State</Label>
                        <Select disabled>
                          <SelectTrigger>
                            <SelectValue placeholder="Kerala" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kerala">Kerala</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Project Year</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Project Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map(year => (
                              <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Date of Creation</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Date of Creation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="date1">01/01/2023</SelectItem>
                            <SelectItem value="date2">15/02/2023</SelectItem>
                            <SelectItem value="date3">10/03/2023</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Project Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Underwriting" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="underwriting">Underwriting</SelectItem>
                            <SelectItem value="claim">Claim</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleContinue}
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
