import React, { useState } from 'react';
import { 
  Sliders, 
  Save, 
  RotateCcw, 
  Bell, 
  ShieldCheck, 
  Cpu, 
  Check, 
  Lock
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [peakThreshold, setPeakThreshold] = useState<number>(450);
  const [co2Threshold, setCo2Threshold] = useState<number>(1200);
  const [yoloConfidence, setYoloConfidence] = useState<number>(0.85);
  const [sheddingStrategy, setSheddingStrategy] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [pollingRate, setPollingRate] = useState<number>(1000);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    setPeakThreshold(450);
    setCo2Threshold(1200);
    setYoloConfidence(0.85);
    setSheddingStrategy('balanced');
    setPollingRate(1000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8 max-w-4xl">
      <div>
        <h1 className="font-sans font-bold text-2xl md:text-3xl text-[#dae2fd] tracking-tight">
          System Configuration & AI Policies
        </h1>
        <p className="font-sans text-sm text-[#c2c6d6] mt-0.5">
          Tune algorithmic thresholds, demand limit triggers, and hardware telemetry intervals.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Facility & Load Limits */}
        <div className="glass-panel rounded-xl p-6 border border-white/10 shadow-xl space-y-5">
          <div className="flex items-center gap-2 text-[#adc6ff] border-b border-white/10 pb-3">
            <Sliders className="w-5 h-5" />
            <h3 className="font-sans font-bold text-base text-[#dae2fd]">
              Demand Limit & Safety Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
            <div>
              <label className="block text-[#c2c6d6] mb-1.5 font-semibold">
                Peak Demand Alarm Limit (kW)
              </label>
              <input
                type="number"
                value={peakThreshold}
                onChange={(e) => setPeakThreshold(Number(e.target.value))}
                className="w-full bg-[#171f33] border border-white/10 rounded-lg px-4 py-2.5 text-[#dae2fd] focus:outline-none focus:border-[#adc6ff]"
              />
              <span className="text-[11px] text-[#c2c6d6]/60 mt-1 block">
                Triggers critical alarm and pre-emptive chiller shedding.
              </span>
            </div>

            <div>
              <label className="block text-[#c2c6d6] mb-1.5 font-semibold">
                CO2 Hazard Threshold (ppm)
              </label>
              <input
                type="number"
                value={co2Threshold}
                onChange={(e) => setCo2Threshold(Number(e.target.value))}
                className="w-full bg-[#171f33] border border-white/10 rounded-lg px-4 py-2.5 text-[#dae2fd] focus:outline-none focus:border-[#adc6ff]"
              />
              <span className="text-[11px] text-[#c2c6d6]/60 mt-1 block">
                Triggers automatic fresh-air damper override.
              </span>
            </div>
          </div>
        </div>

        {/* AI & YOLO Vision Engine */}
        <div className="glass-panel rounded-xl p-6 border border-white/10 shadow-xl space-y-5">
          <div className="flex items-center gap-2 text-[#4edea3] border-b border-white/10 pb-3">
            <Cpu className="w-5 h-5" />
            <h3 className="font-sans font-bold text-base text-[#dae2fd]">
              Computer Vision & Automated Strategy
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
            <div>
              <label className="block text-[#c2c6d6] mb-1.5 font-semibold">
                YOLOv8 Detection Confidence ({Math.round(yoloConfidence * 100)}%)
              </label>
              <input
                type="range"
                min="0.5"
                max="0.99"
                step="0.01"
                value={yoloConfidence}
                onChange={(e) => setYoloConfidence(Number(e.target.value))}
                className="w-full accent-[#4edea3] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#c2c6d6]/60 mt-1">
                <span>50% (Sensitive)</span>
                <span>99% (Strict)</span>
              </div>
            </div>

            <div>
              <label className="block text-[#c2c6d6] mb-1.5 font-semibold">
                Automated Load Shedding Policy
              </label>
              <select
                value={sheddingStrategy}
                onChange={(e) => setSheddingStrategy(e.target.value as any)}
                className="w-full bg-[#171f33] border border-white/10 rounded-lg px-4 py-2.5 text-[#dae2fd] focus:outline-none focus:border-[#4edea3]"
              >
                <option value="conservative">Conservative (Protect Comfort)</option>
                <option value="balanced">Balanced (Optimal Efficiency)</option>
                <option value="aggressive">Aggressive (Maximum Tariff Savings)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="font-mono text-xs text-[#c2c6d6] hover:text-white px-4 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="font-mono text-xs text-[#4edea3] flex items-center gap-1 animate-fadeIn">
                <Check className="w-4 h-4" />
                <span>Configuration Saved</span>
              </span>
            )}

            <button
              type="submit"
              className="font-mono text-xs font-bold px-6 py-2.5 rounded-lg bg-[#4edea3] text-[#003824] hover:bg-[#86efac] transition-all flex items-center gap-2 shadow-lg shadow-[#4edea3]/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Apply Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
