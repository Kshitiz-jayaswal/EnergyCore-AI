import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  Gauge, 
  Thermometer, 
  Wind, 
  Sun, 
  Radio, 
  CheckCircle2
} from 'lucide-react';

export const LiveMonitoringView: React.FC = () => {
  const [voltage, setVoltage] = useState(230.4);
  const [frequency, setFrequency] = useState(50.02);
  const [powerFactor, setPowerFactor] = useState(0.98);
  const [co2Level, setCo2Level] = useState(640);
  const [humidity, setHumidity] = useState(48.5);
  const [lux, setLux] = useState(420);

  useEffect(() => {
    const interval = setInterval(() => {
      setVoltage(+(229.8 + Math.random() * 1.2).toFixed(1));
      setFrequency(+(49.98 + Math.random() * 0.08).toFixed(2));
      setPowerFactor(+(0.97 + Math.random() * 0.02).toFixed(2));
      setCo2Level(Math.floor(630 + Math.random() * 25));
      setHumidity(+(48.0 + Math.random() * 1.5).toFixed(1));
      setLux(Math.floor(415 + Math.random() * 15));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-[#dae2fd] tracking-tight">
            Live Telemetry & Sensor Fleet
          </h1>
          <p className="font-sans text-sm text-[#c2c6d6] mt-0.5">
            High-frequency Modbus & LoRaWAN sensor feeds across all campus substations.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#4edea3] bg-[#00a572]/15 px-3 py-1.5 rounded-lg border border-[#4edea3]/30">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
          <span>Polling Rate: 500ms (Real-time Stream)</span>
        </div>
      </div>

      {/* Sensor Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Voltage */}
        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between border border-white/10 shadow-xl">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">Line-to-Neutral Voltage</span>
              <h3 className="font-sans font-bold text-lg text-[#dae2fd]">Grid Phase A</h3>
            </div>
            <span className="p-2 rounded-lg bg-[#004395]/20 text-[#adc6ff]">
              <Zap className="w-5 h-5" />
            </span>
          </div>

          <div className="my-2">
            <div className="font-sans font-bold text-4xl text-[#dae2fd]">
              {voltage} <span className="text-xl font-normal text-[#c2c6d6]">V</span>
            </div>
            <div className="font-mono text-xs text-[#4edea3] mt-1">Status: Stable Nominal</div>
          </div>

          <div className="w-full bg-[#2d3449] h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-[#adc6ff] h-full rounded-full" style={{ width: '92%' }} />
          </div>
        </div>

        {/* Frequency */}
        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between border border-white/10 shadow-xl">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">Grid Frequency</span>
              <h3 className="font-sans font-bold text-lg text-[#dae2fd]">Substation 1</h3>
            </div>
            <span className="p-2 rounded-lg bg-[#00a572]/20 text-[#4edea3]">
              <Activity className="w-5 h-5" />
            </span>
          </div>

          <div className="my-2">
            <div className="font-sans font-bold text-4xl text-[#4edea3] text-glow-secondary">
              {frequency} <span className="text-xl font-normal text-[#c2c6d6]">Hz</span>
            </div>
            <div className="font-mono text-xs text-[#4edea3] mt-1">Deviation: ±0.04% (Sync Locked)</div>
          </div>

          <div className="w-full bg-[#2d3449] h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-[#4edea3] h-full rounded-full" style={{ width: '99%' }} />
          </div>
        </div>

        {/* Power Factor */}
        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between border border-white/10 shadow-xl">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">Power Factor (cos φ)</span>
              <h3 className="font-sans font-bold text-lg text-[#dae2fd]">Harmonic Correction</h3>
            </div>
            <span className="p-2 rounded-lg bg-[#ca8100]/20 text-[#ffb95f]">
              <Gauge className="w-5 h-5" />
            </span>
          </div>

          <div className="my-2">
            <div className="font-sans font-bold text-4xl text-[#dae2fd]">
              {powerFactor}
            </div>
            <div className="font-mono text-xs text-[#4edea3] mt-1">Capacitor Bank Active</div>
          </div>

          <div className="w-full bg-[#2d3449] h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-[#ffb95f] h-full rounded-full" style={{ width: '98%' }} />
          </div>
        </div>

        {/* CO2 PPM */}
        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between border border-white/10 shadow-xl">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">Indoor Air Quality</span>
              <h3 className="font-sans font-bold text-lg text-[#dae2fd]">Average Campus CO2</h3>
            </div>
            <span className="p-2 rounded-lg bg-[#00a572]/20 text-[#4edea3]">
              <Wind className="w-5 h-5" />
            </span>
          </div>

          <div className="my-2">
            <div className="font-sans font-bold text-4xl text-[#dae2fd]">
              {co2Level} <span className="text-xl font-normal text-[#c2c6d6]">ppm</span>
            </div>
            <div className="font-mono text-xs text-[#4edea3] mt-1">ASHRAE 62.1 Compliant</div>
          </div>

          <div className="w-full bg-[#2d3449] h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-[#4edea3] h-full rounded-full" style={{ width: '42%' }} />
          </div>
        </div>

        {/* Ambient Lux */}
        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between border border-white/10 shadow-xl">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">Daylight Harvesting</span>
              <h3 className="font-sans font-bold text-lg text-[#dae2fd]">Atrium Lux Meter</h3>
            </div>
            <span className="p-2 rounded-lg bg-[#004395]/20 text-[#adc6ff]">
              <Sun className="w-5 h-5" />
            </span>
          </div>

          <div className="my-2">
            <div className="font-sans font-bold text-4xl text-[#dae2fd]">
              {lux} <span className="text-xl font-normal text-[#c2c6d6]">lx</span>
            </div>
            <div className="font-mono text-xs text-[#adc6ff] mt-1">Smart Dimmers Dimmed to 35%</div>
          </div>

          <div className="w-full bg-[#2d3449] h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-[#adc6ff] h-full rounded-full" style={{ width: '65%' }} />
          </div>
        </div>

        {/* Humidity */}
        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between border border-white/10 shadow-xl">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">Relative Humidity</span>
              <h3 className="font-sans font-bold text-lg text-[#dae2fd]">HVAC Psychrometrics</h3>
            </div>
            <span className="p-2 rounded-lg bg-[#00a572]/20 text-[#4edea3]">
              <Thermometer className="w-5 h-5" />
            </span>
          </div>

          <div className="my-2">
            <div className="font-sans font-bold text-4xl text-[#dae2fd]">
              {humidity} <span className="text-xl font-normal text-[#c2c6d6]">%</span>
            </div>
            <div className="font-mono text-xs text-[#4edea3] mt-1">Optimal Comfort Band (40-60%)</div>
          </div>

          <div className="w-full bg-[#2d3449] h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-[#4edea3] h-full rounded-full" style={{ width: '48%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
