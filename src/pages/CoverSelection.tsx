
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
import { ChevronDown, ChevronRight, Settings } from 'lucide-react';
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

const standardCovers: Cover[] = [
  { name: 'Rice Cover 2023', description: 'Standard cover for rice crops in 2023.', isMultiPeril: false },
  { name: 'Wheat Cover 2023', description: 'Standard cover for wheat crops in 2023.', isMultiPeril: false },
  { name: 'Cotton Cover 2023', description: 'Standard cover for cotton crops in 2023.', isMultiPeril: false },
  { name: 'Maize Cover 2023', description: 'Standard cover for maize crops in 2023.', isMultiPeril: false },
  { name: 'Soybean Cover 2023', description: 'Standard cover for soybean crops in 2023.', isMultiPeril: false },
  { name: 'Pulses Cover 2023', description: 'Standard cover for pulses crops in 2023.', isMultiPeril: false },
  { name: 'Multi-Peril Cover 2023', description: 'Multi-peril cover for various crops in 2023.', isMultiPeril: true },
];

const templateCovers: Cover[] = [
  { name: 'Rice Template 2023', description: 'Template cover for rice crops in 2023.' },
  { name: 'Wheat Template 2023', description: 'Template cover for wheat crops in 2023.' },
  { name: 'Cotton Template 2023', description: 'Template cover for cotton crops in 2023.' },
];

const CoverSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMultiPeril, setFilterMultiPeril] = useState(false);
  const [customCovers, setCustomCovers] = useState<Cover[]>([]);
  const [highlightedCover, setHighlightedCover] = useState<string | null>(null);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    standardCovers: true,
    customCovers: true,
    templateCovers: false,
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

  const handleCoverSelect = (coverName: string, isMultiPeril = false) => {
    navigate(`/quick-tool?cover=${encodeURIComponent(coverName)}&multiPeril=${isMultiPeril}`);
  };

  const filteredStandardCovers = standardCovers.filter(cover =>
    cover.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!filterMultiPeril || cover.isMultiPeril === filterMultiPeril)
  );

  const filteredTemplateCovers = templateCovers.filter(cover =>
    cover.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-500 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold">Cover Selection</h1>
        </div>

        <div className="bg-white p-6 rounded-b-lg shadow-md">
          <div className="mb-6">
            <Input
              type="search"
              placeholder="Search covers..."
              className="w-full mb-3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="filterMultiPeril"
                checked={filterMultiPeril}
                onCheckedChange={(checked) => setFilterMultiPeril(!!checked)}
              />
              <label
                htmlFor="filterMultiPeril"
                className="text-sm font-medium cursor-pointer"
              >
                Multi-Peril Only
              </label>
            </div>
          </div>

          <div className="space-y-4">
            {/* Standard Covers */}
            <Collapsible open={expandedSections.standardCovers} onOpenChange={(open) => setExpandedSections(prev => ({...prev, standardCovers: open}))}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between bg-green-100 p-3 rounded-md hover:bg-green-200 transition-colors">
                  <h3 className="text-lg font-semibold flex items-center">
                    Standard Covers
                    <span className="ml-2 bg-green-600 text-white text-sm px-2 py-1 rounded">
                      {standardCovers.length}
                    </span>
                  </h3>
                  {expandedSections.standardCovers ? <ChevronDown /> : <ChevronRight />}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-3 space-y-2">
                  {filteredStandardCovers.map((cover, index) => (
                    <div
                      key={index}
                      className={`p-3 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100 transition-colors ${
                        highlightedCover === cover.name ? 'ring-2 ring-blue-400 bg-blue-50' : ''
                      }`}
                      onClick={() => handleCoverSelect(cover.name, cover.isMultiPeril)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{cover.name}</p>
                          <p className="text-sm text-gray-600">{cover.description}</p>
                          {cover.isMultiPeril && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">Multi-Peril</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Custom Covers */}
            <Collapsible open={expandedSections.customCovers} onOpenChange={(open) => setExpandedSections(prev => ({...prev, customCovers: open}))}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between bg-blue-100 p-3 rounded-md hover:bg-blue-200 transition-colors">
                  <h3 className="text-lg font-semibold flex items-center">
                    Custom Covers
                    <span className="ml-2 bg-blue-600 text-white text-sm px-2 py-1 rounded">
                      {customCovers.length}
                    </span>
                  </h3>
                  {expandedSections.customCovers ? <ChevronDown /> : <ChevronRight />}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-3">
                  <div className="mb-3">
                    <Button 
                      onClick={() => setManageDialogOpen(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {customCovers.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No custom covers created yet.</p>
                    ) : (
                      customCovers.map((cover, index) => (
                        <div
                          key={index}
                          className={`p-3 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100 transition-colors ${
                            highlightedCover === cover.name ? 'ring-2 ring-blue-400 bg-blue-50' : ''
                          }`}
                          onClick={() => handleCoverSelect(cover.name)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{cover.name}</p>
                              <p className="text-sm text-gray-600">{cover.description}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Template Covers */}
            <Collapsible open={expandedSections.templateCovers} onOpenChange={(open) => setExpandedSections(prev => ({...prev, templateCovers: open}))}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between bg-yellow-100 p-3 rounded-md hover:bg-yellow-200 transition-colors">
                  <h3 className="text-lg font-semibold flex items-center">
                    Template Covers
                    <span className="ml-2 bg-yellow-600 text-white text-sm px-2 py-1 rounded">
                      {templateCovers.length}
                    </span>
                  </h3>
                  {expandedSections.templateCovers ? <ChevronDown /> : <ChevronRight />}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-3 space-y-2">
                  {filteredTemplateCovers.map((cover, index) => (
                    <div
                      key={index}
                      className={`p-3 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100 transition-colors ${
                        highlightedCover === cover.name ? 'ring-2 ring-blue-400 bg-blue-50' : ''
                      }`}
                      onClick={() => handleCoverSelect(cover.name)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{cover.name}</p>
                          <p className="text-sm text-gray-600">{cover.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
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
