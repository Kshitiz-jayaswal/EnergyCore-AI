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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#171f33]/95 backdrop-blur-lg border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.5)] flex justify-around items-center px-4 pb-safe">
      {/* Home / Dashboard */}
      <button
        id="mobile-tab-dashboard"
        onClick={() => handleSelect('dashboard')}
        className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
          current === 'dashboard'
            ? 'bg-[#00a572] text-[#003824] shadow-lg shadow-[#00a572]/30 scale-105'
            : 'text-[#c2c6d6] hover:text-[#adc6ff] active:scale-90'
        }`}
        aria-label="Dashboard"
      >
        <Home className="w-5 h-5" />
      </button>

      {/* Occupancy */}
      <button
        id="mobile-tab-occupancy"
        onClick={() => handleSelect('occupancy')}
        className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
          current === 'occupancy'
            ? 'bg-[#00a572] text-[#003824] shadow-lg shadow-[#00a572]/30 scale-105'
            : 'text-[#c2c6d6] hover:text-[#adc6ff] active:scale-90'
        }`}
        aria-label="Occupancy"
      >
        <Users className="w-5 h-5" />
      </button>

      {/* Analytics */}
      <button
        id="mobile-tab-analytics"
        onClick={() => handleSelect('analytics')}
        className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
          current === 'analytics'
            ? 'bg-[#00a572] text-[#003824] shadow-lg shadow-[#00a572]/30 scale-105'
            : 'text-[#c2c6d6] hover:text-[#adc6ff] active:scale-90'
        }`}
        aria-label="Analytics"
      >
        <BarChart2 className="w-5 h-5" />
      </button>

      {/* AI Insights */}
      <button
        id="mobile-tab-insights"
        onClick={() => handleSelect('insights')}
        className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
          current === 'insights'
            ? 'bg-[#00a572] text-[#003824] shadow-lg shadow-[#00a572]/30 scale-105'
            : 'text-[#c2c6d6] hover:text-[#adc6ff] active:scale-90'
        }`}
        aria-label="AI Insights"
      >
        <Sparkles className="w-5 h-5" />
      </button>

      {/* Settings / Controls */}
      <button
        id="mobile-tab-settings"
        onClick={() => handleSelect('settings')}
        className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
          current === 'settings' || current === 'load_control' || current === 'digital_twin'
            ? 'bg-[#00a572] text-[#003824] shadow-lg shadow-[#00a572]/30 scale-105'
            : 'text-[#c2c6d6] hover:text-[#adc6ff] active:scale-90'
        }`}
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>
    </nav>
  );
};
