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
    <header className="relative z-40 h-16 bg-[#0b1326]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40 transition-all duration-300">
      <div className="h-full px-4 md:px-8 flex items-center justify-between">
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-3">
          <button 
            id="mobile-nav-toggle-btn"
            onClick={onOpenMobileMenu}
            className="md:hidden text-[#adc6ff] hover:bg-[#31394d]/30 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div 
            onClick={() => selectTabHandler('dashboard')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#004395] to-[#4d8eff] flex items-center justify-center shadow-md shadow-[#4d8eff]/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-sans font-bold text-lg md:text-xl text-[#adc6ff] tracking-tight">
              EnergyCore AI
            </span>
          </div>
        </div>

        {/* Right: Badges & Notification Center */}
        <div className="flex items-center gap-2 md:gap-3 relative">
          {/* Online status badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#00a572]/15 text-[#4edea3] border border-[#4edea3]/30 font-mono text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
            <span>System {systemHealth}</span>
          </div>

          {/* ESP32 Upload Serial Data Button */}
          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs font-bold bg-[#00a572]/20 hover:bg-[#00a572]/30 text-[#4edea3] border border-[#4edea3]/40 shadow-sm transition-all cursor-pointer"
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
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-xs font-medium transition-all cursor-pointer ${
              isLive 
                ? 'bg-[#ca8100]/20 text-[#ffb95f] border border-[#ffb95f]/40 hover:bg-[#ca8100]/30' 
                : 'bg-[#2d3449]/40 text-[#c2c6d6] border border-white/10 hover:bg-[#2d3449]/70'
            }`}
            title="Click to toggle live sensor telemetry simulation"
          >
            <Activity className={`w-3.5 h-3.5 ${isLive ? 'animate-spin' : ''}`} />
            <span>Live Stream: {isLive ? 'ACTIVE' : 'PAUSED'}</span>
          </button>

          {/* Notification Bell */}
          <button 
            id="notifications-topbar-btn"
            onClick={handleAlertClick}
            className="relative text-[#adc6ff] hover:bg-[#31394d]/30 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
            aria-label="View Alerts"
          >
            <Bell className="w-5 h-5" />
            {effectiveCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb4ab] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ffb4ab]"></span>
              </span>
            )}
          </button>

          {/* Dropdown Notification Drawer if open */}
          {isAlertMenuOpen && (
            <div className="absolute top-12 right-0 w-80 sm:w-96 bg-[#131b2e] rounded-xl border border-white/10 shadow-2xl p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#adc6ff]" />
                  <span className="font-sans font-bold text-sm text-[#dae2fd]">Active System Alerts</span>
                </div>
                <button 
                  onClick={() => setIsAlertMenuOpen(false)}
                  className="text-[#c2c6d6] hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto py-2 space-y-2">
                {alerts.length === 0 ? (
                  <p className="text-xs text-[#c2c6d6] py-4 text-center">No active alerts.</p>
                ) : (
                  alerts.map((a) => (
                    <div key={a.id} className="p-2.5 rounded bg-[#171f33] border border-white/5 flex items-start justify-between gap-2 text-xs">
                      <div>
                        <div className="font-semibold text-[#dae2fd]">{a.title}</div>
                        <div className="text-[11px] text-[#c2c6d6]/70 mt-0.5">{a.description}</div>
                      </div>
                      {onResolveAlert && (
                        <button
                          onClick={() => onResolveAlert(a.id)}
                          className="text-[#4edea3] hover:bg-[#00a572]/20 p-1 rounded"
                          title="Resolve"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                {onClearAllAlerts && alerts.length > 0 && (
                  <button
                    onClick={onClearAllAlerts}
                    className="font-mono text-[11px] text-[#ffb4ab] hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear All
                  </button>
                )}
                <button
                  onClick={() => selectTabHandler('alerts')}
                  className="font-mono text-[11px] text-[#adc6ff] hover:underline ml-auto"
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
