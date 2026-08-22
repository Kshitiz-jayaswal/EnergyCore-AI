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
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-[#dae2fd] tracking-tight">
            Load Control
          </h1>
          <p className="font-sans text-sm text-[#c2c6d6] mt-0.5">
            Manage and monitor electrical loads across the facility.
          </p>
        </div>

        {/* Master Toggle Component */}
        <div className="glass-panel rounded-xl p-4 flex items-center justify-between gap-6 min-w-[280px] md:min-w-[320px] border border-white/10 shadow-lg">
          <div className="flex flex-col">
            <span className="font-mono text-xs text-[#c2c6d6] mb-0.5">
              System Override
            </span>
            <span
              className={`font-sans font-bold text-base md:text-lg ${
                isAutoMode ? 'text-[#adc6ff]' : 'text-[#ffb95f]'
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
              isAutoMode ? 'bg-[#00a572]/30 border border-[#4edea3]/40' : 'bg-[#ca8100]/30 border border-[#ffb95f]/40'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full transition-transform shadow-lg ${
                isAutoMode
                  ? 'translate-x-7 bg-[#4edea3] shadow-[#4edea3]/30'
                  : 'translate-x-1 bg-[#ffb95f] shadow-[#ffb95f]/30'
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
                  ? 'border-white/15 glow-active shadow-xl'
                  : 'border-white/5 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider mb-1">
                    {load.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isOn
                          ? 'bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.8)]'
                          : 'bg-[#8c909f]'
                      }`}
                    />
                    <span
                      className={`font-sans font-bold text-lg ${
                        isOn ? 'text-[#4edea3]' : 'text-[#8c909f]'
                      }`}
                    >
                      {load.status}
                    </span>
                  </div>
                </div>

                <div
                  className={`px-2.5 py-1 rounded font-mono text-[10px] uppercase font-bold border ${
                    isHigh
                      ? 'bg-[#93000a]/20 text-[#ffb4ab] border-[#ffb4ab]/30'
                      : isMed
                      ? 'bg-[#004395]/20 text-[#adc6ff] border-[#adc6ff]/30'
                      : 'bg-[#ca8100]/20 text-[#ffb95f] border-[#ffb95f]/30'
                  }`}
                >
                  Priority {load.priority}
                </div>
              </div>

              {/* Draw & Uptime Stats */}
              <div className="grid grid-cols-2 gap-4 mt-auto mb-5">
                <div>
                  <div className="font-mono text-[10px] text-[#c2c6d6]/70 mb-1 uppercase">
                    {isOn ? 'CURRENT DRAW' : 'RATED DRAW'}
                  </div>
                  <div className="font-sans font-bold text-xl md:text-2xl text-[#dae2fd]">
                    {isOn ? `${load.draw}W` : `${load.ratedDraw}W`}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[10px] text-[#c2c6d6]/70 mb-1 uppercase">
                    UPTIME
                  </div>
                  <div className="font-sans font-bold text-xl md:text-2xl text-[#dae2fd]">
                    {isOn
                      ? `${Math.floor(load.uptimeMinutes / 60)}h ${load.uptimeMinutes % 60}m`
                      : '0m'}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#2d3449] rounded-full h-1.5 mb-5 overflow-hidden">
                <div
                  className="bg-[#4edea3] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${load.percentage}%` }}
                />
              </div>

              {/* Turn ON / OFF Action Button */}
              <button
                onClick={() => toggleLoad(load.id)}
                className={`w-full py-2.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                  isOn
                    ? 'bg-[#2d3449] hover:bg-[#31394d] text-[#dae2fd] border-white/10'
                    : 'bg-[#adc6ff]/10 hover:bg-[#adc6ff]/20 text-[#adc6ff] border-[#adc6ff]/30'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card rounded-2xl max-w-md w-full p-6 border border-white/10 shadow-2xl relative">
            <div className="flex items-center gap-3 text-[#ffb95f] mb-3">
              <ShieldAlert className="w-7 h-7 flex-shrink-0" />
              <h2 className="font-sans font-bold text-xl text-[#dae2fd]">
                Manual Override
              </h2>
            </div>

            <p className="font-sans text-sm text-[#c2c6d6] leading-relaxed mb-6">
              You are about to switch the control mode to <strong className="text-[#ffb95f]">MANUAL</strong>. This will disable AI-driven load shedding and automated efficiency schedules. Are you sure you want to proceed?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                id="cancel-override-btn"
                onClick={() => setShowOverrideModal(false)}
                className="px-4 py-2 rounded-lg font-mono text-xs text-[#c2c6d6] hover:bg-white/5 transition-colors"
              >
                CANCEL
              </button>
              <button
                id="confirm-override-btn"
                onClick={confirmManualOverride}
                className="px-4 py-2 rounded-lg font-mono text-xs font-bold bg-[#ca8100] text-white hover:bg-[#ffb95f] hover:text-[#00285d] transition-colors shadow-lg shadow-[#ca8100]/20"
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
