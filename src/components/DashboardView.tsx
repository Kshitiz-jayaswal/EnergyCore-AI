import React, { useState } from 'react';
import { 
  Zap, 
  Leaf, 
  Activity, 
  DoorOpen, 
  ArrowDown, 
  ArrowUp, 
  AlertTriangle, 
  Thermometer, 
  Info,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { NavTab, AlertItem } from '../types';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  alerts: AlertItem[];
  currentPower?: number;
  totalEnergy?: number;
  energySaved?: number;
  occupiedRoomsCount?: number;
  totalRoomsCount?: number;
  activeLoadsCount?: number;
  onEmergencyShed?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  alerts = [],
  currentPower = 342.8,
  totalEnergy = 1840.5,
  energySaved = 1240.2,
  occupiedRoomsCount = 4,
  totalRoomsCount = 6,
  activeLoadsCount = 12,
  onEmergencyShed,
}) => {
  const [chartGranularity, setChartGranularity] = useState<'1h' | '6h' | '24h'>('6h');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; time: string; power: string } | null>(null);

  // Sparkline data points for power demand
  const chartPoints = [
    { time: '10:00', kw: 1.1, x: 0, y: 35 },
    { time: '11:00', kw: 1.4, x: 16.6, y: 28 },
    { time: '12:00', kw: 1.2, x: 33.3, y: 38 },
    { time: '13:00', kw: 1.9, x: 50.0, y: 15 },
    { time: '14:00', kw: 2.3, x: 66.6, y: 8 },
    { time: '14:30', kw: 1.6, x: 83.3, y: 24 },
    { time: 'Now', kw: currentPower, x: 100, y: 18 }
  ];

  return (
    <div className="space-y-6 lg:space-y-7 animate-fadeIn">
      {/* Mobile status badges */}
      <div className="sm:hidden flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-1.5 rounded-full bg-[#e3ecdd] text-[#1f4632] border border-[#3d7a4e]/15">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3d7a4e]" />
          Online
        </span>
        <span className="font-sans text-xs font-semibold px-3 py-1.5 rounded-full bg-[#f5e9cf] text-[#7a5410] border border-[#b8862f]/30">
          Demo ON
        </span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
        {/* KPI 1: Total Energy */}
        <div className="glass-panel rounded-2xl p-5 lg:p-6 pb-14 lg:pb-14 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(31,61,43,0.05),0_16px_32px_-18px_rgba(31,61,43,0.28)] transition-all duration-200 min-h-[200px]">
          <div className="flex justify-between items-start gap-3 mb-4">
            <span className="font-sans text-xs font-bold text-[#3a4a40] uppercase tracking-[0.12em] pt-1">Total Energy</span>
            <span className="w-10 h-10 rounded-xl bg-[#e3ecdd] text-[#2c5e43] flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5" />
            </span>
          </div>

          <div className="z-10">
            <div className="font-sans font-extrabold text-[34px] lg:text-[40px] leading-none text-[#14241b] tracking-[-0.03em]">
              {totalEnergy.toFixed(1)} <span className="block mt-2 text-base font-medium tracking-normal text-[#56655b]">kWh</span>
            </div>
            <div className="font-sans text-[13px] font-semibold text-[#2f6b44] flex items-center gap-1 mt-3">
              <ArrowDown className="w-4 h-4" />
              <span>5.2% vs last week</span>
            </div>
          </div>

          {/* Sparkline Visual */}
          <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path d="M0,12 L20,16 L40,6 L60,14 L80,3 L100,9 L100,20 L0,20 Z" fill="#a9c4a3" fillOpacity="0.28" />
              <path className="sparkline-anim" pathLength="100" d="M0,12 L20,16 L40,6 L60,14 L80,3 L100,9" fill="none" stroke="#5b8f63" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>

        {/* KPI 2: Energy Saved */}
        <div className="glass-panel rounded-2xl p-5 lg:p-6 pb-14 lg:pb-14 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(31,61,43,0.05),0_16px_32px_-18px_rgba(31,61,43,0.28)] transition-all duration-200 min-h-[200px]">
          <div className="flex justify-between items-start gap-3 mb-4">
            <span className="font-sans text-xs font-bold text-[#3a4a40] uppercase tracking-[0.12em] pt-1">Energy Saved</span>
            <span className="w-10 h-10 rounded-xl bg-[#e3ecdd] text-[#2c5e43] flex items-center justify-center flex-shrink-0">
              <Leaf className="w-5 h-5" />
            </span>
          </div>

          <div className="z-10">
            <div className="font-sans font-extrabold text-[34px] lg:text-[40px] leading-none text-[#14241b] tracking-[-0.03em]">
              {energySaved.toFixed(1)} <span className="block mt-2 text-base font-medium tracking-normal text-[#56655b]">kWh</span>
            </div>
            <div className="font-sans text-[13px] font-semibold text-[#2f6b44] flex items-center gap-1 mt-3">
              <ArrowUp className="w-4 h-4" />
              <span>12.4% efficiency gain</span>
            </div>
          </div>

          {/* Sparkline Visual */}
          <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path d="M0,17 L20,11 L40,14 L60,6 L80,9 L100,2 L100,20 L0,20 Z" fill="#a9c4a3" fillOpacity="0.28" />
              <path className="sparkline-anim" pathLength="100" d="M0,17 L20,11 L40,14 L60,6 L80,9 L100,2" fill="none" stroke="#5b8f63" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>

        {/* KPI 3: Current Power */}
        <div className="glass-panel rounded-2xl p-5 lg:p-6 flex flex-col justify-between group hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(31,61,43,0.05),0_16px_32px_-18px_rgba(31,61,43,0.28)] transition-all duration-200 min-h-[200px]">
          <div className="flex justify-between items-start gap-3 mb-4">
            <span className="font-sans text-xs font-bold text-[#3a4a40] uppercase tracking-[0.12em] pt-1">Current Power</span>
            <span className="w-10 h-10 rounded-xl bg-[#e3ecdd] text-[#2c5e43] flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5" />
            </span>
          </div>

          <div>
            <div className="font-sans font-extrabold text-[34px] lg:text-[40px] leading-none text-[#14241b] tracking-[-0.03em]">
              {currentPower.toFixed(1)} <span className="block mt-2 text-base font-medium tracking-normal text-[#56655b]">kW</span>
            </div>
            <div className="font-sans text-[13px] font-semibold text-[#8a5f14] flex items-center gap-2 mt-3">
              <span className="w-2 h-2 rounded-full bg-[#c9952f]" />
              <span>Active Loads: {activeLoadsCount}</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Occupied Rooms */}
        <div 
          onClick={() => onNavigate('digital_twin')}
          className="glass-panel rounded-2xl p-5 lg:p-6 flex flex-col justify-between group hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(31,61,43,0.05),0_16px_32px_-18px_rgba(31,61,43,0.28)] cursor-pointer transition-all duration-200 min-h-[200px]"
        >
          <div className="flex justify-between items-start gap-3 mb-4">
            <span className="font-sans text-xs font-bold text-[#3a4a40] uppercase tracking-[0.12em] pt-1">Occupied Rooms</span>
            <span className="w-10 h-10 rounded-xl bg-[#e3ecdd] text-[#2c5e43] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1f4632] group-hover:text-[#e3ecdd] transition-colors">
              <DoorOpen className="w-5 h-5" />
            </span>
          </div>

          <div>
            <div className="font-sans font-extrabold text-[34px] lg:text-[40px] leading-none text-[#14241b] tracking-[-0.03em]">
              {occupiedRoomsCount}
              <span className="text-xl font-semibold tracking-normal text-[#56655b]">/{totalRoomsCount}</span>
            </div>
            
            {/* Visual Progress Bar */}
            <div className="w-full bg-[#ebe6da] h-2 rounded-full mt-5 overflow-hidden">
              <div 
                className="bg-[#2f6b44] h-full rounded-full transition-all duration-500" 
                style={{ width: `${(occupiedRoomsCount / totalRoomsCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6">
        {/* Chart Section: Real-time Power Demand (2 cols) */}
        <div className="xl:col-span-2 glass-panel rounded-2xl p-5 md:p-7 flex flex-col min-h-[420px]">
          <div className="flex flex-col sm:flex-row sm:items-start md:flex-col lg:flex-row justify-between gap-4 mb-6">
            <div className="min-w-0">
              <h3 className="font-sans font-bold text-xl md:text-[22px] leading-tight tracking-[-0.01em] text-[#163626]">Real-time Power Demand</h3>
              <p className="font-sans text-sm text-[#56655b] mt-1">Facility baseline telemetry & instantaneous feed</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex bg-[#f1ece0] rounded-xl p-1 border border-[#1c2a22]/[0.06] font-sans text-[13px]">
                {(['1h', '6h', '24h'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setChartGranularity(r)}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      chartGranularity === r
                        ? 'bg-[#1f4632] text-[#f5f1e6] font-semibold shadow-[0_1px_3px_rgba(31,70,50,0.35)]'
                        : 'text-[#56655b] font-medium hover:text-[#163626]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => onNavigate('analytics')}
                className="font-sans text-[13px] font-semibold text-[#1f4632] bg-[#fdfbf6] hover:bg-[#f0ebdf] px-3.5 py-[7px] rounded-xl border border-[#1f4632]/25 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>View Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SVG Area Chart */}
          <div className="flex-1 relative w-full border-b border-[#1c2a22]/10 min-h-[240px] flex items-end">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-t border-dashed border-[#1c2a22]/[0.08] w-full" />
              <div className="border-t border-dashed border-[#1c2a22]/[0.08] w-full" />
              <div className="border-t border-dashed border-[#1c2a22]/[0.08] w-full" />
              <div className="border-t border-dashed border-[#1c2a22]/[0.08] w-full" />
            </div>

            <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 50">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5b8f63" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#a9c4a3" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Area */}
              <path 
                d="M 0,50 L 0,35 Q 16.6,28 33.3,38 T 66.6,8 T 83.3,24 T 100,18 L 100,50 Z" 
                fill="url(#chartGradient)" 
              />
              
              {/* Line */}
              <path 
                className="sparkline-anim" pathLength="100"
                d="M 0,35 Q 16.6,28 33.3,38 T 66.6,8 T 83.3,24 T 100,18" 
                fill="none" 
                stroke="#2c5e43" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              {/* Current Active Pulse Marker */}
              <circle cx="100" cy="18" r="3" fill="#2c5e43" className="animate-pulse" />
              <circle cx="100" cy="18" r="6" fill="#5b8f63" opacity="0.2" className="animate-ping" />
            </svg>

            {/* Interactive Tooltip Overlay */}
            {hoveredPoint && (
              <div 
                className="absolute z-20 bg-[#1f4632] text-[#f5f1e6] px-2.5 py-1.5 rounded-lg text-xs font-mono shadow-[0_8px_20px_-8px_rgba(20,36,27,0.5)] pointer-events-none -translate-x-1/2 -translate-y-8 whitespace-nowrap"
                style={{ left: `${hoveredPoint.x}%`, top: `${hoveredPoint.y}%` }}
              >
                <span className="text-[#c9d6c5]">{hoveredPoint.time}: </span>
                <span className="font-semibold text-[#f5f1e6]">{hoveredPoint.power}</span>
              </div>
            )}
          </div>

          {/* Time Labels */}
          <div className="flex justify-between mt-3 font-mono text-[11px] sm:text-xs text-[#56655b]">
            {chartPoints.map((pt) => (
              <span 
                key={pt.time}
                onMouseEnter={() => setHoveredPoint({ x: pt.x, y: pt.y, time: pt.time, power: `${pt.kw} kW` })}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer hover:text-[#163626] transition-colors"
              >
                {pt.time}
              </span>
            ))}
          </div>
        </div>

        {/* Alerts Widget (1 col) */}
        <div className="glass-panel rounded-2xl p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5 border-b border-[#1c2a22]/[0.07] pb-4">
              <h3 className="font-sans font-bold text-xl tracking-[-0.01em] text-[#163626]">Recent Alerts</h3>
              <span className="font-sans text-xs bg-[#b4423a] text-[#fdfbf6] px-3 py-1 rounded-full font-bold whitespace-nowrap">
                1 New
              </span>
            </div>

            <ul className="space-y-3">
              {alerts.slice(0, 3).map((item) => {
                const isCritical = item.severity === 'CRITICAL';
                const isWarning = item.severity === 'WARNING';
                const isInfo = item.severity === 'INFO';

                return (
                  <li 
                    key={item.id}
                    onClick={() => onNavigate('alerts')}
                    className={`transition-colors rounded-xl p-3.5 border-l-[3px] cursor-pointer ${
                      isCritical ? 'border-l-[#c2554c] bg-[#f8e6e1] hover:bg-[#f4dcd5]' :
                      isWarning ? 'border-l-[#c9952f] bg-[#f8eedb] hover:bg-[#f4e6cb]' :
                      'border-l-[#5b8f63] bg-[#e9f0e3] hover:bg-[#dfe9d8]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCritical && <AlertTriangle className="w-5 h-5 text-[#b4423a] mt-0.5 flex-shrink-0" />}
                      {isWarning && <Thermometer className="w-5 h-5 text-[#8a5f14] mt-0.5 flex-shrink-0" />}
                      {isInfo && <Info className="w-5 h-5 text-[#2f6b44] mt-0.5 flex-shrink-0" />}
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm font-bold text-[#1c2a22] truncate">
                          {item.title}
                        </p>
                        <p className="font-sans text-xs text-[#56655b] mt-1">
                          {item.timeAgo} • {item.deviceId || item.category}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <button 
            id="view-all-alerts-btn"
            onClick={() => onNavigate('alerts')}
            className="w-full mt-5 py-3 font-sans text-sm font-semibold text-[#f5f1e6] bg-[#1f4632] hover:bg-[#173a28] rounded-xl shadow-[0_2px_6px_-2px_rgba(31,70,50,0.45)] transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View All Alerts</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Action Glance Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        <div 
          onClick={() => onNavigate('occupancy')}
          className="glass-panel rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-[#3d7a4e]/30 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#e3ecdd] flex items-center justify-center text-[#2c5e43] flex-shrink-0">
              <DoorOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-sans font-semibold text-sm text-[#1c2a22]">Live Occupancy Feed</div>
              <div className="font-sans text-xs text-[#2f6b44] mt-0.5">24 Detected • YOLOv8 Active</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#737e76] group-hover:text-[#2f6b44] transition-colors flex-shrink-0" />
        </div>

        <div 
          onClick={() => onNavigate('ai_insights')}
          className="glass-panel rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-[#1f4632]/30 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#e6ebe3] flex items-center justify-center text-[#1f4632] flex-shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-sans font-semibold text-sm text-[#1c2a22]">AI Demand Forecast</div>
              <div className="font-sans text-xs text-[#1f4632] mt-0.5">Peak at 2:00 PM Predicted</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#737e76] group-hover:text-[#1f4632] transition-colors flex-shrink-0" />
        </div>

        <div 
          onClick={() => onNavigate('load_control')}
          className="glass-panel rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-[#b8862f]/35 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-[#f5e9cf] flex items-center justify-center text-[#8a5f14] flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-sans font-semibold text-sm text-[#1c2a22]">Load Control Manager</div>
              <div className="font-sans text-xs text-[#8a5f14] mt-0.5">Master Mode: AUTO Active</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#737e76] group-hover:text-[#8a5f14] transition-colors flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};
