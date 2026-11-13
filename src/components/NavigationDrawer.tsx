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
          className="fixed inset-0 z-50 bg-[#14241b]/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Drawer Container */}
      <aside 
        className="relative flex flex-col h-full w-64 bg-[#173a28] text-[#e9efe4] z-30 select-none overflow-hidden"
      >
        {/* Decorative landscape (purely visual) */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 w-full h-56 text-[#2a5a3e]"
          viewBox="0 0 256 224"
          preserveAspectRatio="xMidYMax slice"
          fill="none"
        >
          <path d="M0 150 C 50 120, 100 160, 150 135 S 230 110, 256 125 V224 H0Z" fill="currentColor" opacity="0.35" />
          <path d="M0 180 C 60 160, 110 190, 170 170 S 235 160, 256 168 V224 H0Z" fill="currentColor" opacity="0.6" />
          <g stroke="#7fa587" strokeOpacity="0.35" strokeWidth="1">
            <path d="M196 172 L206 92 L216 172 M199 150 H213 M201 130 H211 M203 112 H209 M192 106 H220 M195 120 H217" />
            <path d="M206 92 V84" />
            <path d="M150 180 L156 132 L162 180 M152 162 H160 M146 140 H166" />
          </g>
          <path d="M0 205 C 70 190, 140 215, 256 198 V224 H0Z" fill="#12301f" opacity="0.9" />
        </svg>

        {/* User Profile Header */}
        <div className="relative px-5 pt-6 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#e9efe4]/25 ring-offset-2 ring-offset-[#173a28] flex-shrink-0 bg-[#2a5a3e]">
              <img 
                src={adminProfileImage} 
                alt="System Administrator" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-sans font-semibold text-[15px] text-[#f5f1e6] truncate">System Admin</span>
              <div className="font-sans text-xs text-[#a9c4a3] flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8fd19e]"></span>
                <span>Online</span>
              </div>
            </div>
          </div>

          {onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="md:hidden text-[#c9d6c5] hover:text-[#f5f1e6] hover:bg-[#e9efe4]/10 p-1.5 rounded-lg cursor-pointer transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="relative mx-5 h-px bg-[#e9efe4]/10" />

        {/* Navigation List */}
        <nav className="relative flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = current === item.tab;
            const badgeCount = item.tab === 'alerts' ? count : 0;

            return (
              <button
                key={item.tab}
                id={`nav-item-${item.tab}`}
                onClick={() => handleSelect(item.tab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-sans text-[14px] transition-colors duration-150 text-left cursor-pointer ${
                  isActive 
                    ? 'bg-[#cfe0c6] text-[#163626] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.12)]' 
                    : 'text-[#d3ddcf] font-medium hover:text-[#f5f1e6] hover:bg-[#e9efe4]/[0.07]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-[#1f4632]' : 'text-[#a9c4a3]'}`} />
                  <span>{item.label}</span>
                </div>

                {badgeCount > 0 && (
                  <span className={`min-w-[22px] h-[22px] px-1.5 inline-flex items-center justify-center rounded-full text-[11px] font-bold ${
                    isActive ? 'bg-[#b4423a] text-[#fdfbf6]' : 'bg-[#f2dcc4] text-[#7a4a12]'
                  }`}>
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Version Footer */}
        <div className="relative px-5 py-4 flex items-center justify-between font-sans text-xs text-[#c9d6c5]">
          <span className="font-medium">Kinetic Core</span>
          <span className="font-mono px-2 py-0.5 rounded-md bg-[#0f2a1b]/60 text-[#c9d6c5] border border-[#e9efe4]/10">v2.4.0</span>
        </div>
      </aside>
    </>
  );
};
