export type NavTab = 
  | 'dashboard' 
  | 'digital_twin' 
  | 'live_monitoring' 
  | 'occupancy' 
  | 'analytics' 
  | 'insights' 
  | 'load_control' 
  | 'alerts' 
  | 'devices' 
  | 'reports' 
  | 'settings';

export type TimeRange = 'daily' | 'weekly' | 'monthly';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO' | 'OFFLINE';
export type AlertCategory = 'Env' | 'Temp' | 'Power' | 'AI' | 'Comm';

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: AlertCategory;
  timestamp: string;
  timeAgo: string;
  resolved?: boolean;
  deviceId?: string;
}

export interface RoomDevice {
  lights: boolean;
  fans: 'OFF' | 'ON' | 'MAX';
  ac: boolean;
}

export interface RoomData {
  id: string;
  name: string;
  zone: 'North Wing' | 'South Wing' | 'Laboratories' | 'Central';
  status: 'Occupied' | 'Vacant' | 'Warning';
  warningMessage?: string;
  temperature: number;
  powerDraw: number;
  powerUnit: 'W' | 'kW';
  co2Ppm?: number;
  devices: RoomDevice;
}

export interface LoadItem {
  id: string;
  name: string;
  status: 'ON' | 'OFF';
  priority: 'HIGH' | 'MED' | 'LOW' | 'CRITICAL';
  draw: number;
  ratedDraw: number;
  unit: 'W' | 'kW';
  uptimeMinutes: number;
  percentage: number;
}

export interface AIRecommendation {
  id: string;
  target: string;
  location: string;
  type: 'Optimization' | 'Anomaly Detection' | 'Prediction';
  headline: string;
  description: string;
  confidence?: number;
  detectedTimeAgo?: string;
  predictedTime?: string;
  applied?: boolean;
  category: 'efficiency' | 'maintenance' | 'grid';
}

export interface ScheduledShift {
  id: string;
  title: string;
  time: string;
  statusColor: 'secondary' | 'tertiary' | 'primary';
  zone: string;
  action: string;
}

export interface DetectionLogItem {
  id: string;
  event: string;
  timeAgo: string;
  type: 'secondary' | 'tertiary' | 'on-surface-variant';
}

export interface CameraFeedInfo {
  id: string;
  name: string;
  location: string;
  fps: number;
  model: string;
  resolution: string;
  cpuLoad: number;
  imageSrc: string;
  boxes: Array<{
    id: string;
    label: string;
    confidence: number;
    top: number;
    left: number;
    width: number;
    height: number;
  }>;
}

export interface HourlyTrendRow {
  timeBlock: string;
  consumptionKwh: number;
  hvacLoadPercent: number;
  occupancy: number;
  status: 'Optimal' | 'High Load' | 'Off-Peak';
}

export interface ESP32SensorReading {
  id: string;
  sampleIndex: number;
  timestamp: string;
  dht22Temp: number;
  dht22Humidity: number;
  motion: boolean;
  co2Ppm: number;
  bme280Temp: number;
  bme280Humidity: number;
  bme280Pressure: number;
  ambientLightLux: number;
  rawBlock?: string;
}

export interface ESP32SystemStatus {
  isWarmingUp: boolean;
  totalSamples: number;
  lastUpdated: string;
  activeDeviceId: string;
  firmwareVersion: string;
  wifiSsid: string;
  ipAddress: string;
}

