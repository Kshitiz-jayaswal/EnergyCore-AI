import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Search, 
  TrendingUp, 
  Check, 
  Clock, 
  Edit3, 
  Plus, 
  X, 
  AlertCircle,
  Zap,
  Activity
} from 'lucide-react';
import { AIRecommendation, ScheduledShift } from '../types';
import { initialRecommendations, initialShifts } from '../data/mockData';

interface AIInsightsViewProps {
  onShedLoadTrigger?: () => void;
}

export const AIInsightsView: React.FC<AIInsightsViewProps> = ({ onShedLoadTrigger }) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(initialRecommendations);
  const [shifts, setShifts] = useState<ScheduledShift[]>(initialShifts);
  const [investigatingRec, setInvestigatingRec] = useState<AIRecommendation | null>(null);
  const [isAddShiftOpen, setIsAddShiftOpen] = useState<boolean>(false);
  const [newShiftTitle, setNewShiftTitle] = useState<string>('');
  const [newShiftTime, setNewShiftTime] = useState<string>('3:00 PM');
  const [newShiftZone, setNewShiftZone] = useState<string>('Zone A - Main Atrium');
  const [autoShedApplied, setAutoShedApplied] = useState<boolean>(false);

  const handleApplyRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, applied: true } : r))
    );
  };

  const handleAutoShed = () => {
    setAutoShedApplied(true);
    handleApplyRecommendation('rec-3');
    if (onShedLoadTrigger) onShedLoadTrigger();
  };

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShiftTitle.trim()) return;

    const newShift: ScheduledShift = {
      id: `shift-${Date.now()}`,
      title: newShiftTitle,
      time: newShiftTime,
      statusColor: 'secondary',
      zone: newShiftZone,
      action: 'Automated setpoint adjust',
    };

    setShifts((prev) => [...prev, newShift]);
    setNewShiftTitle('');
    setIsAddShiftOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header */}
      <div>
        <h1 className="font-sans font-bold text-2xl md:text-3xl text-[#1c2a22] tracking-tight">
          AI Insights & Predictions
        </h1>
        <p className="font-sans text-sm text-[#56655b] mt-0.5 max-w-2xl">
          Real-time intelligence and automated recommendations for optimal energy performance.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {/* Left: AI Decision Cards (8 cols on desktop) */}
        <div className="md:col-span-8 flex flex-col gap-4">
          <div className="font-mono text-xs text-[#3d7a4e] uppercase tracking-widest flex items-center gap-2 font-semibold">
            <Cpu className="w-4 h-4" />
            <span>ACTIVE RECOMMENDATIONS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Room 101 */}
            <div className="glass-card rounded-xl p-5 md:p-6 flex flex-col relative overflow-hidden group hover:bg-[#eee9dc]/80 transition-all border border-[#1c2a22]/10 shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3d7a4e] to-[#1f4632] opacity-70" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-sans font-bold text-lg text-[#1c2a22]">Room 101</h4>
                  <p className="font-mono text-xs text-[#56655b]">Conference A</p>
                </div>
                <span className="bg-[#2f6b44]/15 text-[#3d7a4e] font-mono text-[11px] px-2.5 py-1 rounded border border-[#3d7a4e]/30 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Optimization
                </span>
              </div>

              <p className="font-sans text-sm text-[#1c2a22] mb-6 flex-1 leading-relaxed">
                <span className="font-bold text-[#1f4632] text-glow-primary">AI Recommendation:</span>{' '}
                Turn ON AC, Keep Lights ON.
              </p>

              <div className="mt-auto pt-3 border-t border-[#1c2a22]/[0.07] flex items-center justify-between">
                <span className="font-mono text-xs text-[#56655b]">Confidence: 94%</span>
                <button
                  id="apply-rec-1-btn"
                  onClick={() => handleApplyRecommendation('rec-1')}
                  disabled={recommendations[0]?.applied}
                  className={`font-mono text-xs px-3.5 py-1.5 rounded transition-colors flex items-center gap-1 ${
                    recommendations[0]?.applied
                      ? 'bg-[#2f6b44]/30 text-[#3d7a4e] cursor-default'
                      : 'bg-[#2c5e43] hover:bg-[#1f4632] text-[#fdfbf6] font-bold shadow-md shadow-[#1f3d2b]/10'
                  }`}
                >
                  {recommendations[0]?.applied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </>
                  ) : (
                    <span>Apply</span>
                  )}
                </button>
              </div>
            </div>

            {/* Card 2: HVAC Sector 3 */}
            <div className="glass-card rounded-xl p-5 md:p-6 flex flex-col relative overflow-hidden group hover:bg-[#eee9dc]/80 transition-all border border-[#1c2a22]/10 shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#a8741a] to-[#b4423a] opacity-70" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-sans font-bold text-lg text-[#1c2a22]">HVAC Sector 3</h4>
                  <p className="font-mono text-xs text-[#56655b]">South Wing</p>
                </div>
                <span className="bg-[#b8862f]/15 text-[#8a5f14] font-mono text-[11px] px-2.5 py-1 rounded border border-[#a8741a]/30 font-semibold flex items-center gap-1">
                  <Search className="w-3 h-3" /> Anomaly Detection
                </span>
              </div>

              <p className="font-sans text-sm text-[#1c2a22] mb-6 flex-1 leading-relaxed">
                Unusual power draw detected. Potential compressor inefficiency or blockage.
              </p>

              <div className="mt-auto pt-3 border-t border-[#1c2a22]/[0.07] flex items-center justify-between">
                <span className="font-mono text-xs text-[#56655b]">Detected 12m ago</span>
                <button
                  id="investigate-rec-2-btn"
                  onClick={() => setInvestigatingRec(recommendations[1])}
                  className="bg-[#dfd8c8] hover:bg-[#e7e1d3] text-[#1c2a22] font-mono text-xs px-3.5 py-1.5 rounded transition-colors border border-[#1c2a22]/10"
                >
                  Investigate
                </button>
              </div>
            </div>

            {/* Card 3: Campus Wide (Span 2 cols on md) */}
            <div className="glass-card rounded-xl p-5 md:p-6 flex flex-col relative overflow-hidden group hover:bg-[#eee9dc]/80 transition-all md:col-span-2 border border-[#1c2a22]/10 shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1f4632] to-[#3d7a4e] opacity-70" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-sans font-bold text-lg text-[#1c2a22]">Campus Wide</h4>
                  <p className="font-mono text-xs text-[#56655b]">Global Optimization</p>
                </div>
                <span className="bg-[#1f4632]/20 text-[#1f4632] font-mono text-[11px] px-2.5 py-1 rounded border border-[#1f4632]/30 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Prediction
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="font-sans text-sm text-[#1c2a22] flex-1 leading-relaxed">
                  Peak-demand predicted at <span className="font-bold text-[#8a5f14] text-glow-tertiary">2:00 PM</span> - load shedding recommended to avoid tier 2 pricing surge.
                </p>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setInvestigatingRec(recommendations[2])}
                    className="bg-transparent text-[#1f4632] font-mono text-xs px-3.5 py-2 rounded-lg hover:bg-[#1f4632]/10 transition-colors border border-[#1f4632]/30 whitespace-nowrap"
                  >
                    Review Schedule
                  </button>

                  <button
                    id="auto-shed-load-btn"
                    onClick={handleAutoShed}
                    className={`font-mono text-xs px-4 py-2 rounded-lg font-bold transition-all ambient-glow whitespace-nowrap flex items-center gap-1.5 ${
                      autoShedApplied
                        ? 'bg-[#2f6b44] text-[#fdfbf6]'
                        : 'bg-[#1f4632] hover:bg-[#163626] text-[#fdfbf6]'
                    }`}
                  >
                    {autoShedApplied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Shedding Armed</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Auto-Shed Load</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Forecast Chart & Shifts (4 cols on desktop) */}
        <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
          {/* Demand Forecast Chart */}
          <div className="glass-card rounded-xl p-5 md:p-6 flex flex-col min-h-[300px] border border-[#1c2a22]/10 shadow-xl">
            <h3 className="font-mono text-xs text-[#56655b] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#3d7a4e]" />
              <span>DEMAND FORECAST</span>
            </h3>

            <div className="flex-1 relative w-full flex flex-col justify-end">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-20">
                <div className="border-b border-[#1c2a22]/12 w-full" />
                <div className="border-b border-[#1c2a22]/12 w-full" />
                <div className="border-b border-[#1c2a22]/12 w-full" />
                <div className="border-b border-[#1c2a22]/12 w-full" />
              </div>

              {/* Sparkline Graphic */}
              <div className="w-full h-[150px] relative mt-auto">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 50">
                  <defs>
                    <linearGradient id="forecastGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#3d7a4e" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#3d7a4e" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Gradient Area */}
                  <path
                    d="M0,40 L10,35 L20,38 L30,20 L40,25 L50,10 L60,15 L70,5 L80,20 L90,25 L100,10 L100,50 L0,50 Z"
                    fill="url(#forecastGrad)"
                  />

                  {/* Line */}
                  <path
                    d="M0,40 L10,35 L20,38 L30,20 L40,25 L50,10 L60,15 L70,5 L80,20 L90,25 L100,10"
                    fill="none"
                    stroke="#3d7a4e"
                    strokeWidth="2.5"
                  />

                  {/* Prediction Peak Marker at 2:00 PM */}
                  <circle cx="70" cy="5" r="3.5" fill="#a8741a" className="animate-pulse" />
                  <line
                    x1="70"
                    y1="5"
                    x2="70"
                    y2="50"
                    stroke="#a8741a"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                </svg>
              </div>

              <div className="flex justify-between mt-3 font-mono text-[11px] text-[#56655b]">
                <span>Now</span>
                <span>+2h</span>
                <span className="text-[#8a5f14] font-bold">2:00 PM (Peak)</span>
                <span>+6h</span>
              </div>
            </div>
          </div>

          {/* Load Scheduling & Upcoming Shifts */}
          <div className="glass-card rounded-xl p-5 md:p-6 flex flex-col border border-[#1c2a22]/10 shadow-xl">
            <h3 className="font-mono text-xs text-[#56655b] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1f4632]" />
              <span>UPCOMING SHIFTS</span>
            </h3>

            <ul className="space-y-2.5">
              {shifts.map((shift) => (
                <li
                  key={shift.id}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#1c2a22]/[0.07] transition-colors border border-transparent hover:border-[#1c2a22]/[0.07]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        shift.statusColor === 'secondary'
                          ? 'bg-[#3d7a4e]'
                          : shift.statusColor === 'tertiary'
                          ? 'bg-[#a8741a]'
                          : 'bg-[#1f4632]'
                      }`}
                    />
                    <div>
                      <div className="font-sans text-sm font-semibold text-[#1c2a22]">
                        {shift.title}
                      </div>
                      <div className="font-mono text-[11px] text-[#56655b]">
                        {shift.time} • {shift.zone}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      alert(`Shift Config for "${shift.title}": ${shift.action}`);
                    }}
                    className="p-1 rounded text-[#56655b] hover:text-[#1f4632] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}

              <li
                id="add-manual-shift-btn"
                onClick={() => setIsAddShiftOpen(true)}
                className="flex items-center justify-center p-2.5 rounded-lg border border-dashed border-[#8a958c]/40 hover:bg-[#e7e1d3]/40 transition-colors cursor-pointer text-[#56655b] hover:text-[#1c2a22]"
              >
                <span className="font-mono text-xs flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Manual Shift</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Investigation Modal */}
      {investigatingRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14241b]/50 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card rounded-2xl max-w-lg w-full p-6 border border-[#1c2a22]/10 shadow-2xl relative">
            <button
              onClick={() => setInvestigatingRec(null)}
              className="absolute top-4 right-4 text-[#56655b] hover:text-[#1c2a22] p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 text-[#8a5f14]">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-sans font-bold text-lg text-[#1c2a22]">
                Telemetry Deep Dive: {investigatingRec.target}
              </h3>
            </div>

            <div className="space-y-4 font-sans text-sm text-[#56655b]">
              <p className="font-medium text-[#1c2a22]">{investigatingRec.headline}</p>
              <div className="bg-[#f4f0e6] p-3 rounded-lg border border-[#1c2a22]/[0.07] font-mono text-xs space-y-1">
                <div><span className="text-[#737e76]">Location:</span> {investigatingRec.location}</div>
                <div><span className="text-[#737e76]">Diagnostic Type:</span> {investigatingRec.type}</div>
                <div><span className="text-[#737e76]">Diagnosis:</span> {investigatingRec.description}</div>
              </div>

              <div className="pt-3 border-t border-[#1c2a22]/10 flex justify-end gap-3">
                <button
                  onClick={() => setInvestigatingRec(null)}
                  className="px-4 py-2 font-mono text-xs text-[#56655b] hover:bg-[#1c2a22]/[0.07] rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleApplyRecommendation(investigatingRec.id);
                    setInvestigatingRec(null);
                  }}
                  className="px-4 py-2 font-mono text-xs bg-[#2c5e43] hover:bg-[#1f4632] text-[#fdfbf6] font-bold rounded-lg shadow-md"
                >
                  Authorize Mitigation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Manual Shift Modal */}
      {isAddShiftOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14241b]/50 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleAddShift} className="glass-card rounded-2xl max-w-md w-full p-6 border border-[#1c2a22]/10 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsAddShiftOpen(false)}
              className="absolute top-4 right-4 text-[#56655b] hover:text-[#1c2a22] p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-sans font-bold text-lg text-[#1c2a22] mb-4">
              Schedule Energy Shift
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[#56655b] mb-1">Shift Name / Action</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramp Down Chiller 3"
                  value={newShiftTitle}
                  onChange={(e) => setNewShiftTitle(e.target.value)}
                  className="w-full bg-[#f4f0e6] border border-[#1c2a22]/10 rounded-lg px-3 py-2 text-[#1c2a22] focus:outline-none focus:border-[#1f4632]"
                />
              </div>

              <div>
                <label className="block text-[#56655b] mb-1">Execution Time</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3:30 PM"
                  value={newShiftTime}
                  onChange={(e) => setNewShiftTime(e.target.value)}
                  className="w-full bg-[#f4f0e6] border border-[#1c2a22]/10 rounded-lg px-3 py-2 text-[#1c2a22] focus:outline-none focus:border-[#1f4632]"
                />
              </div>

              <div>
                <label className="block text-[#56655b] mb-1">Facility Zone</label>
                <select
                  value={newShiftZone}
                  onChange={(e) => setNewShiftZone(e.target.value)}
                  className="w-full bg-[#f4f0e6] border border-[#1c2a22]/10 rounded-lg px-3 py-2 text-[#1c2a22] focus:outline-none focus:border-[#1f4632]"
                >
                  <option>Zone A - Main Atrium</option>
                  <option>North Wing</option>
                  <option>South Wing</option>
                  <option>Laboratories</option>
                  <option>Campus Wide</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#1c2a22]/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddShiftOpen(false)}
                  className="px-4 py-2 text-[#56655b] hover:bg-[#1c2a22]/[0.07] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2f6b44] hover:bg-[#3d7a4e] text-[#fdfbf6] font-bold rounded-lg shadow-md"
                >
                  Save Shift
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
