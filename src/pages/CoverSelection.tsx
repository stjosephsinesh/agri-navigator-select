
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  { name: 'MPeril1 - Temperature & Rainfall', description: 'Combined temperature and rainfall protection' },
  { name: 'MPeril2 - Temperature & Humidity', description: 'Temperature and humidity coverage' },
  { name: 'MPeril3 - Rainfall & Wind', description: 'Rainfall and wind damage protection' },
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
  const [selectedCovers, setSelectedCovers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    rainfall: false,
    temperature: false,
    multiplePeril: true,
    otherCovers: false,
    customCovers: true,
  });

  useEffect(() => {
    const savedCovers = localStorage.getItem('customCovers');
    if (savedCovers) {
      setCustomCovers(JSON.parse(savedCovers));
    }
    
    const params = new URLSearchParams(location.search);
    const highlight = params.get('highlight');
    const expand = params.get('expand');

    if (highlight) {
      setHighlightedCover(decodeURIComponent(highlight));
      setTimeout(() => {
        setHighlightedCover(null);
      }, 5000);
    }

    if (expand === 'customCovers') {
      setExpandedSections(prev => ({
        ...prev,
        customCovers: true
      }));
    }
  }, [location.search]);

  const handleCoverSelect = (coverName: string) => {
    setSelectedCovers(prev => 
      prev.includes(coverName) 
        ? prev.filter(name => name !== coverName)
        : [...prev, coverName]
    );
  };

  const handleUncheckAll = (sectionCovers: Cover[]) => {
    const coverNames = sectionCovers.map(cover => cover.name);
    setSelectedCovers(prev => prev.filter(name => !coverNames.includes(name)));
  };

  const getSelectedCount = (sectionCovers: Cover[]) => {
    const coverNames = sectionCovers.map(cover => cover.name);
    return selectedCovers.filter(name => coverNames.includes(name)).length;
  };

  const filteredCustomCovers = customCovers.filter(cover =>
    cover.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCoverSection = (
    title: string,
    icon: string,
    covers: Cover[],
    sectionKey: keyof typeof expandedSections,
    bgColor: string
  ) => (
    <Collapsible 
      open={expandedSections[sectionKey]} 
      onOpenChange={(open) => setExpandedSections(prev => ({...prev, [sectionKey]: open}))}
    >
      <CollapsibleTrigger className="w-full">
        <div className={`flex items-center justify-between p-3 rounded ${bgColor} hover:opacity-80 transition-opacity`}>
          <div className="flex items-center">
            <span className="mr-2">{icon}</span>
            <span className="font-medium">{title}</span>
            {expandedSections[sectionKey] ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleUncheckAll(covers);
              }}
            >
              Uncheck All
            </Button>
            <span className="text-sm">{getSelectedCount(covers)} covers selected</span>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 space-y-2">
          {covers.map((cover, index) => (
            <div
              key={index}
              className={`flex items-center p-3 bg-white border rounded hover:bg-gray-50 transition-colors ${
                highlightedCover === cover.name ? 'ring-2 ring-blue-400 bg-blue-50' : ''
              }`}
            >
              <Checkbox
                checked={selectedCovers.includes(cover.name)}
                onCheckedChange={() => handleCoverSelect(cover.name)}
                className="mr-3"
              />
              <div className="flex-1">
                <p className="font-medium">{cover.name}</p>
                <p className="text-sm text-gray-600">{cover.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-500 text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Cover Selection</h1>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-500">
            Copy Templates
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Checkbox id="autoLoad" className="mr-2" />
            <label htmlFor="autoLoad" className="text-sm">
              Auto load the previous template selections for district-crop combo.
            </label>
          </div>
          
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium">Select cover options for your crop.</h2>
          </div>
        </div>

        <div className="space-y-4">
          {renderCoverSection(
            'Rainfall',
            '🌧️',
            rainfallCovers,
            'rainfall',
            'bg-blue-100'
          )}

          {renderCoverSection(
            'Temperature',
            '🌡️',
            temperatureCovers,
            'temperature',
            'bg-yellow-100'
          )}

          {renderCoverSection(
            'Multiple Peril',
            '🌀',
            multiplePerilCovers,
            'multiplePeril',
            'bg-purple-100'
          )}

          {renderCoverSection(
            'Other Covers',
            '🌿',
            otherCovers,
            'otherCovers',
            'bg-green-100'
          )}

          {/* Custom Covers Section */}
          <Collapsible 
            open={expandedSections.customCovers} 
            onOpenChange={(open) => setExpandedSections(prev => ({...prev, customCovers: open}))}
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-3 rounded bg-gray-100 hover:opacity-80 transition-opacity">
                <div className="flex items-center">
                  <span className="mr-2">⚙️</span>
                  <span className="font-medium">Custom Covers</span>
                  {expandedSections.customCovers ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
                </div>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUncheckAll(filteredCustomCovers);
                    }}
                  >
                    Uncheck All
                  </Button>
                  <span className="text-sm">{getSelectedCount(filteredCustomCovers)} covers selected</span>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-3">
                  <Button 
                    onClick={() => setManageDialogOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                    size="sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                  <div className="flex-1">
                    <Input
                      type="search"
                      placeholder="Search covers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  {filteredCustomCovers.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No custom covers created yet.</p>
                  ) : (
                    filteredCustomCovers.map((cover, index) => (
                      <div
                        key={index}
                        className={`flex items-center p-3 bg-white border rounded hover:bg-gray-50 transition-colors ${
                          highlightedCover === cover.name ? 'ring-2 ring-blue-400 bg-blue-50' : ''
                        }`}
                      >
                        <Checkbox
                          checked={selectedCovers.includes(cover.name)}
                          onCheckedChange={() => handleCoverSelect(cover.name)}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{cover.name}</p>
                          <p className="text-sm text-gray-600">{cover.description}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Selected Covers Summary */}
        <div className="mt-8 bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">Selected Covers</h3>
          {selectedCovers.length === 0 ? (
            <p className="text-gray-500">No covers selected yet</p>
          ) : (
            <div className="space-y-2">
              {selectedCovers.map((coverName, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{coverName}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCoverSelect(coverName)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end mt-8">
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/quick-tool')}
          >
            Continue
          </Button>
        </div>
      </div>

      <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Custom Covers</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CustomCoverManager />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoverSelection;
