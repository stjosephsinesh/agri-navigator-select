import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, Search, FileText, Cloud, AlertTriangle, Shield, Settings } from 'lucide-react';
import CustomCoverManager from '@/components/CustomCoverManager';

const CoverSelection = () => {
  const [selectedCovers, setSelectedCovers] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    rainfall: false,
    temperature: false,
    multiplePerils: false,
    otherCovers: false,
    customCovers: false
  });
  const [showCustomCoverManager, setShowCustomCoverManager] = useState(false);
  const [showCopyTemplates, setShowCopyTemplates] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const rainfallCovers = ['Deficit Rainfall', 'Excess Rainfall', 'Consecutive Dry Days', 'Rainfall Distribution'];
  const temperatureCovers = ['High Temperature', 'Low Temperature', 'Temperature Index'];
  const multiplePerilsCovers = ['Weather Index', 'Crop Loss', 'Yield Protection'];
  const otherCovers = ['Frost', 'Hail', 'Wind Speed', 'Humidity'];
  const customCovers = ['Custom Cover 1', 'Custom Cover 2', 'Custom Cover 3'];

  const templateProjects = [
    { name: 'Rajasthan Kharif 2023', covers: 12 },
    { name: 'Punjab Rabi 2023', covers: 8 },
    { name: 'Maharashtra Cotton 2023', covers: 15 },
    { name: 'Gujarat Groundnut 2023', covers: 10 }
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleCover = (cover: string) => {
    setSelectedCovers(prev => 
      prev.includes(cover) 
        ? prev.filter(c => c !== cover)
        : [...prev, cover]
    );
  };

  const handleCoverClick = (cover: string) => {
    window.open('/quick-tool', '_blank');
    if (!selectedCovers.includes(cover)) {
      setSelectedCovers(prev => [...prev, cover]);
    }
  };

  const getSelectedCountForSection = (covers: string[]) => {
    return covers.filter(cover => selectedCovers.includes(cover)).length;
  };

  const uncheckAllInSection = (covers: string[]) => {
    setSelectedCovers(prev => prev.filter(cover => !covers.includes(cover)));
  };

  const filteredCustomCovers = customCovers.filter(cover => 
    cover.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCoverSection = (
    title: string, 
    icon: React.ReactNode, 
    covers: string[], 
    sectionKey: string
  ) => {
    const selectedCount = getSelectedCountForSection(covers);
    const isExpanded = expandedSections[sectionKey];

    return (
      <div className="border border-gray-200 rounded-lg mb-4">
        <div 
          className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center gap-3">
            {icon}
            <span className="font-medium text-gray-700">{title}</span>
            {selectedCount > 0 && (
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                {selectedCount} selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                uncheckAllInSection(covers);
              }}
              className="text-xs"
            >
              Uncheck All
            </Button>
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {covers.map((cover) => (
                <div 
                  key={cover}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => handleCoverClick(cover)}
                >
                  <Checkbox
                    checked={selectedCovers.includes(cover)}
                    onChange={() => toggleCover(cover)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm text-gray-700">{cover}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-teal-600 text-white p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold">Cover Selection</h1>
      </div>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <div className="flex gap-4 mb-6">
          <Button 
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => {
              setSelectedCovers(['Deficit Rainfall', 'High Temperature', 'Crop Loss']);
            }}
          >
            Auto Load
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowCopyTemplates(true)}
          >
            Copy Templates
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowCustomCoverManager(true)}
          >
            Manage
          </Button>
        </div>

        {renderCoverSection(
          'Rainfall',
          <Cloud className="w-5 h-5 text-blue-500" />,
          rainfallCovers,
          'rainfall'
        )}

        {renderCoverSection(
          'Temperature',
          <FileText className="w-5 h-5 text-red-500" />,
          temperatureCovers,
          'temperature'
        )}

        {renderCoverSection(
          'Multiple Perils',
          <AlertTriangle className="w-5 h-5 text-orange-500" />,
          multiplePerilsCovers,
          'multiplePerils'
        )}

        {renderCoverSection(
          'Other Covers',
          <Shield className="w-5 h-5 text-green-500" />,
          otherCovers,
          'otherCovers'
        )}

        <div className="border border-gray-200 rounded-lg mb-4">
          <div 
            className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
            onClick={() => toggleSection('customCovers')}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-gray-700">Custom Covers</span>
              {getSelectedCountForSection(filteredCustomCovers) > 0 && (
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                  {getSelectedCountForSection(filteredCustomCovers)} selected
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  uncheckAllInSection(filteredCustomCovers);
                }}
                className="text-xs"
              >
                Uncheck All
              </Button>
              {expandedSections.customCovers ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>
          </div>
          
          {expandedSections.customCovers && (
            <div className="p-4 border-t border-gray-200">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search custom covers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCustomCovers.map((cover) => (
                  <div 
                    key={cover}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => handleCoverClick(cover)}
                  >
                    <Checkbox
                      checked={selectedCovers.includes(cover)}
                      onChange={() => toggleCover(cover)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-sm text-gray-700">{cover}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedCovers.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">Selected Covers ({selectedCovers.length})</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCovers.map(cover => (
                <span 
                  key={cover}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {cover}
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedCovers.length > 0 && (
          <div className="flex justify-end mt-6">
            <Button className="bg-teal-600 hover:bg-teal-700">
              Proceed with Selected Covers
            </Button>
          </div>
        )}

        <CustomCoverManager 
          isOpen={showCustomCoverManager}
          onClose={() => setShowCustomCoverManager(false)}
        />

        <Dialog open={showCopyTemplates} onOpenChange={setShowCopyTemplates}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Copy Templates</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templateProjects.map((project, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <p className="text-gray-600">{project.covers} covers</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {
                        setSelectedCovers(prev => [...prev, `Template from ${project.name}`]);
                        setShowCopyTemplates(false);
                      }}
                    >
                      Copy Template
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CoverSelection;
