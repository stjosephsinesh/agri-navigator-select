
import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

const CoverSelection = () => {
  const [selectedCovers, setSelectedCovers] = useState<Record<string, string[]>>({
    rainfall: [],
    temperature: [],
    otherCovers: [],
    customCovers: []
  });
  const [searchQuery, setSearchQuery] = useState('');
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

  const openCoverInQuickTool = (cover: string) => {
    // Open in new tab
    const newWindow = window.open('/quick-tool?cover=' + encodeURIComponent(cover), '_blank');
    newWindow?.focus();
  };

  const filterCustomCovers = () => {
    if (!searchQuery) return coverCategories.customCovers;
    return coverCategories.customCovers.filter(cover => 
      cover.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
              <div className="bg-teal-200 p-4 rounded-lg">
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
            <Checkbox id="autoLoad" />
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
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          openCoverInQuickTool(cover);
                        }}
                      >
                        Open
                      </Button>
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
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          openCoverInQuickTool(cover);
                        }}
                      >
                        Open
                      </Button>
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
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          openCoverInQuickTool(cover);
                        }}
                      >
                        Open
                      </Button>
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
                      <Button size="sm" variant="outline" className="h-7 text-xs flex items-center gap-1">
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
                  {filterCustomCovers().map((cover) => (
                    <div 
                      key={cover} 
                      className="flex items-center gap-2 hover:bg-gray-100 rounded p-1 cursor-pointer"
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
                          onClick={() => openCoverInQuickTool(cover)}
                        >
                          Open
                        </Button>
                        <Button size="sm" variant="ghost" className="text-blue-500 p-1 h-7">
                          <Edit size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500 p-1 h-7">
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default CoverSelection;
