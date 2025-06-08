
import React from 'react';

const Help = () => {
  const helpItems = [
    { title: 'Users Guide', description: 'Comprehensive guide for using the application' },
    { title: 'Term Sheet Master Input Template', description: 'Template for term sheet master input data' },
    { title: 'Daily Data Template', description: 'Template for daily data input' },
    { title: 'Contract Data Template', description: 'Template for contract data input' },
    { title: 'Convert Daily Data to Hourly Data', description: 'Tool to convert daily data format to hourly format' },
    { title: 'States List', description: 'Complete list of available states' },
    { title: 'Crops List', description: 'Complete list of available crops' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <span>Home</span> / <span>Help</span>
        </nav>
      </div>
      
      <div className="space-y-4">
        {helpItems.map((item, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-medium text-teal-600 hover:text-teal-700 cursor-pointer underline">
              {item.title}
            </h2>
            {item.description && (
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Help;
