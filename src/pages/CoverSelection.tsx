
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
    rainfall: true,
    temperature: true,
    multiplePeril: true,
    otherCovers: true,
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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => toggleSection(sectionKey)}
        className={`w-full flex items-center justify-between p-4 ${bgColor} hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-center">
          <span className="text-2xl mr-3">{icon}</span>
          <span className="font-semibold text-lg">{title}</span>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>
      
      {expandedSections[sectionKey] && (
        <div className="p-4 bg-white">
          {covers.map((cover, index) => (
            <div
              key={index}
              className={`flex items-center p-3 border rounded mb-2 last:mb-0 hover:bg-gray-50 transition-colors ${
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
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">Cover Selection</h1>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
            Copy Templates
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Checkbox id="autoLoad" className="mr-3" />
            <label htmlFor="autoLoad" className="text-base">
              Auto load the previous template selections for district-crop combo.
            </label>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-gray-700">Select cover options for your crop.</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
            'bg-orange-100'
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
        </div>

        {/* Custom Covers Section */}
        <div className="border rounded-lg overflow-hidden mb-8">
          <button
            onClick={() => toggleSection('customCovers')}
            className="w-full flex items-center justify-between p-4 bg-gray-100 hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚙️</span>
              <span className="font-semibold text-lg">Custom Covers</span>
            </div>
            {expandedSections.customCovers ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          
          {expandedSections.customCovers && (
            <div className="p-4 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <Button 
                  onClick={() => setManageDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
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
              
              {filteredCustomCovers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No custom covers created yet.</p>
              ) : (
                filteredCustomCovers.map((cover, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-3 border rounded mb-2 last:mb-0 hover:bg-gray-50 transition-colors ${
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
          )}
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
                    onClick={() => handleCoverSelect(coverName)}
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
    </div>
  );
};

export default CoverSelection;
