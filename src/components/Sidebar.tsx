
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { title: 'Dashboard', icon: '📊', path: '/' },
    { title: 'Project Info', icon: '📝', path: '/project-info' },
    { title: 'Weather Data Input', icon: '🌤️', path: '/weather-data' },
    { title: 'Data Checks', icon: '✓', path: '/data-checks' },
    { title: 'District and Crop Selection', icon: '🌾', path: '/district-crop-selection' },
    { title: 'Cover Selection', icon: '🌿', path: '/cover-selection' },
    { title: 'Quick Tool', icon: '🔧', path: '/quick-tool' },
    { title: 'Burn Cost Calculation', icon: '💰', path: '/burn-cost' },
    { title: 'Summary', icon: '📈', path: '/summary' },
    { title: 'Users', icon: '👥', path: '/users' },
    { title: 'Help', icon: '❓', path: '/help' },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  // Function to determine if a menu item should have the completed check
  const isCompleted = (index: number, currentPath: string) => {
    // Find the index of the current active path
    const activeIndex = menuItems.findIndex(item => item.path === currentPath || 
      (currentPath.includes('?') && item.path === currentPath.split('?')[0]));
    
    // All items before the current one are considered completed
    return index < activeIndex;
  };

  return (
    <div
      className={cn(
        "h-screen bg-teal-700 text-white transition-all duration-300 flex flex-col relative",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <h2 className="text-xl font-bold">RWBCIS</h2>}
        <button 
          onClick={toggleSidebar}
          className={cn(
            "p-1 rounded hover:bg-teal-600",
            collapsed ? "mx-auto" : ""
          )}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            to={item.path}
            className={cn(
              "flex items-center p-3 hover:bg-teal-600",
              isActive(item.path) ? "bg-teal-600" : ""
            )}
          >
            <span className="mr-3">{item.icon}</span>
            {!collapsed && (
              <div className="flex justify-between items-center w-full">
                <span>{item.title}</span>
                {isCompleted(index, location.pathname) && (
                  <Check size={16} className="text-green-300" />
                )}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
