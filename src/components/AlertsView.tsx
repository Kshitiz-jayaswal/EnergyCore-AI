import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Thermometer, 
  Zap, 
  WifiOff, 
  Check, 
  Radio, 
  Filter,
  CheckCircle2,
  BellRing
} from 'lucide-react';
import { AlertItem, AlertCategory } from '../types';

interface AlertsViewProps {
  alerts: AlertItem[];
  onResolveAlert: (id: string) => void;
  onDismissAlert: (id: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onResolveAlert,
  onDismissAlert
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | AlertCategory>('All');
  const [pingingDeviceId, setPingingDeviceId] = useState<string | null>(null);
  const [pingResult, setPingResult] = useState<{ id: string; msg: string } | null>(null);

  const filteredAlerts = alerts.filter((item) => {
    if (selectedFilter === 'All') return true;
    return item.category === selectedFilter;
  });

  const handlePingDevice = (alertId: string, deviceId: string = 'Device') => {
    setPingingDeviceId(alertId);
    setPingResult(null);

    setTimeout(() => {
      setPingingDeviceId(null);
      setPingResult({
        id: alertId,
        msg: `Ping response from ${deviceId}: 28ms - Heartbeat restored.`,
      });
    }, 1800);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header & Filter pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-[#1c2a22] tracking-tight">
            Alerts Management
          </h1>
          <p className="font-sans text-sm text-[#56655b] mt-0.5">
            Live Feed & Resolution Center
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {(['All', 'Power', 'Temp', 'AI', 'Comm'] as const).map((filter) => {
            const isActive = selectedFilter === filter;

            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-1.5 rounded-full font-mono text-xs transition-all ${
                  isActive
                    ? 'glass-panel text-[#1f4632] border border-[#1f4632]/50 bg-[#1f4632]/15 font-semibold shadow-md shadow-[#1f3d2b]/10'
                    : 'glass-panel text-[#56655b] hover:bg-[#dfd8c8]/40'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Alert Feed Grid */}
      {filteredAlerts.length === 0 ? (
        <div className="glass-panel rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-[#3d7a4e] mb-3" />
          <h3 className="font-sans font-bold text-lg text-[#1c2a22]">All Alerts Cleared</h3>
          <p className="font-mono text-xs text-[#56655b] mt-1">No pending warnings or critical events in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {filteredAlerts.map((item) => {
            const isCritical = item.severity === 'CRITICAL';
            const isWarning = item.severity === 'WARNING';
            const isInfo = item.severity === 'INFO';
            const isOffline = item.severity === 'OFFLINE';

            return (
              <div
                key={item.id}
                className={`glass-panel rounded-xl p-5 md:p-6 flex flex-col gap-4 relative overflow-hidden group border border-[#1c2a22]/10 shadow-xl transition-all ${
                  isCritical ? 'hover:border-[#b4423a]/40' :
                  isWarning ? 'hover:border-[#a8741a]/40' :
                  isInfo ? 'hover:border-[#1f4632]/40' :
                  'hover:border-[#8a958c]/40'
                }`}
              >
                {/* Colored Left Accent Border */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isCritical ? 'bg-[#b4423a]' :
                    isWarning ? 'bg-[#a8741a]' :
                    isInfo ? 'bg-[#1f4632]' :
                    'bg-[#8a958c]'
                  }`}
                />

                {/* Card Top: Badges & Timestamp */}
                <div className="flex justify-between items-start pl-1">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-1 rounded font-mono text-[11px] font-bold flex items-center gap-1.5 ${
                        isCritical ? 'bg-[#b4423a]/25 text-[#b4423a] border border-[#b4423a]/30' :
                        isWarning ? 'bg-[#b8862f]/25 text-[#8a5f14] border border-[#a8741a]/30' :
                        isInfo ? 'bg-[#1f4632]/25 text-[#1f4632] border border-[#1f4632]/30' :
                        'bg-[#d8d0bf]/40 text-[#56655b] border border-[#8a958c]/30'
                      }`}
                    >
                      {isCritical && <AlertTriangle className="w-3.5 h-3.5" />}
                      {isWarning && <Thermometer className="w-3.5 h-3.5" />}
                      {isInfo && <Zap className="w-3.5 h-3.5" />}
                      {isOffline && <WifiOff className="w-3.5 h-3.5" />}
                      <span>{item.severity}</span>
                    </span>

                    <span className="font-mono text-xs text-[#56655b]">
                      {item.timeAgo}
                    </span>
                  </div>

                  <span className="text-[#737e76]">
                    {isCritical && <AlertTriangle className="w-5 h-5 text-[#b4423a]" />}
                    {isWarning && <Thermometer className="w-5 h-5 text-[#8a5f14]" />}
                    {isInfo && <Zap className="w-5 h-5 text-[#1f4632]" />}
                    {isOffline && <Radio className="w-5 h-5 text-[#737e76]" />}
                  </span>
                </div>

                {/* Content */}
                <div className="pl-1">
                  <h3 className="font-sans font-bold text-lg text-[#1c2a22]">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm text-[#56655b] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Ping Result Feedback */}
                {pingResult && pingResult.id === item.id && (
                  <div className="mx-1 p-2 rounded bg-[#2f6b44]/20 border border-[#3d7a4e]/30 text-xs font-mono text-[#3d7a4e] animate-fadeIn">
                    {pingResult.msg}
                  </div>
                )}

                {/* Card Actions Footer */}
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-[#1c2a22]/[0.07] pl-1">
                  <div className="font-mono text-xs text-[#56655b]">
                    Category: <span className="text-[#1c2a22]">{item.category}</span>
                  </div>

                  {isCritical && (
                    <button
                      onClick={() => onResolveAlert(item.id)}
                      className="px-4 py-1.5 bg-[#b4423a] text-[#fdfbf6] hover:bg-[#9c362f] font-bold rounded-lg font-mono text-xs transition-colors shadow-md shadow-[#1f3d2b]/10"
                    >
                      Resolve
                    </button>
                  )}

                  {isWarning && (
                    <button
                      onClick={() => onResolveAlert(item.id)}
                      className="px-4 py-1.5 glass-panel text-[#1c2a22] hover:bg-[#dfd8c8] border border-[#1c2a22]/10 rounded-lg font-mono text-xs transition-colors"
                    >
                      Investigate
                    </button>
                  )}

                  {isInfo && (
                    <button
                      onClick={() => onDismissAlert(item.id)}
                      className="px-4 py-1.5 glass-panel text-[#1c2a22] hover:bg-[#dfd8c8] border border-[#1c2a22]/10 rounded-lg font-mono text-xs transition-colors"
                    >
                      Dismiss
                    </button>
                  )}

                  {isOffline && (
                    <button
                      onClick={() => handlePingDevice(item.id, item.deviceId)}
                      disabled={pingingDeviceId === item.id}
                      className="px-4 py-1.5 glass-panel text-[#1c2a22] hover:bg-[#dfd8c8] border border-[#1c2a22]/10 rounded-lg font-mono text-xs transition-colors flex items-center gap-1.5"
                    >
                      {pingingDeviceId === item.id ? (
                        <>
                          <Radio className="w-3.5 h-3.5 animate-spin text-[#1f4632]" />
                          <span>Pinging...</span>
                        </>
                      ) : (
                        <span>Ping Device</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
