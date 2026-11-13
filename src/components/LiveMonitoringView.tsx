import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  Gauge, 
  Thermometer, 
  Wind, 
  Sun, 
  Radio, 
  CheckCircle2,
  Upload
} from 'lucide-react';
import { ESP32SensorReading } from '../types';
import { ESP32SensorPanel } from './ESP32SensorPanel';

interface LiveMonitoringViewProps {
  esp32Readings: ESP32SensorReading[];
  onOpenUploadModal: () => void;
}

export const LiveMonitoringView: React.FC<LiveMonitoringViewProps> = ({
  esp32Readings,
  onOpenUploadModal
}) => {
  const [voltage, setVoltage] = useState(230.4);
  const [frequency, setFrequency] = useState(50.02);
  const [powerFactor, setPowerFactor] = useState(0.98);

  useEffect(() => {
    const interval = setInterval(() => {
      setVoltage(+(229.8 + Math.random() * 1.2).toFixed(1));
      setFrequency(+(49.98 + Math.random() * 0.08).toFixed(2));
      setPowerFactor(+(0.97 + Math.random() * 0.02).toFixed(2));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-[#1c2a22] tracking-tight">
            Live Telemetry & Sensor Fleet
          </h1>
          <p className="font-sans text-sm text-[#56655b] mt-0.5">
            High-frequency ESP32 multi-sensor telemetry, Modbus & LoRaWAN node feeds across campus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenUploadModal}
            className="font-mono text-xs px-3.5 py-2 rounded-xl bg-[#1f4632] hover:opacity-90 text-white font-bold border border-[#3d7a4e]/40 shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload ESP32 Log Data</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[#3d7a4e] bg-[#2f6b44]/15 px-3 py-2 rounded-xl border border-[#3d7a4e]/30">
            <span className="w-2 h-2 rounded-full bg-[#3d7a4e] animate-pulse" />
            <span>Streaming Mode: Real-time</span>
          </div>
        </div>
      </div>

      {/* Prominent ESP32 Multi-Sensor Telemetry Station Panel */}
      <ESP32SensorPanel
        readings={esp32Readings}
        onOpenUploadModal={onOpenUploadModal}
      />

      {/* Secondary Electrical Grid Substation Telemetry */}
      <div className="space-y-4">
        <h3 className="font-sans font-bold text-lg text-[#1c2a22] flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#1f4632]" />
          <span>Electrical Grid Substation Telemetry</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Voltage */}
          <div className="glass-panel rounded-xl p-5 flex flex-col justify-between border border-[#1c2a22]/10 shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-mono text-xs text-[#56655b] uppercase tracking-wider">Line-to-Neutral Voltage</span>
                <h4 className="font-sans font-bold text-base text-[#1c2a22]">Grid Phase A</h4>
              </div>
              <span className="p-2 rounded-lg bg-[#1f4632]/20 text-[#1f4632]">
                <Zap className="w-4 h-4" />
              </span>
            </div>

            <div className="my-2">
              <div className="font-sans font-bold text-3xl text-[#1c2a22]">
                {voltage} <span className="text-lg font-normal text-[#56655b]">V</span>
              </div>
              <div className="font-mono text-xs text-[#3d7a4e] mt-1">Status: Stable Nominal</div>
            </div>

            <div className="w-full bg-[#e7e1d3] h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-[#1f4632] h-full rounded-full" style={{ width: '92%' }} />
            </div>
          </div>

          {/* Frequency */}
          <div className="glass-panel rounded-xl p-5 flex flex-col justify-between border border-[#1c2a22]/10 shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-mono text-xs text-[#56655b] uppercase tracking-wider">Grid Frequency</span>
                <h4 className="font-sans font-bold text-base text-[#1c2a22]">Substation 1</h4>
              </div>
              <span className="p-2 rounded-lg bg-[#2f6b44]/20 text-[#3d7a4e]">
                <Activity className="w-4 h-4" />
              </span>
            </div>

            <div className="my-2">
              <div className="font-sans font-bold text-3xl text-[#3d7a4e]">
                {frequency} <span className="text-lg font-normal text-[#56655b]">Hz</span>
              </div>
              <div className="font-mono text-xs text-[#3d7a4e] mt-1">Sync Locked</div>
            </div>

            <div className="w-full bg-[#e7e1d3] h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-[#3d7a4e] h-full rounded-full" style={{ width: '99%' }} />
            </div>
          </div>

          {/* Power Factor */}
          <div className="glass-panel rounded-xl p-5 flex flex-col justify-between border border-[#1c2a22]/10 shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-mono text-xs text-[#56655b] uppercase tracking-wider">Power Factor (cos φ)</span>
                <h4 className="font-sans font-bold text-base text-[#1c2a22]">Harmonic Correction</h4>
              </div>
              <span className="p-2 rounded-lg bg-[#b8862f]/20 text-[#8a5f14]">
                <Gauge className="w-4 h-4" />
              </span>
            </div>

            <div className="my-2">
              <div className="font-sans font-bold text-3xl text-[#1c2a22]">
                {powerFactor}
              </div>
              <div className="font-mono text-xs text-[#3d7a4e] mt-1">Capacitor Active</div>
            </div>

            <div className="w-full bg-[#e7e1d3] h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-[#a8741a] h-full rounded-full" style={{ width: '98%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

