import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Umbrella, Thermometer, Check, Search, Plus, Edit, Trash, Copy } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const CoverSelection = () => {
  const [selectedCovers, setSelectedCovers] = useState<Record<string, string[]>>({
    rainfall: [],
    temperature: [],
    otherCovers: [],
    customCovers: [],
    multiplePeril: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [autoLoad, setAutoLoad] = useState(false);
  const [highlightedCover, setHighlightedCover] = useState<string>('');
  const [customCovers, setCustomCovers] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Load custom covers from localStorage
  useEffect(() => {
    const savedCovers = JSON.parse(localStorage.getItem('customCovers') || '[]');
    const coverNames = savedCovers.map((cover: any) => cover.name).filter((name: string) => name);
    setCustomCovers(coverNames);
  }, [location.pathname]); // Reload when navigating back to this page
  
  // Check for highlighted cover from URL params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const highlight = queryParams.get('highlight');
    if (highlight) {
      setHighlightedCover(decodeURIComponent(highlight));
      // Clear the highlight after a few seconds
      setTimeout(() => setHighlightedCover(''), 3000);
    }
  }, [location.search]);
  
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
    multiplePeril: [
      "MPeril1 - Temperature & Rainfall",
      "MPeril2 - Temperature & Humidity",
      "MPeril3 - Rainfall & Wind"
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
        // Open the quick tool page in a new tab when a cover is selected
        openCoverInQuickTool(cover, category === 'multiplePeril');
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
    return selectedCovers[category as keyof typeof selectedCovers]?.length || 0;
  };

  const openCoverInQuickTool = (cover: string, isMultiPeril: boolean = false) => {
    // Open in new tab with query params indicating if it's multiple peril
    const queryParams = new URLSearchParams();
    queryParams.append('cover', cover);
    if (isMultiPeril) {
      queryParams.append('multiPeril', 'true');
    }
    const newWindow = window.open(`/quick-tool?${queryParams.toString()}`, '_blank');
    newWindow?.focus();
  };

  const filterCustomCovers = () => {
    if (!searchQuery) return customCovers;
    return customCovers.filter(cover => 
      cover.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get all selected covers across all categories
  const getAllSelectedCovers = () => {
    const allSelected: { category: string; cover: string }[] = [];
    Object.entries(selectedCovers).forEach(([category, covers]) => {
      covers.forEach(cover => {
        allSelected.push({ category, cover });
      });
    });
    return allSelected;
  };

  const handleNewCover = () => {
    navigate('/custom-cover-editor');
  };

  const handleEditCover = (coverName: string) => {
    navigate(`/custom-cover-editor?edit=${encodeURIComponent(coverName)}`);
  };

  const handleDeleteCover = (coverName: string) => {
    const savedCovers = JSON.parse(localStorage.getItem('customCovers') || '[]');
    const updatedCovers = savedCovers.filter((cover: any) => cover.name !== coverName);
    localStorage.setItem('customCovers', JSON.stringify(updatedCovers));
    setCustomCovers(updatedCovers.map((cover: any) => cover.name));
    
    // Remove from selected covers if it was selected
    setSelectedCovers(prev => ({
      ...prev,
      customCovers: prev.customCovers.filter(c => c !== coverName)
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cover Selection</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <Copy size={16} /> Copy Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Copy Templates</DialogTitle>
              </DialogHeader>
              <div className="bg-teal-100 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-center mb-2">From</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block mb-1">Year</label>
                        <select className="w-full border rounded p-1">
                          <option value="2021">2021</option>
                          <option value="2022">2022</option>
                          <option value="2023">2023</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1">State</label>
                        <select className="w-full border rounded p-1">
                          <option value="Kerala">Kerala</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1">District</label>
                        <select className="w-full border rounded p-1">
                          <option value="All">All</option>
                          <option value="Alappuzha">Alappuzha</option>
                          <option value="Ernakulam">Ernakulam</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1">Crop</label>
                        <select className="w-full border rounded p-1">
                          <option value="All">All</option>
                          <option value="Rice">Rice</option>
                          <option value="Wheat">Wheat</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-center mb-2">To</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block mb-1">Year</label>
                        <p className="border rounded p-1 bg-white">2023</p>
                      </div>
                      <div>
                        <label className="block mb-1">State</label>
                        <select className="w-full border rounded p-1">
                          <option value="Kerala">Kerala</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1">District</label>
                        <select className="w-full border rounded p-1 h-20" multiple>
                          <option value="Alappuzha">Alappuzha</option>
                          <option value="Ernakulam">Ernakulam</option>
                          <option value="Idukki">Idukki</option>
                          <option value="Kannur">Kannur</option>
                        </select>
                        <p className="text-xs mt-1 text-gray-600">Hold down the control (ctrl) / command button to select multiple options</p>
                      </div>
                      <div>
                        <label className="block mb-1">Crop</label>
                        <select className="w-full border rounded p-1 h-20" multiple>
                          <option value="Acid Lime">Acid Lime</option>
                          <option value="Apple">Apple</option>
                          <option value="Arecanut">Arecanut</option>
                          <option value="Ash Gourd">Ash Gourd</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button className="bg-blue-500">Copy</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="autoLoad" 
              checked={autoLoad}
              onCheckedChange={(checked) => setAutoLoad(!!checked)}
            />
            <label htmlFor="autoLoad" className="text-gray-700">
              Auto load the previous template selections for district-crop combo.
            </label>
          </div>
        </div>
        
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
                    >
                      <Checkbox
                        id={`rainfall-${cover}`}
                        checked={selectedCovers.rainfall.includes(cover)}
                        onCheckedChange={() => handleCoverToggle('rainfall', cover)}
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
                    >
                      <Checkbox
                        id={`temperature-${cover}`}
                        checked={selectedCovers.temperature.includes(cover)}
                        onCheckedChange={() => handleCoverToggle('temperature', cover)}
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
            
            <AccordionItem value="multiplePeril" className="border-0">
              <div className="bg-purple-100 rounded-t-md">
                <div className="flex justify-between items-center p-2">
                  <div className="flex items-center gap-2">
                    <Umbrella className="h-5 w-5" />
                    <AccordionTrigger className="hover:no-underline p-0 text-md font-medium">
                      Multiple Peril
                    </AccordionTrigger>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUncheckAll('multiplePeril')}
                      className="bg-white text-sm py-1 px-2 rounded border"
                    >
                      Uncheck All
                    </button>
                    <span className="text-sm">{getSelectedCount('multiplePeril')} covers selected</span>
                  </div>
                </div>
              </div>
              <AccordionContent className="mt-0 pt-0 border border-t-0 rounded-b-md">
                <div className="p-2 space-y-2">
                  {coverCategories.multiplePeril.map((cover) => (
                    <div 
                      key={cover} 
                      className="flex items-center gap-2 hover:bg-gray-100 rounded p-1 cursor-pointer"
                    >
                      <Checkbox
                        id={`multiplePeril-${cover}`}
                        checked={selectedCovers.multiplePeril.includes(cover)}
                        onCheckedChange={() => handleCoverToggle('multiplePeril', cover)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`multiplePeril-${cover}`}
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
                    >
                      <Checkbox
                        id={`otherCovers-${cover}`}
                        checked={selectedCovers.otherCovers.includes(cover)}
                        onCheckedChange={() => handleCoverToggle('otherCovers', cover)}
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
                    <div className="ml-4 flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 text-xs flex items-center gap-1"
                        onClick={handleNewCover}
                      >
                        <Plus size={14} /> New Cover
                      </Button>
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                        <Input 
                          className="h-7 text-xs pl-8 w-40" 
                          placeholder="Search covers..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
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
                  {filterCustomCovers().length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No custom covers found. Click "New Cover" to create one.
                    </div>
                  ) : (
                    filterCustomCovers().map((cover) => (
                      <div 
                        key={cover} 
                        className={`flex items-center gap-2 hover:bg-gray-100 rounded p-1 cursor-pointer ${
                          highlightedCover === cover ? 'bg-yellow-200 border-2 border-yellow-400' : ''
                        }`}
                      >
                        <Checkbox
                          id={`customCovers-${cover}`}
                          checked={selectedCovers.customCovers.includes(cover)}
                          onCheckedChange={() => handleCoverToggle('customCovers', cover)}
                          className="mr-2"
                        />
                        <label
                          htmlFor={`customCovers-${cover}`}
                          className="text-sm text-gray-700 leading-tight cursor-pointer flex-grow"
                        >
                          {cover}
                        </label>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-blue-500 p-1 h-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCover(cover);
                            }}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500 p-1 h-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCover(cover);
                            }}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Selected Covers Section */}
        <div className="mt-8 mb-6">
          <div className="bg-gray-50 border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Selected Covers</h3>
            <div className="max-h-40 overflow-y-auto">
              {getAllSelectedCovers().length === 0 ? (
                <p className="text-gray-500 text-sm">No covers selected yet</p>
              ) : (
                <div className="space-y-2">
                  {getAllSelectedCovers().map(({ category, cover }, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">{cover}</span>
                        <span className="text-xs text-gray-500 ml-2">({category})</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                        onClick={() => handleCoverToggle(category, cover)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/quick-tool')}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoverSelection;
