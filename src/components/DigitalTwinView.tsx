import React, { useState } from 'react';
import { 
  Lightbulb, 
  Fan, 
  Snowflake, 
  Filter, 
  ChevronDown, 
  AlertTriangle, 
  Sparkles,
  Zap
} from 'lucide-react';
import { RoomData } from '../types';
import { initialRooms } from '../data/mockData';

export const DigitalTwinView: React.FC = () => {
  const [rooms, setRooms] = useState<RoomData[]>(initialRooms);
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [filterOccupiedOnly, setFilterOccupiedOnly] = useState<boolean>(false);

  const filteredRooms = rooms.filter((r) => {
    if (selectedZone !== 'All Zones' && r.zone !== selectedZone) return false;
    if (filterOccupiedOnly && r.status === 'Vacant') return false;
    return true;
  });

  // Interactive toggle for lights
  const toggleLight = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        const newLights = !r.devices.lights;
        const powerDelta = newLights ? 0.08 : -0.08;
        const newPower = Math.max(0.01, +(r.powerDraw + powerDelta).toFixed(2));
        return {
          ...r,
          devices: { ...r.devices, lights: newLights },
          powerDraw: newPower,
        };
      })
    );
  };

  // Interactive toggle for fans: OFF -> ON -> MAX -> OFF
  const toggleFan = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        const nextState: 'OFF' | 'ON' | 'MAX' =
          r.devices.fans === 'OFF' ? 'ON' : r.devices.fans === 'ON' ? 'MAX' : 'OFF';
        const powerMap = { OFF: -0.1, ON: 0.1, MAX: 0.25 };
        const newPower = Math.max(0.01, +(r.powerDraw + powerMap[nextState]).toFixed(2));
        return {
          ...r,
          devices: { ...r.devices, fans: nextState },
          powerDraw: newPower,
        };
      })
    );
  };

  // Interactive toggle for AC
  const toggleAC = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        const newAC = !r.devices.ac;
        const powerDelta = newAC ? 1.5 : -1.5;
        const newPower = Math.max(0.01, +(r.powerDraw + powerDelta).toFixed(2));
        const newTemp = newAC ? Math.max(20.0, +(r.temperature - 1.5).toFixed(1)) : +(r.temperature + 1.2).toFixed(1);
        return {
          ...r,
          devices: { ...r.devices, ac: newAC },
          powerDraw: newPower,
          temperature: newTemp,
        };
      })
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-[#1c2a22] tracking-tight">
            Digital Twin
          </h1>
          <p className="font-sans text-sm text-[#56655b] mt-0.5">
            Real-time spatial telemetry and environmental modeling.
          </p>
        </div>

        {/* Zone Selector & Filter Button */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="appearance-none bg-[#fdfbf6] border border-[#1c2a22]/10 rounded-lg py-2 pl-4 pr-10 font-mono text-xs text-[#1c2a22] focus:outline-none focus:border-[#1f4632] transition-colors cursor-pointer shadow-md"
            >
              <option>All Zones</option>
              <option>North Wing</option>
              <option>South Wing</option>
              <option>Laboratories</option>
              <option>Central</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#56655b] pointer-events-none" />
          </div>

          <button
            onClick={() => setFilterOccupiedOnly(!filterOccupiedOnly)}
            className={`border rounded-lg p-2 transition-all flex items-center justify-center ${
              filterOccupiedOnly
                ? 'bg-[#2f6b44]/20 border-[#3d7a4e] text-[#3d7a4e]'
                : 'bg-[#fdfbf6] border-[#1c2a22]/10 hover:bg-[#e7e1d3] text-[#56655b]'
            }`}
            title="Toggle Occupied Only Filter"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const isOccupied = room.status === 'Occupied';
          const isWarning = room.status === 'Warning';
          const isVacant = room.status === 'Vacant';

          return (
            <div
              key={room.id}
              className={`rounded-xl p-6 flex flex-col gap-6 relative overflow-hidden transition-all duration-200 shadow-xl ${
                isWarning
                  ? 'bg-[#f4f0e6] border-2 border-[#a8741a]/40 shadow-[#1f3d2b]/10'
                  : isVacant
                  ? 'bg-[#efe9dc] border border-[#1c2a22]/[0.07] opacity-85 hover:opacity-100'
                  : 'bg-[#f4f0e6] border border-[#1c2a22]/10 hover:border-[#1c2a22]/12'
              }`}
            >
              {/* Ambient Status Glow in Corner */}
              <div
                className={`hidden absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none ${
                  isWarning ? 'bg-[#a8741a]/15' :
                  isOccupied ? 'bg-[#3d7a4e]/10' :
                  'bg-transparent'
                }`}
              />

              {/* Room Header */}
              <div className="flex justify-between items-start z-10">
                <div>
                  <h2 className="font-sans font-bold text-lg md:text-xl text-[#1c2a22]">
                    {room.name}
                  </h2>
                  {isWarning && (
                    <div className="font-mono text-xs text-[#8a5f14] flex items-center gap-1 mt-1 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{room.warningMessage}</span>
                    </div>
                  )}
                  {!isWarning && (
                    <div className="font-mono text-[11px] text-[#56655b] mt-0.5">
                      {room.zone} • {room.co2Ppm} ppm CO2
                    </div>
                  )}
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-xs font-semibold border ${
                    isWarning
                      ? 'bg-[#b8862f]/20 text-[#8a5f14] border-[#a8741a]/30'
                      : isOccupied
                      ? 'bg-[#2f6b44]/15 text-[#3d7a4e] border-[#3d7a4e]/30'
                      : 'bg-[#e7e1d3]/40 text-[#56655b] border-[#1c2a22]/10'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isWarning ? 'bg-[#a8741a] animate-pulse' :
                      isOccupied ? 'bg-[#3d7a4e] animate-pulse' :
                      'bg-[#8a958c]'
                    }`}
                  />
                  <span>{room.status}</span>
                </span>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-4 z-10">
                {/* Temperature */}
                <div className="bg-[#fdfbf6] p-4 rounded-lg border border-[#1c2a22]/[0.07]">
                  <div className="font-mono text-xs text-[#56655b] mb-1">
                    Temperature
                  </div>
                  <div
                    className={`font-sans font-bold text-3xl md:text-4xl tracking-tighter ${
                      isWarning ? 'text-[#8a5f14]' : 'text-[#1c2a22]'
                    }`}
                  >
                    {room.temperature.toFixed(1)}
                    <span className="text-xl font-normal text-[#56655b] ml-1">°C</span>
                  </div>
                </div>

                {/* Power Draw */}
                <div className="bg-[#fdfbf6] p-4 rounded-lg border border-[#1c2a22]/[0.07] relative overflow-hidden">
                  {isWarning && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-[#a8741a]/30">
                      <div className="h-full bg-[#a8741a] w-[90%]" />
                    </div>
                  )}
                  <div className="font-mono text-xs text-[#56655b] mb-1">
                    Power Draw
                  </div>
                  <div
                    className={`font-sans font-bold text-3xl md:text-4xl tracking-tighter ${
                      isOccupied ? 'text-[#1f4632]' : 'text-[#1c2a22]'
                    }`}
                  >
                    {room.powerDraw}
                    <span className="text-xl font-normal text-[#56655b] ml-1">
                      {room.powerUnit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Fixture Toggles */}
              <div className="flex items-center gap-3 pt-3 border-t border-[#1c2a22]/[0.07] z-10">
                {/* Light Toggle */}
                <button
                  onClick={() => toggleLight(room.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    room.devices.lights
                      ? 'bg-[#fdfbf6] text-[#1c2a22] border-[#1f4632]/40 shadow-sm shadow-[#1f3d2b]/10'
                      : 'bg-[#fdfbf6]/40 text-[#56655b] border-[#1c2a22]/[0.07]'
                  }`}
                  title="Toggle Room Lights"
                >
                  <Lightbulb
                    className={`w-4 h-4 ${
                      room.devices.lights ? 'text-[#1f4632]' : 'text-[#737e76]'
                    }`}
                  />
                  <span className="font-mono text-xs font-bold">
                    {room.devices.lights ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* Fan Toggle */}
                <button
                  onClick={() => toggleFan(room.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    room.devices.fans === 'MAX'
                      ? 'bg-[#fdfbf6] text-[#8a5f14] border-[#a8741a]/40 shadow-sm shadow-[#1f3d2b]/10'
                      : room.devices.fans === 'ON'
                      ? 'bg-[#fdfbf6] text-[#1c2a22] border-[#1f4632]/40'
                      : 'bg-[#fdfbf6]/40 text-[#56655b] border-[#1c2a22]/[0.07]'
                  }`}
                  title="Toggle Fans (OFF -> ON -> MAX)"
                >
                  <Fan
                    className={`w-4 h-4 ${
                      room.devices.fans === 'MAX'
                        ? 'text-[#8a5f14] animate-spin'
                        : room.devices.fans === 'ON'
                        ? 'text-[#1f4632] animate-spin'
                        : 'text-[#737e76]'
                    }`}
                  />
                  <span className="font-mono text-xs font-bold">
                    {room.devices.fans}
                  </span>
                </button>

                {/* AC Toggle */}
                <button
                  onClick={() => toggleAC(room.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    room.devices.ac
                      ? 'bg-[#fdfbf6] text-[#1c2a22] border-[#1f4632]/40 shadow-sm shadow-[#1f3d2b]/10'
                      : 'bg-[#fdfbf6]/40 text-[#56655b] border-[#1c2a22]/[0.07]'
                  }`}
                  title="Toggle Air Conditioning"
                >
                  <Snowflake
                    className={`w-4 h-4 ${
                      room.devices.ac ? 'text-[#1f4632]' : 'text-[#737e76]'
                    }`}
                  />
                  <span className="font-mono text-xs font-bold">
                    {room.devices.ac ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
