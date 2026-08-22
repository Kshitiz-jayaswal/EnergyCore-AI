import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  Activity, 
  Users, 
  BarChart3, 
  Sparkles, 
  Sliders, 
  AlertTriangle, 
  Router, 
  FileText, 
  Settings,
  X
} from 'lucide-react';
import { NavTab } from '../types';
import { adminProfileImage } from '../data/mockData';

interface NavigationDrawerProps {
  activeTab?: NavTab;
  currentTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
  onSelectTab?: (tab: NavTab) => void;
  alertCount?: number;
  unreadAlertCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItemConfig {
  tab: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItemConfig[] = [
  { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { tab: 'digital_twin', label: 'Digital Twin', icon: Cpu },
  { tab: 'live_monitoring', label: 'Live Monitoring', icon: Activity },
  { tab: 'occupancy', label: 'Occupancy', icon: Users },
  { tab: 'analytics', label: 'Energy Analytics', icon: BarChart3 },
  { tab: 'insights', label: 'AI Insights', icon: Sparkles },
  { tab: 'load_control', label: 'Load Control', icon: Sliders },
  { tab: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { tab: 'devices', label: 'Devices', icon: Router },
  { tab: 'reports', label: 'Reports', icon: FileText },
  { tab: 'settings', label: 'Settings', icon: Settings },
];

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  activeTab = 'dashboard',
  currentTab,
  onTabChange,
  onSelectTab,
  alertCount = 0,
  unreadAlertCount,
  mobileOpen = false,
  onCloseMobile
}) => {
  const current = currentTab || activeTab;
  const count = unreadAlertCount !== undefined ? unreadAlertCount : alertCount;

  const handleSelect = (tab: NavTab) => {
    if (onTabChange) onTabChange(tab);
    else if (onSelectTab) onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Drawer Container */}
      <aside 
        className="flex flex-col h-full w-64 bg-[#131b2e] border-r border-white/5 shadow-2xl shadow-black/60 z-30 select-none"
      >
        {/* User Profile Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#adc6ff]/30 shadow-md flex-shrink-0 bg-[#31394d]">
              <img 
                src={adminProfileImage} 
                alt="System Administrator" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-sans font-semibold text-sm text-[#dae2fd] truncate">System Admin</span>
              <div className="font-mono text-[11px] text-[#4edea3] flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
                <span>Online</span>
              </div>
            </div>
          </div>

          {onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="md:hidden text-[#c2c6d6] hover:text-white p-1 rounded-md cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = current === item.tab;
            const badgeCount = item.tab === 'alerts' ? count : 0;

            return (
              <button
                key={item.tab}
                id={`nav-item-${item.tab}`}
                onClick={() => handleSelect(item.tab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-mono text-xs tracking-wider transition-all duration-150 text-left cursor-pointer ${
                  isActive 
                    ? 'border-l-4 border-[#4edea3] bg-[#00a572]/20 text-[#4edea3] font-bold shadow-sm shadow-[#00a572]/10 scale-[1.01]' 
                    : 'text-[#c2c6d6]/75 hover:text-[#dae2fd] hover:bg-[#2d3449]/50 active:scale-95'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#4edea3]' : 'text-[#c2c6d6]/70'}`} />
                  <span>{item.label}</span>
                </div>

                {badgeCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#93000a] text-[#ffdad6] border border-[#ffb4ab]/30">
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Version Footer */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between font-mono text-xs text-[#c2c6d6]/40">
          <span>Kinetic Core</span>
          <span className="px-2 py-0.5 rounded bg-white/5 text-[#adc6ff]/70 border border-white/5">v2.4.0</span>
        </div>
      </aside>
    </>
  );
};
