import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Users, 
  ArrowUp, 
  BarChart2, 
  Camera, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  SlidersHorizontal,
  Maximize2
} from 'lucide-react';
import { CameraFeedInfo, DetectionLogItem } from '../types';
import { initialCameraFeeds, initialDetectionLogs } from '../data/mockData';

export const OccupancyView: React.FC = () => {
  const [selectedCameraId, setSelectedCameraId] = useState<string>('CAM_01_ATRIUM');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [peopleCount, setPeopleCount] = useState<number>(24);
  const [entryCount, setEntryCount] = useState<number>(45);
  const [exitCount, setExitCount] = useState<number>(21);
  const [logs, setLogs] = useState<DetectionLogItem[]>(initialDetectionLogs);
  const [snapshotTaken, setSnapshotTaken] = useState<boolean>(false);
  const [liveFps, setLiveFps] = useState<number>(29.97);

  const currentCam: CameraFeedInfo = 
    initialCameraFeeds.find((c) => c.id === selectedCameraId) || initialCameraFeeds[0];

  // Dynamic simulation for live feed
  useEffect(() => {
    const interval = setInterval(() => {
      // Slight FPS oscillation
      setLiveFps(+(29.85 + Math.random() * 0.25).toFixed(2));

      // Occasional log event tick
      if (Math.random() > 0.65) {
        const events = [
          { event: 'Person detected', type: 'secondary' as const },
          { event: 'Person exited', type: 'on-surface-variant' as const },
          { event: 'Group entered', type: 'tertiary' as const },
        ];
        const chosen = events[Math.floor(Math.random() * events.length)];
        const newLog: DetectionLogItem = {
          id: `det-${Date.now()}`,
          event: chosen.event,
          timeAgo: 'Just now',
          type: chosen.type,
        };

        setLogs((prev) => [newLog, ...prev.slice(0, 7)]);

        if (chosen.event === 'Person detected' || chosen.event === 'Group entered') {
          setEntryCount((e) => e + 1);
          setPeopleCount((p) => Math.min(40, p + (chosen.event === 'Group entered' ? 3 : 1)));
        } else if (chosen.event === 'Person exited') {
          setExitCount((e) => e + 1);
          setPeopleCount((p) => Math.max(10, p - 1));
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSnapshot = () => {
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
        <div>
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-[#dae2fd] tracking-tight">
            Occupancy
          </h1>
          <p className="font-sans text-sm text-[#c2c6d6] mt-0.5">
            {currentCam.location}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Camera Selection Dropdown */}
          <div className="relative">
            <select
              value={selectedCameraId}
              onChange={(e) => setSelectedCameraId(e.target.value)}
              className="bg-[#171f33] text-[#dae2fd] font-mono text-xs border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#adc6ff] transition-colors cursor-pointer"
            >
              {initialCameraFeeds.map((cam) => (
                <option key={cam.id} value={cam.id}>
                  {cam.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#00a572]/15 border border-[#4edea3]/30 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-sm shadow-[#00a572]/10">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
            <span className="font-mono text-xs font-semibold text-[#4edea3] tracking-wider">
              AI DETECTION ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {/* YOLOv8 Camera Feed Preview (Hero - 8 cols) */}
        <div className="glass-panel rounded-xl overflow-hidden md:col-span-8 flex flex-col relative ambient-glow border border-white/10 shadow-2xl">
          {/* Feed Header */}
          <div className="px-4 py-2.5 border-b border-white/5 flex justify-between items-center bg-[#2d3449]/40">
            <div className="font-mono text-xs text-[#c2c6d6] flex items-center gap-2">
              <Video className="w-4 h-4 text-[#4edea3]" />
              <span className="font-semibold text-[#dae2fd]">{currentCam.name}</span>
            </div>
            
            <div className="flex items-center gap-3 font-mono text-[11px] text-[#adc6ff]">
              <span>FPS: {liveFps}</span>
              <span className="opacity-50">|</span>
              <span>MODEL: {currentCam.model}</span>
              <span className="opacity-50 hidden sm:inline">|</span>
              <span className="hidden sm:inline">CPU: {currentCam.cpuLoad}%</span>
            </div>
          </div>

          {/* Feed Canvas */}
          <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] bg-black overflow-hidden select-none">
            {/* Background Stream Image */}
            <img 
              src={currentCam.imageSrc}
              alt="Live Security Camera Stream"
              className="absolute inset-0 w-full h-full object-cover opacity-65 transition-opacity duration-300"
              referrerPolicy="no-referrer"
            />

            {/* Tech Aesthetic Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Corner Bracket Reticles */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#4edea3]/80 pointer-events-none" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#4edea3]/80 pointer-events-none" />
            <div className="absolute bottom-12 left-3 w-4 h-4 border-b-2 border-l-2 border-[#4edea3]/80 pointer-events-none" />
            <div className="absolute bottom-12 right-3 w-4 h-4 border-b-2 border-r-2 border-[#4edea3]/80 pointer-events-none" />

            {/* Simulated YOLO Bounding Boxes */}
            {showBoundingBoxes && currentCam.boxes.map((box) => (
              <div 
                key={box.id}
                className="yolo-box"
                style={{ 
                  top: `${box.top}%`, 
                  left: `${box.left}%`, 
                  width: `${box.width}px`, 
                  height: `${box.height}px` 
                }}
              >
                <span className="yolo-label">
                  {box.label} {box.confidence.toFixed(2)}
                </span>
              </div>
            ))}

            {/* Snapshot Toast notification */}
            {snapshotTaken && (
              <div className="absolute inset-0 bg-white/20 backdrop-blur-xs flex items-center justify-center animate-pulse z-30">
                <span className="font-mono text-xs bg-black/80 text-[#4edea3] px-3 py-1.5 rounded-md border border-[#4edea3]/40">
                  SNAPSHOT RECORDED • SAVED TO LOCAL LOGS
                </span>
              </div>
            )}

            {/* Interactive Stream Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 flex items-center justify-between text-xs font-mono text-[#c2c6d6]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-white text-[11px]">LIVE REC</span>
                <span className="opacity-40">|</span>
                <span className="text-[11px] text-[#adc6ff]">{currentCam.resolution}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                  className="px-2 py-1 rounded bg-[#2d3449]/70 hover:bg-[#31394d] text-white flex items-center gap-1 transition-colors text-[11px]"
                  title="Toggle YOLO Bounding Boxes"
                >
                  {showBoundingBoxes ? <Eye className="w-3.5 h-3.5 text-[#4edea3]" /> : <EyeOff className="w-3.5 h-3.5 text-gray-400" />}
                  <span>{showBoundingBoxes ? 'Boxes ON' : 'Boxes OFF'}</span>
                </button>

                <button
                  onClick={handleSnapshot}
                  className="p-1.5 rounded bg-[#2d3449]/70 hover:bg-[#31394d] text-white transition-colors"
                  title="Take Frame Snapshot"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Stats Sidebar (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-4 md:gap-6">
          {/* Occupied Status Card */}
          <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden text-center border-t-2 border-t-[#4edea3] ambient-glow-secondary">
            <h3 className="font-mono text-xs text-[#c2c6d6] uppercase tracking-widest mb-1.5">
              STATUS
            </h3>
            <div className="font-sans font-extrabold text-4xl md:text-5xl text-[#4edea3] text-glow-secondary tracking-tight">
              OCCUPIED
            </div>
            <p className="font-mono text-[11px] text-[#4edea3]/80 mt-1">
              Density: High Activity Detected
            </p>
          </div>

          {/* People Detected KPI */}
          <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">
                People Detected
              </h3>
              <span className="p-1.5 rounded-lg bg-[#2d3449]/60 text-[#adc6ff]">
                <Users className="w-5 h-5" />
              </span>
            </div>

            <div className="font-sans font-bold text-4xl md:text-5xl text-[#dae2fd] tracking-tight">
              {peopleCount}
            </div>

            <div className="mt-2 text-[#adc6ff] font-mono text-xs flex items-center gap-1">
              <ArrowUp className="w-3.5 h-3.5 text-[#4edea3]" />
              <span className="text-[#4edea3] font-semibold">12%</span>
              <span className="text-[#c2c6d6]/70">vs last hour</span>
            </div>
          </div>

          {/* Mini Stats Grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="glass-panel rounded-xl p-4">
              <h4 className="font-mono text-[11px] text-[#c2c6d6]/80 mb-1">
                Avg Confidence
              </h4>
              <div className="font-sans font-bold text-xl md:text-2xl text-[#dae2fd]">
                96.8%
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4">
              <h4 className="font-mono text-[11px] text-[#c2c6d6]/80 mb-1">
                Entry / Exit
              </h4>
              <div className="font-sans font-bold text-xl md:text-2xl text-[#dae2fd]">
                {entryCount} / {exitCount}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section: Occupancy History (8 cols) */}
        <div className="glass-panel rounded-xl p-5 md:p-6 md:col-span-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">
                Occupancy History (Last 6 Hours)
              </h3>
              <p className="font-sans text-xs text-[#c2c6d6]/60 mt-0.5">Headcount distribution & rush-hour trend</p>
            </div>
            <BarChart2 className="w-4 h-4 text-[#c2c6d6]" />
          </div>

          {/* Simulated Bar Chart */}
          <div className="flex-1 w-full h-44 flex items-end justify-between gap-2.5 relative border-l border-b border-white/10 px-3 pb-2 pt-4">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-15">
              <div className="border-t border-white/40 w-full" />
              <div className="border-t border-white/40 w-full" />
              <div className="border-t border-white/40 w-full" />
            </div>

            <div className="flex-1 group relative flex flex-col items-center justify-end h-full">
              <div className="w-full bg-[#adc6ff]/25 group-hover:bg-[#adc6ff]/50 transition-all rounded-t-sm" style={{ height: '30%' }} />
              <span className="opacity-0 group-hover:opacity-100 absolute -top-6 font-mono text-[10px] bg-[#171f33] text-[#adc6ff] px-1.5 py-0.5 rounded border border-white/10 transition-opacity">8</span>
            </div>

            <div className="flex-1 group relative flex flex-col items-center justify-end h-full">
              <div className="w-full bg-[#adc6ff]/35 group-hover:bg-[#adc6ff]/60 transition-all rounded-t-sm" style={{ height: '45%' }} />
              <span className="opacity-0 group-hover:opacity-100 absolute -top-6 font-mono text-[10px] bg-[#171f33] text-[#adc6ff] px-1.5 py-0.5 rounded border border-white/10 transition-opacity">12</span>
            </div>

            <div className="flex-1 group relative flex flex-col items-center justify-end h-full">
              <div className="w-full bg-[#adc6ff]/25 group-hover:bg-[#adc6ff]/50 transition-all rounded-t-sm" style={{ height: '35%' }} />
              <span className="opacity-0 group-hover:opacity-100 absolute -top-6 font-mono text-[10px] bg-[#171f33] text-[#adc6ff] px-1.5 py-0.5 rounded border border-white/10 transition-opacity">9</span>
            </div>

            <div className="flex-1 group relative flex flex-col items-center justify-end h-full">
              <div className="w-full bg-[#adc6ff]/50 group-hover:bg-[#adc6ff]/75 transition-all rounded-t-sm" style={{ height: '60%' }} />
              <span className="opacity-0 group-hover:opacity-100 absolute -top-6 font-mono text-[10px] bg-[#171f33] text-[#adc6ff] px-1.5 py-0.5 rounded border border-white/10 transition-opacity">16</span>
            </div>

            <div className="flex-1 group relative flex flex-col items-center justify-end h-full">
              <div className="w-full bg-[#adc6ff]/80 group-hover:bg-[#adc6ff] transition-all rounded-t-sm" style={{ height: '85%' }} />
              <span className="opacity-0 group-hover:opacity-100 absolute -top-6 font-mono text-[10px] bg-[#171f33] text-[#adc6ff] px-1.5 py-0.5 rounded border border-white/10 transition-opacity">22</span>
            </div>

            <div className="flex-1 group relative flex flex-col items-center justify-end h-full">
              <div className="w-full bg-[#4edea3]/85 group-hover:bg-[#4edea3] transition-all rounded-t-sm shadow-md shadow-[#4edea3]/20" style={{ height: '100%' }} />
              <span className="opacity-0 group-hover:opacity-100 absolute -top-6 font-mono text-[10px] bg-[#171f33] text-[#4edea3] font-bold px-1.5 py-0.5 rounded border border-[#4edea3]/30 transition-opacity">{peopleCount}</span>
            </div>
          </div>

          {/* Time Labels */}
          <div className="flex justify-between text-[#c2c6d6]/60 font-mono text-[11px] mt-2.5 px-2">
            <span>10:00</span>
            <span>11:00</span>
            <span>12:00</span>
            <span>13:00</span>
            <span>14:00</span>
            <span className="text-[#4edea3] font-bold">Now</span>
          </div>
        </div>

        {/* Detailed Breakdown List: Detection Log (4 cols) */}
        <div className="glass-panel rounded-xl p-5 md:p-6 md:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">
                Detection Log
              </h3>
              <span className="font-mono text-[11px] text-[#4edea3] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
                Live
              </span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[200px] pr-1">
              {logs.map((log) => {
                const isSecondary = log.type === 'secondary';
                const isTertiary = log.type === 'tertiary';

                return (
                  <div 
                    key={log.id} 
                    className="flex justify-between items-center py-1.5 border-b border-white/5 text-xs font-sans hover:bg-white/5 px-1.5 rounded transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSecondary ? 'bg-[#4edea3]' :
                          isTertiary ? 'bg-[#ffb95f]' :
                          'bg-[#8c909f]'
                        }`} 
                      />
                      <span className="text-[#dae2fd]">{log.event}</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#c2c6d6]/60">
                      {log.timeAgo}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setLogs(initialDetectionLogs)}
            className="mt-4 pt-2 border-t border-white/5 font-mono text-xs text-[#adc6ff]/70 hover:text-[#adc6ff] flex items-center justify-center gap-1 w-full"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Stream Buffer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
