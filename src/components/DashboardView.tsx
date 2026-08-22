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
    <div className="space-y-6 animate-fadeIn">
      {/* Mobile status badges */}
      <div className="sm:hidden flex items-center gap-2">
        <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#00a572]/20 text-[#4edea3] border border-[#4edea3]/30 font-medium">
          Online
        </span>
        <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#ca8100]/20 text-[#ffb95f] border border-[#ffb95f]/30 font-medium">
          Demo ON
        </span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* KPI 1: Total Energy */}
        <div className="glass-panel rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group hover:bg-[#222a3d]/80 transition-all duration-200">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">Total Energy</span>
            <span className="p-1.5 rounded-lg bg-[#2d3449]/50 text-[#8c909f] group-hover:text-[#adc6ff] transition-colors">
              <Zap className="w-4 h-4" />
            </span>
          </div>

          <div className="z-10">
            <div className="font-sans font-bold text-3xl md:text-4xl text-[#dae2fd] tracking-tight">
              {totalEnergy.toFixed(1)} <span className="text-lg font-normal text-[#c2c6d6]">kWh</span>
            </div>
            <div className="font-mono text-xs text-[#4edea3] flex items-center gap-1 mt-1.5">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>5.2% vs last week</span>
            </div>
          </div>

          {/* Sparkline Visual */}
          <div className="absolute bottom-0 left-0 right-0 h-10 opacity-35 pointer-events-none">
            <svg className="w-full h-full stroke-[#4edea3] fill-none stroke-[2.5]" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path className="sparkline-anim" d="M0,12 L20,16 L40,6 L60,14 L80,3 L100,9" />
            </svg>
          </div>
        </div>

        {/* KPI 2: Energy Saved */}
        <div className="glass-panel rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group hover:bg-[#222a3d]/80 transition-all duration-200">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">Energy Saved</span>
            <span className="p-1.5 rounded-lg bg-[#2d3449]/50 text-[#8c909f] group-hover:text-[#4edea3] transition-colors">
              <Leaf className="w-4 h-4" />
            </span>
          </div>

          <div className="z-10">
            <div className="font-sans font-bold text-3xl md:text-4xl text-[#dae2fd] tracking-tight">
              {energySaved.toFixed(1)} <span className="text-lg font-normal text-[#c2c6d6]">kWh</span>
            </div>
            <div className="font-mono text-xs text-[#4edea3] flex items-center gap-1 mt-1.5">
              <ArrowUp className="w-3.5 h-3.5" />
              <span>12.4% efficiency gain</span>
            </div>
          </div>

          {/* Sparkline Visual */}
          <div className="absolute bottom-0 left-0 right-0 h-10 opacity-35 pointer-events-none">
            <svg className="w-full h-full stroke-[#4edea3] fill-none stroke-[2.5]" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path className="sparkline-anim" d="M0,17 L20,11 L40,14 L60,6 L80,9 L100,2" />
            </svg>
          </div>
        </div>

        {/* KPI 3: Current Power */}
        <div className="glass-panel rounded-xl p-5 flex flex-col justify-between group hover:bg-[#222a3d]/80 transition-all duration-200">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">Current Power</span>
            <span className="p-1.5 rounded-lg bg-[#2d3449]/50 text-[#8c909f] group-hover:text-[#ffb95f] transition-colors">
              <Activity className="w-4 h-4" />
            </span>
          </div>

          <div>
            <div className="font-sans font-bold text-3xl md:text-4xl text-[#dae2fd] tracking-tight">
              {currentPower.toFixed(1)} <span className="text-lg font-normal text-[#c2c6d6]">kW</span>
            </div>
            <div className="font-mono text-xs text-[#ffb95f] flex items-center gap-1.5 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ffb95f] animate-pulse" />
              <span>Active Loads: {activeLoadsCount}</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Occupied Rooms */}
        <div 
          onClick={() => onNavigate('digital_twin')}
          className="glass-panel rounded-xl p-5 flex flex-col justify-between group hover:bg-[#222a3d]/80 cursor-pointer transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">Occupied Rooms</span>
            <span className="p-1.5 rounded-lg bg-[#2d3449]/50 text-[#8c909f] group-hover:text-[#adc6ff] transition-colors">
              <DoorOpen className="w-4 h-4" />
            </span>
          </div>

          <div>
            <div className="font-sans font-bold text-3xl md:text-4xl text-[#dae2fd] tracking-tight">
              {occupiedRoomsCount}
              <span className="text-lg font-normal text-[#c2c6d6]">/{totalRoomsCount}</span>
            </div>
            
            {/* Visual Progress Bar */}
            <div className="w-full bg-[#2d3449] h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-[#adc6ff] h-full rounded-full transition-all duration-500" 
                style={{ width: `${(occupiedRoomsCount / totalRoomsCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section: Real-time Power Demand (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-5 md:p-6 flex flex-col min-h-[420px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="font-sans font-semibold text-lg text-[#dae2fd]">Real-time Power Demand</h3>
              <p className="font-mono text-xs text-[#c2c6d6]/70 mt-0.5">Facility baseline telemetry & instantaneous feed</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-[#131b2e] rounded-lg p-0.5 border border-white/5 font-mono text-xs">
                {(['1h', '6h', '24h'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setChartGranularity(r)}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      chartGranularity === r
                        ? 'bg-[#31394d] text-[#dae2fd] font-medium shadow-sm'
                        : 'text-[#c2c6d6]/60 hover:text-[#dae2fd]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => onNavigate('analytics')}
                className="font-mono text-xs text-[#adc6ff] hover:text-[#d8e2ff] hover:bg-[#adc6ff]/10 px-3 py-1.5 rounded-lg border border-[#adc6ff]/20 transition-colors flex items-center gap-1"
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Area Chart */}
          <div className="flex-1 relative w-full border-b border-l border-[#424754]/40 min-h-[240px] flex items-end">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-t border-white/30 w-full" />
              <div className="border-t border-white/30 w-full" />
              <div className="border-t border-white/30 w-full" />
              <div className="border-t border-white/30 w-full" />
            </div>

            <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 100 50">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#adc6ff" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#adc6ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area */}
              <path 
                d="M 0,50 L 0,35 Q 16.6,28 33.3,38 T 66.6,8 T 83.3,24 T 100,18 L 100,50 Z" 
                fill="url(#chartGradient)" 
              />
              
              {/* Line */}
              <path 
                className="sparkline-anim" 
                d="M 0,35 Q 16.6,28 33.3,38 T 66.6,8 T 83.3,24 T 100,18" 
                fill="none" 
                stroke="#adc6ff" 
                strokeWidth="1.8" 
              />

              {/* Current Active Pulse Marker */}
              <circle cx="100" cy="18" r="3" fill="#adc6ff" className="animate-pulse" />
              <circle cx="100" cy="18" r="6" fill="#adc6ff" opacity="0.3" className="animate-ping" />
            </svg>

            {/* Interactive Tooltip Overlay */}
            {hoveredPoint && (
              <div 
                className="absolute z-20 glass-card px-2.5 py-1.5 rounded text-xs font-mono border border-white/10 pointer-events-none -translate-x-1/2 -translate-y-8"
                style={{ left: `${hoveredPoint.x}%`, top: `${hoveredPoint.y}%` }}
              >
                <span className="text-[#c2c6d6]">{hoveredPoint.time}: </span>
                <span className="font-bold text-[#adc6ff]">{hoveredPoint.power}</span>
              </div>
            )}
          </div>

          {/* Time Labels */}
          <div className="flex justify-between mt-3 font-mono text-[11px] text-[#c2c6d6]/60">
            {chartPoints.map((pt) => (
              <span 
                key={pt.time}
                onMouseEnter={() => setHoveredPoint({ x: pt.x, y: pt.y, time: pt.time, power: `${pt.kw} kW` })}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer hover:text-[#adc6ff] transition-colors"
              >
                {pt.time}
              </span>
            ))}
          </div>
        </div>

        {/* Alerts Widget (1 col) */}
        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
              <h3 className="font-sans font-semibold text-lg text-[#dae2fd]">Recent Alerts</h3>
              <span className="font-mono text-xs bg-[#93000a] text-[#ffdad6] px-2.5 py-0.5 rounded-full font-bold border border-[#ffb4ab]/20">
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
                    className={`bg-[#171f33]/60 hover:bg-[#222a3d] transition-all rounded-lg p-3 border-l-3 cursor-pointer ${
                      isCritical ? 'border-l-[#ffb4ab] bg-[#93000a]/10' :
                      isWarning ? 'border-l-[#ffb95f] bg-[#ca8100]/10' :
                      'border-l-[#4edea3] bg-[#00a572]/10'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {isCritical && <AlertTriangle className="w-4 h-4 text-[#ffb4ab] mt-0.5 flex-shrink-0" />}
                      {isWarning && <Thermometer className="w-4 h-4 text-[#ffb95f] mt-0.5 flex-shrink-0" />}
                      {isInfo && <Info className="w-4 h-4 text-[#4edea3] mt-0.5 flex-shrink-0" />}
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm font-semibold text-[#dae2fd] truncate">
                          {item.title}
                        </p>
                        <p className="font-mono text-[11px] text-[#c2c6d6]/70 mt-0.5">
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
            className="w-full mt-4 py-2 font-mono text-xs text-[#adc6ff] hover:text-white bg-[#adc6ff]/10 hover:bg-[#adc6ff]/20 rounded-lg border border-[#adc6ff]/30 transition-colors text-center flex items-center justify-center gap-1.5"
          >
            <span>View All Alerts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Action Glance Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div 
          onClick={() => onNavigate('occupancy')}
          className="glass-panel rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-[#4edea3]/40 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00a572]/20 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3]">
              <DoorOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="font-sans font-medium text-sm text-[#dae2fd]">Live Occupancy Feed</div>
              <div className="font-mono text-xs text-[#4edea3]">24 Detected • YOLOv8 Active</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8c909f] group-hover:text-[#4edea3] transition-colors" />
        </div>

        <div 
          onClick={() => onNavigate('ai_insights')}
          className="glass-panel rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-[#adc6ff]/40 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#004395]/20 border border-[#adc6ff]/30 flex items-center justify-center text-[#adc6ff]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="font-sans font-medium text-sm text-[#dae2fd]">AI Demand Forecast</div>
              <div className="font-mono text-xs text-[#adc6ff]">Peak at 2:00 PM Predicted</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8c909f] group-hover:text-[#adc6ff] transition-colors" />
        </div>

        <div 
          onClick={() => onNavigate('load_control')}
          className="glass-panel rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-[#ffb95f]/40 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#ca8100]/20 border border-[#ffb95f]/30 flex items-center justify-center text-[#ffb95f]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-sans font-medium text-sm text-[#dae2fd]">Load Control Manager</div>
              <div className="font-mono text-xs text-[#ffb95f]">Master Mode: AUTO Active</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8c909f] group-hover:text-[#ffb95f] transition-colors" />
        </div>
      </div>
    </div>
  );
};
