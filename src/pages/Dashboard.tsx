import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllProjects, setShowAllProjects] = useState(false);
  
  // Extended list of projects for the "View more" functionality
  const allProjects = [
    { name: "Rice - Kerala 2023", lastUpdated: "May 19, 2023" },
    { name: "Wheat - Punjab 2023", lastUpdated: "April 12, 2023" },
    { name: "Cotton - Gujarat 2023", lastUpdated: "March 30, 2023" },
    { name: "Sugarcane - Maharashtra 2023", lastUpdated: "March 15, 2023" },
    { name: "Soybean - Madhya Pradesh 2023", lastUpdated: "February 28, 2023" },
    { name: "Corn - Karnataka 2023", lastUpdated: "February 20, 2023" },
    { name: "Barley - Rajasthan 2023", lastUpdated: "February 10, 2023" },
    { name: "Groundnut - Andhra Pradesh 2023", lastUpdated: "January 25, 2023" },
  ];

  const recentProjects = allProjects.slice(0, 3);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome to RWBCIS Dashboard.</p>
      
      <div className="flex justify-between items-center mb-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <RadioGroup defaultValue="underwriting" className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="underwriting" id="underwriting" />
                  <Label htmlFor="underwriting">Underwriting</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="claim" id="claim" />
                  <Label htmlFor="claim">Claim</Label>
                </div>
              </RadioGroup>
              
              <div>
                <Label htmlFor="created-by">Created by</Label>
                <Input 
                  id="created-by" 
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <Label htmlFor="project-description">Project Description</Label>
                <Textarea 
                  id="project-description" 
                  placeholder="Add a description for this project"
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => navigate('/project-info')}>Create Project</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            type="search" 
            placeholder="Search recent projects..." 
            className="pl-8 w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Recent Projects</h2>
          <div className="space-y-2">
            {recentProjects.map((project, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded border border-gray-100 cursor-pointer hover:bg-gray-100">
                <p className="font-medium">{project.name}</p>
                <p className="text-sm text-gray-500">Last updated: {project.lastUpdated}</p>
              </div>
            ))}
          </div>
          
          <Dialog open={showAllProjects} onOpenChange={setShowAllProjects}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-4">
                View more
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[600px]">
              <DialogHeader>
                <DialogTitle>All Recent Projects</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {allProjects.map((project, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-gray-50 rounded border border-gray-100 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setShowAllProjects(false);
                      navigate('/project-info');
                    }}
                  >
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-gray-500">Last updated: {project.lastUpdated}</p>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-600">Total Projects</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-green-600">Active Projects</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <p className="text-sm text-yellow-600">Weather Stations</p>
              <p className="text-2xl font-bold">450</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-sm text-purple-600">Total Covers</p>
              <p className="text-2xl font-bold">87</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate('/project-info')}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
