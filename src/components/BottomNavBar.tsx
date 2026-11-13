import React from 'react';
import { Home, BarChart2, Sparkles, Settings, Users } from 'lucide-react';
import { NavTab } from '../types';

interface BottomNavBarProps {
  activeTab?: NavTab;
  currentTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
  onSelectTab?: (tab: NavTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ 
  activeTab = 'dashboard', 
  currentTab, 
  onTabChange, 
  onSelectTab 
}) => {
  const current = currentTab || activeTab;

  const handleSelect = (tab: NavTab) => {
    if (onTabChange) onTabChange(tab);
    else if (onSelectTab) onSelectTab(tab);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#173a28] border-t border-[#0f2a1b] shadow-[0_-4px_16px_rgba(20,36,27,0.18)] flex justify-around items-center px-4 pb-safe">
      {/* Home / Dashboard */}
      <button
        id="mobile-tab-dashboard"
        onClick={() => handleSelect('dashboard')}
        className={`p-2.5 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${
          current === 'dashboard'
            ? 'bg-[#cfe0c6] text-[#163626] shadow-[0_1px_2px_rgba(0,0,0,0.15)]'
            : 'text-[#c9d6c5] hover:text-[#f5f1e6] hover:bg-[#e9efe4]/[0.07]'
        }`}
        aria-label="Dashboard"
      >
        <Home className="w-5 h-5" />
      </button>

      {/* Occupancy */}
      <button
        id="mobile-tab-occupancy"
        onClick={() => handleSelect('occupancy')}
        className={`p-2.5 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${
          current === 'occupancy'
            ? 'bg-[#cfe0c6] text-[#163626] shadow-[0_1px_2px_rgba(0,0,0,0.15)]'
            : 'text-[#c9d6c5] hover:text-[#f5f1e6] hover:bg-[#e9efe4]/[0.07]'
        }`}
        aria-label="Occupancy"
      >
        <Users className="w-5 h-5" />
      </button>

      {/* Analytics */}
      <button
        id="mobile-tab-analytics"
        onClick={() => handleSelect('analytics')}
        className={`p-2.5 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${
          current === 'analytics'
            ? 'bg-[#cfe0c6] text-[#163626] shadow-[0_1px_2px_rgba(0,0,0,0.15)]'
            : 'text-[#c9d6c5] hover:text-[#f5f1e6] hover:bg-[#e9efe4]/[0.07]'
        }`}
        aria-label="Analytics"
      >
        <BarChart2 className="w-5 h-5" />
      </button>

      {/* AI Insights */}
      <button
        id="mobile-tab-insights"
        onClick={() => handleSelect('insights')}
        className={`p-2.5 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${
          current === 'insights'
            ? 'bg-[#cfe0c6] text-[#163626] shadow-[0_1px_2px_rgba(0,0,0,0.15)]'
            : 'text-[#c9d6c5] hover:text-[#f5f1e6] hover:bg-[#e9efe4]/[0.07]'
        }`}
        aria-label="AI Insights"
      >
        <Sparkles className="w-5 h-5" />
      </button>

      {/* Settings / Controls */}
      <button
        id="mobile-tab-settings"
        onClick={() => handleSelect('settings')}
        className={`p-2.5 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${
          current === 'settings' || current === 'load_control' || current === 'digital_twin'
            ? 'bg-[#cfe0c6] text-[#163626] shadow-[0_1px_2px_rgba(0,0,0,0.15)]'
            : 'text-[#c9d6c5] hover:text-[#f5f1e6] hover:bg-[#e9efe4]/[0.07]'
        }`}
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>
    </nav>
  );
};
