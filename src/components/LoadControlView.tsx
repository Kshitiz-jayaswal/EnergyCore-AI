import React, { useState } from 'react';
import { 
  Power, 
  AlertTriangle, 
  Zap, 
  Clock, 
  Sliders, 
  Check, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { LoadItem } from '../types';
import { initialLoads } from '../data/mockData';

interface LoadControlViewProps {
  isAutoMode: boolean;
  onToggleAutoMode: (auto: boolean) => void;
  onUpdateLoad?: (loadId: string, state: 'ON' | 'OFF') => void;
}

export const LoadControlView: React.FC<LoadControlViewProps> = ({
  isAutoMode,
  onToggleAutoMode,
  onUpdateLoad
}) => {
  const [loads, setLoads] = useState<LoadItem[]>(initialLoads);
  const [showOverrideModal, setShowOverrideModal] = useState<boolean>(false);

  const handleMasterToggleClick = () => {
    if (isAutoMode) {
      // Prompt modal before switching to MANUAL
      setShowOverrideModal(true);
    } else {
      // Switching back to AUTO immediately
      onToggleAutoMode(true);
    }
  };

  const confirmManualOverride = () => {
    onToggleAutoMode(false);
    setShowOverrideModal(false);
  };

  const toggleLoad = (loadId: string) => {
    setLoads((prev) =>
      prev.map((load) => {
        if (load.id !== loadId) return load;
        const nextState: 'ON' | 'OFF' = load.status === 'ON' ? 'OFF' : 'ON';
        const nextDraw = nextState === 'ON' ? load.ratedDraw * 0.8 : 0;
        const nextPercent = nextState === 'ON' ? 45 : 0;
        if (onUpdateLoad) onUpdateLoad(load.id, nextState);
        return {
          ...load,
          status: nextState,
          draw: nextDraw,
          percentage: nextPercent,
        };
      })
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-[#1c2a22] tracking-tight">
            Load Control
          </h1>
          <p className="font-sans text-sm text-[#56655b] mt-0.5">
            Manage and monitor electrical loads across the facility.
          </p>
        </div>

        {/* Master Toggle Component */}
        <div className="glass-panel rounded-xl p-4 flex items-center justify-between gap-6 min-w-[280px] md:min-w-[320px] border border-[#1c2a22]/10 shadow-lg">
          <div className="flex flex-col">
            <span className="font-mono text-xs text-[#56655b] mb-0.5">
              System Override
            </span>
            <span
              className={`font-sans font-bold text-base md:text-lg ${
                isAutoMode ? 'text-[#1f4632]' : 'text-[#8a5f14]'
              }`}
            >
              Control Mode: {isAutoMode ? 'AUTO' : 'MANUAL'}
            </span>
          </div>

          <button
            id="master-toggle-btn"
            onClick={handleMasterToggleClick}
            aria-checked={isAutoMode}
            role="switch"
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
              isAutoMode ? 'bg-[#2f6b44]/30 border border-[#3d7a4e]/40' : 'bg-[#b8862f]/30 border border-[#a8741a]/40'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full transition-transform shadow-lg ${
                isAutoMode
                  ? 'translate-x-7 bg-[#3d7a4e] shadow-[#1f3d2b]/10'
                  : 'translate-x-1 bg-[#a8741a] shadow-[#1f3d2b]/10'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Bento Grid for Loads */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loads.map((load) => {
          const isOn = load.status === 'ON';
          const isHigh = load.priority === 'HIGH' || load.priority === 'CRITICAL';
          const isMed = load.priority === 'MED';

          return (
            <div
              key={load.id}
              className={`glass-panel rounded-xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-200 border ${
                isOn
                  ? 'border-[#1c2a22]/12 glow-active shadow-xl'
                  : 'border-[#1c2a22]/[0.07] opacity-80 hover:opacity-100'
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-mono text-xs text-[#56655b] uppercase tracking-wider mb-1">
                    {load.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isOn
                          ? 'bg-[#3d7a4e] shadow-[0_0_0_3px_rgba(61,122,78,0.18)]'
                          : 'bg-[#8a958c]'
                      }`}
                    />
                    <span
                      className={`font-sans font-bold text-lg ${
                        isOn ? 'text-[#3d7a4e]' : 'text-[#737e76]'
                      }`}
                    >
                      {load.status}
                    </span>
                  </div>
                </div>

                <div
                  className={`px-2.5 py-1 rounded font-mono text-[10px] uppercase font-bold border ${
                    isHigh
                      ? 'bg-[#b4423a]/20 text-[#b4423a] border-[#b4423a]/30'
                      : isMed
                      ? 'bg-[#1f4632]/20 text-[#1f4632] border-[#1f4632]/30'
                      : 'bg-[#b8862f]/20 text-[#8a5f14] border-[#a8741a]/30'
                  }`}
                >
                  Priority {load.priority}
                </div>
              </div>

              {/* Draw & Uptime Stats */}
              <div className="grid grid-cols-2 gap-4 mt-auto mb-5">
                <div>
                  <div className="font-mono text-[10px] text-[#56655b] mb-1 uppercase">
                    {isOn ? 'CURRENT DRAW' : 'RATED DRAW'}
                  </div>
                  <div className="font-sans font-bold text-xl md:text-2xl text-[#1c2a22]">
                    {isOn ? `${load.draw}W` : `${load.ratedDraw}W`}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[10px] text-[#56655b] mb-1 uppercase">
                    UPTIME
                  </div>
                  <div className="font-sans font-bold text-xl md:text-2xl text-[#1c2a22]">
                    {isOn
                      ? `${Math.floor(load.uptimeMinutes / 60)}h ${load.uptimeMinutes % 60}m`
                      : '0m'}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#e7e1d3] rounded-full h-1.5 mb-5 overflow-hidden">
                <div
                  className="bg-[#3d7a4e] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${load.percentage}%` }}
                />
              </div>

              {/* Turn ON / OFF Action Button */}
              <button
                onClick={() => toggleLoad(load.id)}
                className={`w-full py-2.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                  isOn
                    ? 'bg-[#e7e1d3] hover:bg-[#dfd8c8] text-[#1c2a22] border-[#1c2a22]/10'
                    : 'bg-[#1f4632]/10 hover:bg-[#1f4632]/20 text-[#1f4632] border-[#1f4632]/30'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{isOn ? 'TURN OFF' : 'TURN ON'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Manual Override Confirmation Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14241b]/50 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card rounded-2xl max-w-md w-full p-6 border border-[#1c2a22]/10 shadow-2xl relative">
            <div className="flex items-center gap-3 text-[#8a5f14] mb-3">
              <ShieldAlert className="w-7 h-7 flex-shrink-0" />
              <h2 className="font-sans font-bold text-xl text-[#1c2a22]">
                Manual Override
              </h2>
            </div>

            <p className="font-sans text-sm text-[#56655b] leading-relaxed mb-6">
              You are about to switch the control mode to <strong className="text-[#8a5f14]">MANUAL</strong>. This will disable AI-driven load shedding and automated efficiency schedules. Are you sure you want to proceed?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                id="cancel-override-btn"
                onClick={() => setShowOverrideModal(false)}
                className="px-4 py-2 rounded-lg font-mono text-xs text-[#56655b] hover:bg-[#1c2a22]/[0.07] transition-colors"
              >
                CANCEL
              </button>
              <button
                id="confirm-override-btn"
                onClick={confirmManualOverride}
                className="px-4 py-2 rounded-lg font-mono text-xs font-bold bg-[#b8862f] text-white hover:bg-[#a8741a] hover:text-[#fdfbf6] transition-colors shadow-lg shadow-[#1f3d2b]/10"
              >
                CONFIRM OVERRIDE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
