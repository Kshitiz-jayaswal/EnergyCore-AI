import React, { useState } from 'react';
import { 
  Router, 
  Wifi, 
  WifiOff, 
  Cpu, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Radio,
  Upload
} from 'lucide-react';

interface DeviceItem {
  id: string;
  name: string;
  type: string;
  ip: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  firmware: string;
  lastPing: string;
}

interface DevicesViewProps {
  onOpenUploadModal?: () => void;
}

const initialDevices: DeviceItem[] = [
  { id: 'dev-0', name: 'ESP32-MS-01', type: 'Multi Sensor Station (DHT22, BME280, PIR, MQ135)', ip: '192.168.10.77', status: 'ONLINE', firmware: 'v2.1.0-rtos', lastPing: '2ms' },
  { id: 'dev-1', name: 'ESP32-CAM-01', type: 'YOLO Computer Vision Node', ip: '192.168.10.45', status: 'ONLINE', firmware: 'v1.4.2-rtos', lastPing: '4ms' },
  { id: 'dev-2', name: 'ESP32-CAM-02', type: 'Turnstile Vision Node', ip: '192.168.10.46', status: 'ONLINE', firmware: 'v1.4.2-rtos', lastPing: '6ms' },
  { id: 'dev-3', name: 'ESP32-CAM-04', type: 'Corridor Vision Node', ip: '192.168.10.48', status: 'OFFLINE', firmware: 'v1.3.9-rtos', lastPing: 'Timeout' },
  { id: 'dev-4', name: 'MODBUS-GW-01', type: 'Schneider Energy Meter Bridge', ip: '192.168.20.10', status: 'ONLINE', firmware: 'v3.1.0-linux', lastPing: '2ms' },
  { id: 'dev-5', name: 'BACNET-MSTP-02', type: 'Trane Chiller Controller', ip: '192.168.20.14', status: 'ONLINE', firmware: 'v2.8.4', lastPing: '3ms' },
  { id: 'dev-6', name: 'LORAWAN-GW-CENTRAL', type: 'Sensedge Air Quality Hub', ip: '192.168.30.01', status: 'ONLINE', firmware: 'v4.0.1', lastPing: '8ms' },
];

export const DevicesView: React.FC<DevicesViewProps> = ({ onOpenUploadModal }) => {

  const [devices, setDevices] = useState<DeviceItem[]>(initialDevices);
  const [pingingId, setPingingId] = useState<string | null>(null);

  const handlePing = (id: string) => {
    setPingingId(id);
    setTimeout(() => {
      setDevices((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, status: 'ONLINE', lastPing: `${Math.floor(4 + Math.random() * 8)}ms` } : d
        )
      );
      setPingingId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-[#dae2fd] tracking-tight">
            Hardware & IoT Gateway Fleet
          </h1>
          <p className="font-sans text-sm text-[#c2c6d6] mt-0.5">
            Distributed edge compute nodes, ESP32 vision microcontrollers, and Modbus submeter gateways.
          </p>
        </div>

        <button
          onClick={() => {
            setDevices((prev) => prev.map((d) => ({ ...d, lastPing: `${Math.floor(3 + Math.random() * 10)}ms` })));
          }}
          className="font-mono text-xs px-3.5 py-2 rounded-lg bg-[#adc6ff]/10 hover:bg-[#adc6ff]/20 text-[#adc6ff] border border-[#adc6ff]/30 transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Ping All Devices</span>
        </button>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-white/10 shadow-xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse font-sans text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-[#131b2e]/60 font-mono text-xs text-[#c2c6d6]/60 uppercase tracking-wider">
                <th className="py-4 px-6">Device Name</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">IP Address</th>
                <th className="py-4 px-6">Firmware</th>
                <th className="py-4 px-6">Latency</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#dae2fd]">
              {devices.map((device) => {
                const isOnline = device.status === 'ONLINE';

                return (
                  <tr key={device.id} className="hover:bg-[#2d3449]/30 transition-colors">
                    <td className="py-4 px-6 font-semibold flex items-center gap-2.5">
                      <Router className="w-4 h-4 text-[#adc6ff]" />
                      <span>{device.name}</span>
                    </td>
                    <td className="py-4 px-6 text-[#c2c6d6]">{device.type}</td>
                    <td className="py-4 px-6 font-mono text-xs">{device.ip}</td>
                    <td className="py-4 px-6 font-mono text-xs text-[#c2c6d6]/70">{device.firmware}</td>
                    <td className="py-4 px-6 font-mono text-xs text-[#4edea3]">{device.lastPing}</td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[10px] font-bold border ${
                          isOnline
                            ? 'bg-[#00a572]/15 text-[#4edea3] border-[#4edea3]/30'
                            : 'bg-[#93000a]/20 text-[#ffb4ab] border-[#ffb4ab]/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isOnline ? 'bg-[#4edea3] animate-pulse' : 'bg-[#ffb4ab]'
                          }`}
                        />
                        <span>{device.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right flex items-center justify-end gap-2">
                      {device.id === 'dev-0' && onOpenUploadModal && (
                        <button
                          onClick={onOpenUploadModal}
                          className="font-mono text-xs px-3 py-1 bg-[#00a572]/20 hover:bg-[#00a572]/30 text-[#4edea3] rounded border border-[#4edea3]/40 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Log</span>
                        </button>
                      )}
                      <button
                        onClick={() => handlePing(device.id)}
                        disabled={pingingId === device.id}
                        className="font-mono text-xs px-3 py-1 bg-white/5 hover:bg-white/10 text-[#adc6ff] rounded border border-white/10 transition-colors cursor-pointer"
                      >
                        {pingingId === device.id ? 'Pinging...' : 'Ping'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
