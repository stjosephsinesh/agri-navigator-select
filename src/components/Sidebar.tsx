
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    { title: 'Weather Data Input', icon: '🌤️', path: '/weather-data' },
    { title: 'Data Checks', icon: '✓', path: '/data-checks' },
    { title: 'District and Crop Selection', icon: '🌾', path: '/district-crop-selection' },
    { title: 'Cover Selection', icon: '🌿', path: '/cover-selection' },
    { title: 'Quick Tool', icon: '🔧', path: '/quick-tool' },
    { title: 'Burn Cost Calculation', icon: '💰', path: '/burn-cost' },
    { title: 'Users', icon: '👥', path: '/users' },
    { title: 'Help', icon: '❓', path: '/help' },
  ];

  const isActive = (path: string) => location.pathname === path;

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
            {!collapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
