
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate, useLocation } from 'react-router-dom';
import { Settings, ChevronDown, ChevronRight, Plus, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import CustomCoverManager from '@/components/CustomCoverManager';

interface Cover {
  name: string;
  description: string;
  isMultiPeril?: boolean;
}

const rainfallCovers: Cover[] = [
  { name: 'Rainfall Cover 1', description: 'Basic rainfall protection' },
  { name: 'Rainfall Cover 2', description: 'Advanced rainfall protection' },
];

const temperatureCovers: Cover[] = [
  { name: 'Temperature Cover 1', description: 'Heat stress protection' },
  { name: 'Temperature Cover 2', description: 'Cold damage protection' },
];

const multiplePerilCovers: Cover[] = [
  { name: 'MPeril1 - Temperature & Rainfall', description: 'Combined temperature and rainfall protection', isMultiPeril: true },
  { name: 'MPeril2 - Temperature & Humidity', description: 'Temperature and humidity coverage', isMultiPeril: true },
  { name: 'MPeril3 - Rainfall & Wind', description: 'Rainfall and wind damage protection', isMultiPeril: true },
];

const otherCovers: Cover[] = [
  { name: 'Wind Cover', description: 'Wind damage protection' },
  { name: 'Hail Cover', description: 'Hail damage protection' },
];

const CoverSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [customCovers, setCustomCovers] = useState<Cover[]>([]);
  const [highlightedCover, setHighlightedCover] = useState<string | null>(null);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [copyTemplatesDialogOpen, setCopyTemplatesDialogOpen] = useState(false);
  const [selectedCovers, setSelectedCovers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoLoadEnabled, setAutoLoadEnabled] = useState(false);

  // Collapsible states - all collapsed by default
  const [rainfallOpen, setRainfallOpen] = useState(false);
  const [temperatureOpen, setTemperatureOpen] = useState(false);
  const [multiPerilOpen, setMultiPerilOpen] = useState(false);
  const [otherCoversOpen, setOtherCoversOpen] = useState(false);
  const [customCoversOpen, setCustomCoversOpen] = useState(false);

  // Copy Templates state
  const [fromYear, setFromYear] = useState('2021');
  const [toYear, setToYear] = useState('2023');
  const [fromState, setFromState] = useState('Kerala');
  const [toState, setToState] = useState('Kerala');
  const [fromDistrict, setFromDistrict] = useState('All');
  const [toDistrict, setToDistrict] = useState(['Alappuzha', 'Ernakulam', 'Idukki']);
  const [fromCrop, setFromCrop] = useState('All');
  const [toCrop, setToCrop] = useState(['Acid Lime', 'Apple', 'Arecanut']);

  const years = ['2021', '2022', '2023', '2024'];
  const states = ['Kerala', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh'];
  const districts = ['All', 'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod'];
  const crops = ['All', 'Acid Lime', 'Apple', 'Arecanut', 'Ash Gourd', 'Banana'];

  useEffect(() => {
    const savedCovers = localStorage.getItem('customCovers');
    if (savedCovers) {
      setCustomCovers(JSON.parse(savedCovers));
    }
    
    const params = new URLSearchParams(location.search);
    const highlight = params.get('highlight');

    if (highlight) {
      setHighlightedCover(decodeURIComponent(highlight));
      setTimeout(() => {
        setHighlightedCover(null);
      }, 5000);
    }
  }, [location.search]);

  const handleCoverSelect = (coverName: string, isMultiPeril: boolean = false) => {
    // Open Quick Tool in new window
    const queryParams = new URLSearchParams({
      cover: encodeURIComponent(coverName),
      multiPeril: isMultiPeril.toString()
    });
    window.open(`/quick-tool?${queryParams.toString()}`, '_blank');
    
    // Add to selected covers
    setSelectedCovers(prev => 
      prev.includes(coverName) 
        ? prev
        : [...prev, coverName]
    );
  };

  const handleAutoLoadChange = (checked: boolean) => {
    setAutoLoadEnabled(checked);
    if (checked) {
      // Auto-tick some covers based on previously saved covers
      const autoSelectedCovers = [
        'Rainfall Cover 1',
        'Temperature Cover 1',
        'MPeril1 - Temperature & Rainfall'
      ];
      setSelectedCovers(autoSelectedCovers);
    } else {
      setSelectedCovers([]);
    }
  };

  const filteredCustomCovers = customCovers.filter(cover =>
    cover.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSelectedCount = (covers: Cover[]) => {
    return covers.filter(cover => selectedCovers.includes(cover.name)).length;
  };

  const renderCollapsibleSection = (
    title: string,
    icon: string,
    covers: Cover[],
    isOpen: boolean,
    setIsOpen: (open: boolean) => void,
    bgColor: string
  ) => (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg overflow-hidden mb-2">
      <CollapsibleTrigger className={`w-full flex items-center justify-between p-4 ${bgColor} hover:opacity-90 transition-opacity`}>
        <div className="flex items-center">
          <span className="text-2xl mr-3">{icon}</span>
          <span className="font-semibold text-lg">{title}</span>
          {isOpen && getSelectedCount(covers) > 0 && (
            <span className="ml-2 text-sm text-gray-600">({getSelectedCount(covers)} covers selected)</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Uncheck all covers in this section
              const coverNames = covers.map(c => c.name);
              setSelectedCovers(prev => prev.filter(name => !coverNames.includes(name)));
            }}
            className="text-xs"
          >
            Uncheck All
          </Button>
          <span className="text-sm text-gray-600">{getSelectedCount(covers)} covers selected</span>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="p-4 bg-white">
        {covers.map((cover, index) => (
          <div
            key={index}
            className={`flex items-center p-3 border rounded mb-2 last:mb-0 hover:bg-gray-50 transition-colors cursor-pointer ${
              highlightedCover === cover.name ? 'ring-2 ring-blue-400 bg-blue-50' : ''
            }`}
            onClick={() => handleCoverSelect(cover.name, cover.isMultiPeril)}
          >
            <div className="flex-1">
              <p className="font-medium">{cover.name}</p>
              <p className="text-sm text-gray-600">{cover.description}</p>
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">Cover Selection</h1>
          <Button 
            variant="outline" 
            className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
            onClick={() => setCopyTemplatesDialogOpen(true)}
          >
            Copy Templates
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Checkbox 
              id="autoLoad" 
              className="mr-3" 
              checked={autoLoadEnabled}
              onCheckedChange={handleAutoLoadChange}
            />
            <label htmlFor="autoLoad" className="text-base">
              Auto load the previous template selections for district-crop combo.
            </label>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-gray-700">Select cover options for your crop.</h2>
          </div>
        </div>

        <div className="mb-8 space-y-2">
          {renderCollapsibleSection(
            'Rainfall',
            '🌧️',
            rainfallCovers,
            rainfallOpen,
            setRainfallOpen,
            'bg-blue-100'
          )}

          {renderCollapsibleSection(
            'Temperature',
            '🌡️',
            temperatureCovers,
            temperatureOpen,
            setTemperatureOpen,
            'bg-orange-100'
          )}

          {renderCollapsibleSection(
            'Multiple Peril',
            '🌀',
            multiplePerilCovers,
            multiPerilOpen,
            setMultiPerilOpen,
            'bg-purple-100'
          )}

          {renderCollapsibleSection(
            'Other Covers',
            '🌿',
            otherCovers,
            otherCoversOpen,
            setOtherCoversOpen,
            'bg-green-100'
          )}

          {/* Custom Covers Section */}
          <Collapsible open={customCoversOpen} onOpenChange={setCustomCoversOpen} className="border rounded-lg overflow-hidden">
            <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-gray-100 hover:opacity-90 transition-opacity">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚙️</span>
                <span className="font-semibold text-lg">Custom Covers</span>
                {customCoversOpen && getSelectedCount(filteredCustomCovers) > 0 && (
                  <span className="ml-2 text-sm text-gray-600">({getSelectedCount(filteredCustomCovers)} covers selected)</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    const coverNames = filteredCustomCovers.map(c => c.name);
                    setSelectedCovers(prev => prev.filter(name => !coverNames.includes(name)));
                  }}
                  className="text-xs"
                >
                  Uncheck All
                </Button>
                <span className="text-sm text-gray-600">{getSelectedCount(filteredCustomCovers)} covers selected</span>
                {customCoversOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="p-4 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <Button 
                  onClick={() => setManageDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
                <Button 
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Cover
                </Button>
                <div className="flex-1 relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search covers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {filteredCustomCovers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No custom covers created yet.</p>
              ) : (
                filteredCustomCovers.map((cover, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-3 border rounded mb-2 last:mb-0 hover:bg-gray-50 transition-colors cursor-pointer ${
                      highlightedCover === cover.name ? 'ring-2 ring-blue-400 bg-blue-50' : ''
                    }`}
                    onClick={() => handleCoverSelect(cover.name, cover.isMultiPeril)}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{cover.name}</p>
                      <p className="text-sm text-gray-600">{cover.description}</p>
                    </div>
                  </div>
                ))
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Selected Covers Summary */}
        <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Selected Covers Summary</h3>
          {selectedCovers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No covers selected yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedCovers.map((coverName, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
                  <span className="font-medium text-blue-800">{coverName}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCovers(prev => prev.filter(name => name !== coverName))}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
            onClick={() => navigate('/quick-tool')}
          >
            Continue
          </Button>
        </div>
      </div>

      {/* Custom Cover Manager Dialog */}
      <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Custom Covers</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CustomCoverManager />
          </div>
        </DialogContent>
      </Dialog>

      {/* Copy Templates Dialog */}
      <Dialog open={copyTemplatesDialogOpen} onOpenChange={setCopyTemplatesDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Copy Templates</DialogTitle>
          </DialogHeader>
          <div className="p-6 bg-green-50 rounded-lg">
            <div className="grid grid-cols-2 gap-8">
              {/* From Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-center">From</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fromYear">Year</Label>
                    <Select value={fromYear} onValueChange={setFromYear}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="fromState">State</Label>
                    <Select value={fromState} onValueChange={setFromState}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="fromDistrict">District</Label>
                    <Select value={fromDistrict} onValueChange={setFromDistrict}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map(district => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="fromCrop">Crop</Label>
                    <Select value={fromCrop} onValueChange={setFromCrop}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {crops.map(crop => (
                          <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* To Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-center">To</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="toYear">Year</Label>
                    <Input value={toYear} onChange={(e) => setToYear(e.target.value)} />
                  </div>
                  
                  <div>
                    <Label htmlFor="toState">State</Label>
                    <Select value={toState} onValueChange={setToState}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="toDistrict">District</Label>
                    <div className="border rounded-md p-2 bg-white max-h-32 overflow-y-auto">
                      {districts.filter(d => d !== 'All').map(district => (
                        <div key={district} className="text-sm py-1">
                          {district}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Hold down the control (ctrl) / command button to select multiple options
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="toCrop">Crop</Label>
                    <div className="border rounded-md p-2 bg-white max-h-32 overflow-y-auto">
                      {crops.filter(c => c !== 'All').map(crop => (
                        <div key={crop} className="text-sm py-1">
                          {crop}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Copy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoverSelection;
