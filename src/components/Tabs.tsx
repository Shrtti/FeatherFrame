import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
              ${
                activeTab === tab.id
                  ? 'border-pink-500 text-pink-600 bg-gradient-to-r from-pink-50 to-emerald-50'
                  : 'border-transparent text-gray-500 hover:text-pink-500 hover:border-pink-300 hover:bg-pink-50/50'
              }
            `}
          >
            <span className={`mr-2 transition-colors duration-200 ${
              activeTab === tab.id ? 'text-pink-500' : 'text-gray-400 group-hover:text-pink-400'
            }`}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs; 