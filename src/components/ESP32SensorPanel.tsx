import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Thermometer, 
  Wind, 
  Sun, 
  Gauge, 
  Radio, 
  Upload, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Terminal,
  Clock
} from 'lucide-react';
import { ESP32SensorReading } from '../types';

interface ESP32SensorPanelProps {
  readings: ESP32SensorReading[];
  onOpenUploadModal: () => void;
}

export const ESP32SensorPanel: React.FC<ESP32SensorPanelProps> = ({
  readings,
  onOpenUploadModal
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Fallback if empty
  const activeReading: ESP32SensorReading = readings[currentIndex] || {
    id: 'demo-1',
    sampleIndex: 1,
    timestamp: '16:26:00',
    dht22Temp: 23.00,
    dht22Humidity: 72.60,
    motion: true,
    co2Ppm: 1277,
    bme280Temp: 23.15,
    bme280Humidity: 71.80,
    bme280Pressure: 1006.42,
    ambientLightLux: 92.30
  };

  useEffect(() => {
    if (!isPlaying || readings.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % readings.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [isPlaying, readings.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + readings.length) % readings.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % readings.length);
  };

  const tempDelta = (activeReading.bme280Temp - activeReading.dht22Temp).toFixed(2);
  const humDelta = (activeReading.dht22Humidity - activeReading.bme280Humidity).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Panel Header & Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl bg-[#131b2e]/80 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#00a572]/20 border border-[#4edea3]/40 flex items-center justify-center text-[#4edea3] shadow-lg shadow-[#00a572]/20">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sans font-bold text-xl text-[#dae2fd] tracking-tight">
                  ESP32 Multi-Sensor Node (ESP32-MS-01)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#00a572]/20 text-[#4edea3] border border-[#4edea3]/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping" />
                  Live Telemetry Sync
                </span>
              </div>
              <p className="font-sans text-xs text-[#c2c6d6] mt-0.5">
                Active Node: Node-Lab201 • Firmware: v2.1.0-RTOS • {readings.length} Uploaded Sensor Frames
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Scrubber playback controls */}
            <div className="flex items-center gap-1 bg-[#0b1326] p-1.5 rounded-xl border border-white/10 font-mono text-xs text-[#dae2fd]">
              <button
                onClick={handlePrev}
                className="p-1.5 hover:bg-white/10 rounded-lg text-[#adc6ff] transition-colors cursor-pointer"
                title="Previous Sample Frame"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 px-2.5 ${
                  isPlaying ? 'bg-[#00a572]/20 text-[#4edea3]' : 'bg-white/10 text-white'
                }`}
                title={isPlaying ? 'Pause Simulation' : 'Play Live Simulation'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{isPlaying ? 'Streaming' : 'Paused'}</span>
              </button>

              <button
                onClick={handleNext}
                className="p-1.5 hover:bg-white/10 rounded-lg text-[#adc6ff] transition-colors cursor-pointer"
                title="Next Sample Frame"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <span className="px-2 text-[11px] text-[#c2c6d6]/70 border-l border-white/10 ml-1">
                Sample {activeReading.sampleIndex} / {readings.length}
              </span>
            </div>

            <button
              onClick={onOpenUploadModal}
              className="font-mono text-xs px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00a572] to-[#004395] hover:opacity-90 text-white font-bold shadow-lg shadow-[#00a572]/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload ESP32 Serial Log</span>
            </button>
          </div>
        </div>

        {/* Timeline Frame Scrubber Bar */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between font-mono text-[11px] text-[#c2c6d6]/70 mb-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#4edea3]" />
              <span>Telemetry Frame Timeline ({readings.length} Frames Parsed)</span>
            </span>
            <span>Current Frame Time: {activeReading.timestamp}</span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {readings.map((reading, idx) => {
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={reading.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`p-2 rounded-lg border font-mono text-xs text-center transition-all cursor-pointer flex flex-col items-center justify-between h-14 ${
                    isCurrent
                      ? 'bg-[#00a572]/25 text-[#4edea3] border-[#4edea3] shadow-md shadow-[#00a572]/30 scale-105 font-bold'
                      : reading.motion
                      ? 'bg-[#ffb95f]/10 text-[#ffb95f] border-[#ffb95f]/30 hover:bg-[#ffb95f]/20'
                      : 'bg-[#0b1326]/60 text-[#c2c6d6]/70 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="text-[10px]">#{reading.sampleIndex}</span>
                  <span className="text-[9px] font-bold">
                    {reading.dht22Temp.toFixed(1)}°C
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full mt-0.5 ${
                      reading.motion ? 'bg-[#ffb95f] animate-ping' : 'bg-[#4edea3]/40'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Sensor Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Dual Temperature Comparison */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#00a572]/10 rounded-full blur-2xl group-hover:bg-[#00a572]/20 transition-all" />
          
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">Dual Ambient Temperature</span>
              <h3 className="font-sans font-bold text-lg text-[#dae2fd] mt-0.5">DHT22 vs BME280</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-[#00a572]/20 text-[#4edea3] border border-[#4edea3]/30">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>

          <div className="my-4 space-y-3">
            <div className="flex items-baseline justify-between bg-[#0b1326]/60 p-3 rounded-xl border border-white/5">
              <div>
                <span className="font-mono text-[11px] text-[#c2c6d6]/70 block">DHT22 Sensor</span>
                <span className="font-sans font-bold text-2xl text-[#4edea3]">
                  {activeReading.dht22Temp.toFixed(2)} <span className="text-sm text-[#c2c6d6]">°C</span>
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-[11px] text-[#c2c6d6]/70 block">BME280 Precision</span>
                <span className="font-sans font-bold text-2xl text-[#adc6ff]">
                  {activeReading.bme280Temp.toFixed(2)} <span className="text-sm text-[#c2c6d6]">°C</span>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between font-mono text-xs px-1">
              <span className="text-[#c2c6d6]">Cross-Sensor Delta:</span>
              <span className="text-[#4edea3] font-bold">+{tempDelta} °C (Nominal Variance)</span>
            </div>
          </div>

          <div className="w-full bg-[#2d3449] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#00a572] to-[#4d8eff] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (activeReading.dht22Temp / 40) * 100)}%` }}
            />
          </div>
        </div>

        {/* Card 2: Dual Humidity */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">Relative Humidity</span>
              <h3 className="font-sans font-bold text-lg text-[#dae2fd] mt-0.5">Psychrometric Sensing</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-[#004395]/20 text-[#adc6ff] border border-[#adc6ff]/30">
              <Wind className="w-5 h-5" />
            </div>
          </div>

          <div className="my-4 space-y-3">
            <div className="flex items-baseline justify-between bg-[#0b1326]/60 p-3 rounded-xl border border-white/5">
              <div>
                <span className="font-mono text-[11px] text-[#c2c6d6]/70 block">DHT22 Relative</span>
                <span className="font-sans font-bold text-2xl text-[#adc6ff]">
                  {activeReading.dht22Humidity.toFixed(2)} <span className="text-sm text-[#c2c6d6]">%</span>
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-[11px] text-[#c2c6d6]/70 block">BME280 Calibrated</span>
                <span className="font-sans font-bold text-2xl text-[#4edea3]">
                  {activeReading.bme280Humidity.toFixed(2)} <span className="text-sm text-[#c2c6d6]">%</span>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between font-mono text-xs px-1">
              <span className="text-[#c2c6d6]">Humidity Delta:</span>
              <span className="text-[#adc6ff] font-bold">+{humDelta} %</span>
            </div>
          </div>

          <div className="w-full bg-[#2d3449] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#adc6ff] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, activeReading.dht22Humidity)}%` }}
            />
          </div>
        </div>

        {/* Card 3: Motion & Occupancy Sensor */}
        <div className={`glass-panel p-5 rounded-2xl border shadow-xl flex flex-col justify-between transition-all duration-300 ${
          activeReading.motion 
            ? 'border-[#ffb95f]/50 bg-[#ffb95f]/5 shadow-[#ffb95f]/10' 
            : 'border-white/10 bg-[#131b2e]/80'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">PIR Radar Sensor</span>
              <h3 className="font-sans font-bold text-lg text-[#dae2fd] mt-0.5">Physical Occupancy</h3>
            </div>
            <div className={`p-2.5 rounded-xl border ${
              activeReading.motion
                ? 'bg-[#ffb95f]/20 text-[#ffb95f] border-[#ffb95f]/40'
                : 'bg-white/5 text-[#c2c6d6] border-white/10'
            }`}>
              <Radio className={`w-5 h-5 ${activeReading.motion ? 'animate-ping' : ''}`} />
            </div>
          </div>

          <div className="my-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#c2c6d6]">Current Motion State:</span>
              {activeReading.motion ? (
                <span className="px-3 py-1 rounded-lg bg-[#ffb95f]/20 text-[#ffb95f] border border-[#ffb95f]/40 font-mono text-xs font-bold animate-pulse flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ffb95f] animate-ping" />
                  DETECTED!
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-white/5 text-[#c2c6d6]/70 border border-white/10 font-mono text-xs">
                  No Motion
                </span>
              )}
            </div>

            <div className="p-3 bg-[#0b1326]/60 rounded-xl border border-white/5 font-mono text-xs text-[#c2c6d6]">
              {activeReading.motion ? (
                <span className="text-[#ffb95f] font-semibold">
                  ⚠️ Person detected in Zone 201 — HVAC fresh air damper auto-opened.
                </span>
              ) : (
                <span>Space unoccupied during sample frame #{activeReading.sampleIndex}.</span>
              )}
            </div>
          </div>

          <div className="font-mono text-[11px] text-[#c2c6d6]/60 flex items-center justify-between pt-2 border-t border-white/5">
            <span>Sensor Pin: GPIO 13</span>
            <span>Total Detections: {readings.filter(r => r.motion).length} / {readings.length}</span>
          </div>
        </div>

        {/* Card 4: Indoor CO2 Levels */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">Air Quality Sensor</span>
              <h3 className="font-sans font-bold text-lg text-[#dae2fd] mt-0.5">Carbon Dioxide (CO2)</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-[#ca8100]/20 text-[#ffb95f] border border-[#ffb95f]/30">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="my-4">
            <div className="font-sans font-bold text-4xl text-[#dae2fd]">
              {activeReading.co2Ppm} <span className="text-xl font-normal text-[#c2c6d6]">ppm</span>
            </div>
            <div className="font-mono text-xs text-[#ffb95f] mt-1.5 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>
                {activeReading.co2Ppm > 1200
                  ? 'Elevated CO2 — Ventilation Recommended'
                  : 'Optimal Outdoor Ambient Levels'}
              </span>
            </div>
          </div>

          <div className="w-full bg-[#2d3449] h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                activeReading.co2Ppm > 1200 ? 'bg-[#ffb95f]' : 'bg-[#4edea3]'
              }`}
              style={{ width: `${Math.min(100, (activeReading.co2Ppm / 2000) * 100)}%` }}
            />
          </div>
        </div>

        {/* Card 5: Atmospheric Pressure */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">BME280 Pressure</span>
              <h3 className="font-sans font-bold text-lg text-[#dae2fd] mt-0.5">Barometric Sensor</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-[#00a572]/20 text-[#4edea3] border border-[#4edea3]/30">
              <Gauge className="w-5 h-5" />
            </div>
          </div>

          <div className="my-4">
            <div className="font-sans font-bold text-4xl text-[#dae2fd]">
              {activeReading.bme280Pressure.toFixed(2)} <span className="text-xl font-normal text-[#c2c6d6]">hPa</span>
            </div>
            <div className="font-mono text-xs text-[#4edea3] mt-1.5">
              Standard Sea Level Barometric Pressure
            </div>
          </div>

          <div className="w-full bg-[#2d3449] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#4edea3] h-full rounded-full transition-all duration-500"
              style={{ width: '85%' }}
            />
          </div>
        </div>

        {/* Card 6: Ambient Light Lux */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">LDR Photocell</span>
              <h3 className="font-sans font-bold text-lg text-[#dae2fd] mt-0.5">Ambient Illuminance</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-[#004395]/20 text-[#adc6ff] border border-[#adc6ff]/30">
              <Sun className="w-5 h-5" />
            </div>
          </div>

          <div className="my-4">
            <div className="font-sans font-bold text-4xl text-[#dae2fd]">
              {activeReading.ambientLightLux.toFixed(1)} <span className="text-xl font-normal text-[#c2c6d6]">lux</span>
            </div>
            <div className="font-mono text-xs text-[#adc6ff] mt-1.5">
              Indoor Workspace Daylight Level
            </div>
          </div>

          <div className="w-full bg-[#2d3449] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#adc6ff] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (activeReading.ambientLightLux / 200) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Raw ESP32 Output Block for Current Frame */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#0b1326]/70 shadow-xl font-mono text-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#4edea3] flex items-center gap-2 font-bold">
            <Terminal className="w-4 h-4" />
            <span>Raw Serial Console Telemetry Feed — Frame #{activeReading.sampleIndex}</span>
          </span>
          <span className="text-[#c2c6d6]/60 text-[11px]">Baud Rate: 115200 N81</span>
        </div>

        <pre className="bg-[#070c18] p-4 rounded-xl text-[#4edea3] border border-white/5 overflow-x-auto leading-relaxed shadow-inner">
          <code>
{`---------------------------------
Timestamp: ${activeReading.timestamp} [Frame #${activeReading.sampleIndex}]
Temperature (DHT22): ${activeReading.dht22Temp.toFixed(2)} °C
Humidity (DHT22): ${activeReading.dht22Humidity.toFixed(2)} %
Motion: ${activeReading.motion ? 'DETECTED!' : 'No Motion'}
CO2: ${activeReading.co2Ppm} ppm
Temperature (BME280): ${activeReading.bme280Temp.toFixed(2)} °C
Humidity (BME280): ${activeReading.bme280Humidity.toFixed(2)} %
Pressure (BME280): ${activeReading.bme280Pressure.toFixed(2)} hPa
Ambient Light: ${activeReading.ambientLightLux.toFixed(2)} lux
---------------------------------`}
          </code>
        </pre>
      </div>
    </div>
  );
};
