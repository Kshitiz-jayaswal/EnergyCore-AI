import React, { useState } from 'react';
import { Menu, Bell, Zap, Activity, Check, Trash2, X, Upload } from 'lucide-react';
import { NavTab, AlertItem } from '../types';

interface TopAppBarProps {
  activeTab?: NavTab;
  currentTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
  onSelectTab?: (tab: NavTab) => void;
  isLiveStream?: boolean;
  demoMode?: boolean;
  onToggleLiveStream?: () => void;
  onToggleDemoMode?: () => void;
  onOpenMobileMenu: () => void;
  alertCount?: number;
  unreadAlertCount?: number;
  alerts?: AlertItem[];
  onOpenAlerts?: () => void;
  onResolveAlert?: (id: string) => void;
  onClearAllAlerts?: () => void;
  systemHealth?: 'ONLINE' | 'DEGRADED' | 'MAINTENANCE';
  onOpenUploadModal?: () => void;
  uploadedCount?: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeTab = 'dashboard',
  currentTab,
  onTabChange,
  onSelectTab,
  isLiveStream = true,
  demoMode = true,
  onToggleLiveStream,
  onToggleDemoMode,
  onOpenMobileMenu,
  alertCount = 0,
  unreadAlertCount,
  alerts = [],
  onOpenAlerts,
  onResolveAlert,
  onClearAllAlerts,
  systemHealth = 'ONLINE',
  onOpenUploadModal,
  uploadedCount = 10,
}) => {
  const [isAlertMenuOpen, setIsAlertMenuOpen] = useState(false);

  const effectiveCount = unreadAlertCount !== undefined ? unreadAlertCount : alertCount;
  const isLive = isLiveStream !== undefined ? isLiveStream : demoMode;

  const handleToggleLive = () => {
    if (onToggleLiveStream) onToggleLiveStream();
    else if (onToggleDemoMode) onToggleDemoMode();
  };

  const handleAlertClick = () => {
    if (onOpenAlerts) {
      onOpenAlerts();
    } else {
      setIsAlertMenuOpen(!isAlertMenuOpen);
    }
  };

  const selectTabHandler = (tab: NavTab) => {
    if (onTabChange) onTabChange(tab);
    else if (onSelectTab) onSelectTab(tab);
    setIsAlertMenuOpen(false);
  };

  return (
    <header className="relative z-40 bg-[#fbf8f1] border-b border-[#1c2a22]/[0.07] shadow-[0_1px_0_rgba(255,255,255,0.6),0_6px_20px_-14px_rgba(31,61,43,0.25)]">
      <div className="min-h-16 md:min-h-[72px] px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button 
            id="mobile-nav-toggle-btn"
            onClick={onOpenMobileMenu}
            className="md:hidden text-[#1f4632] hover:bg-[#1f4632]/[0.07] p-2 -ml-1 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div 
            onClick={() => selectTabHandler('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1f4632] flex items-center justify-center shadow-[0_2px_6px_-2px_rgba(31,70,50,0.5)] flex-shrink-0">
              <Zap className="w-[18px] h-[18px] text-[#d9e8cf] fill-[#d9e8cf]/30" />
            </div>
            <span className="font-sans font-bold text-lg md:text-[22px] text-[#163626] tracking-[-0.02em] truncate">
              EnergyCore AI
            </span>
          </div>
        </div>

        {/* Right: Badges & Notification Center */}
        <div className="ml-auto flex items-center justify-end gap-1.5 lg:gap-2.5 relative">
          {/* Online status badge */}
          <div className="hidden sm:flex items-center gap-2 h-8 px-2.5 text-xs md:px-2 lg:px-2.5 xl:px-3.5 lg:h-9 lg:text-[13px] rounded-full bg-[#e3ecdd] text-[#1f4632] border border-[#3d7a4e]/15 font-sans font-semibold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[#3d7a4e]" />
            <span>System {systemHealth}</span>
          </div>

          {/* ESP32 Upload Serial Data Button */}
          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="hidden sm:flex items-center gap-2 h-8 px-2.5 text-xs md:px-2 lg:px-2.5 xl:px-3.5 lg:h-9 lg:text-[13px] rounded-full font-sans font-semibold bg-[#fdfbf6] hover:bg-[#f0ebdf] text-[#1f4632] border border-[#1f4632]/15 shadow-[0_1px_2px_rgba(31,61,43,0.06)] transition-colors cursor-pointer whitespace-nowrap"
              title="Upload ESP32 Serial Logs & Sensor Telemetry"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>ESP32 Log ({uploadedCount})</span>
            </button>
          )}

          {/* Live Stream Switch Badge */}
          <button 
            id="topbar-demo-toggle-btn"
            onClick={handleToggleLive}
            className={`hidden sm:flex items-center gap-2 h-8 px-2.5 text-xs md:px-2 lg:px-2.5 xl:px-3.5 lg:h-9 lg:text-[13px] rounded-full font-sans font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              isLive 
                ? 'bg-[#f5e9cf] text-[#7a5410] border border-[#b8862f]/30 hover:bg-[#f0e0bd]' 
                : 'bg-[#eee9dc] text-[#56655b] border border-[#1c2a22]/10 hover:bg-[#e7e1d3]'
            }`}
            title="Click to toggle live sensor telemetry simulation"
          >
            <Activity className="w-4 h-4" />
            <span>Live Stream: {isLive ? 'ACTIVE' : 'PAUSED'}</span>
          </button>

          {/* Notification Bell */}
          <button 
            id="notifications-topbar-btn"
            onClick={handleAlertClick}
            className="relative text-[#1f4632] hover:bg-[#1f4632]/[0.07] w-9 h-9 lg:w-10 lg:h-10 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            aria-label="View Alerts"
          >
            <Bell className="w-5 h-5" />
            {effectiveCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b4423a] opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#b4423a] ring-2 ring-[#fbf8f1]"></span>
              </span>
            )}
          </button>

          {/* Dropdown Notification Drawer if open */}
          {isAlertMenuOpen && (
            <div className="absolute top-12 right-0 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-[#fdfbf6] rounded-2xl border border-[#1c2a22]/[0.08] shadow-[0_20px_48px_-20px_rgba(20,36,27,0.35)] p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#1c2a22]/10">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#1f4632]" />
                  <span className="font-sans font-bold text-sm text-[#1c2a22]">Active System Alerts</span>
                </div>
                <button 
                  onClick={() => setIsAlertMenuOpen(false)}
                  className="text-[#56655b] hover:text-[#1c2a22] p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto py-2 space-y-2">
                {alerts.length === 0 ? (
                  <p className="text-xs text-[#56655b] py-4 text-center">No active alerts.</p>
                ) : (
                  alerts.map((a) => (
                    <div key={a.id} className="p-3 rounded-xl bg-[#f6f2e8] border border-[#1c2a22]/[0.06] flex items-start justify-between gap-2 text-xs">
                      <div>
                        <div className="font-semibold text-[#1c2a22]">{a.title}</div>
                        <div className="text-[11px] text-[#56655b] mt-0.5">{a.description}</div>
                      </div>
                      {onResolveAlert && (
                        <button
                          onClick={() => onResolveAlert(a.id)}
                          className="text-[#3d7a4e] hover:bg-[#3d7a4e]/10 p-1 rounded-md"
                          title="Resolve"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-[#1c2a22]/10 flex items-center justify-between">
                {onClearAllAlerts && alerts.length > 0 && (
                  <button
                    onClick={onClearAllAlerts}
                    className="font-sans text-xs font-semibold text-[#b4423a] hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear All
                  </button>
                )}
                <button
                  onClick={() => selectTabHandler('alerts')}
                  className="font-sans text-xs font-semibold text-[#1f4632] hover:underline ml-auto"
                >
                  View Alert Center →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
