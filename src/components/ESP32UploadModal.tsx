import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  RefreshCw,
  Copy,
  Check,
  Play,
  Pause,
  Thermometer,
  Wind,
  Sun,
  Gauge,
  Radio
} from 'lucide-react';
import { ESP32SensorReading } from '../types';
import { parseESP32SerialLogs, RAW_USER_LOG } from '../utils/esp32Parser';

interface ESP32UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadData: (readings: ESP32SensorReading[]) => void;
  currentReadings: ESP32SensorReading[];
  onSelectReading?: (reading: ESP32SensorReading) => void;
  selectedReadingIndex?: number;
}

export const ESP32UploadModal: React.FC<ESP32UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadData,
  currentReadings,
  onSelectReading,
  selectedReadingIndex = 0,
}) => {
  const [rawText, setRawText] = useState<string>(RAW_USER_LOG);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'view_samples' | 'esp32_code'>('upload');
  const [parsedPreview, setParsedPreview] = useState<ESP32SensorReading[]>(parseESP32SerialLogs(RAW_USER_LOG));
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTextChange = (text: string) => {
    setRawText(text);
    const parsed = parseESP32SerialLogs(text);
    setParsedPreview(parsed);
  };

  const handleApplyUpload = () => {
    if (parsedPreview.length === 0) {
      setStatusMessage('Error: No valid ESP32 sensor frames found in provided text.');
      return;
    }
    onUploadData(parsedPreview);
    setStatusMessage(`Successfully uploaded ${parsedPreview.length} ESP32 sensor frames into live database!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleLoadSampleLog = () => {
    setRawText(RAW_USER_LOG);
    const parsed = parseESP32SerialLogs(RAW_USER_LOG);
    setParsedPreview(parsed);
    setStatusMessage('Loaded pre-configured 10-sample ESP32 serial output.');
  };

  const handleCopyLog = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleArduinoCode = `#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <Adafruit_BME280.h>

#define DHTPIN 4
#define DHTTYPE DHT22
#define PIR_PIN 13
#define LDR_PIN 34
#define MQ135_PIN 35

DHT dht(DHTPIN, DHTTYPE);
Adafruit_BME280 bme;

const char* ssid = "EnergyCore-IoT";
const char* password = "SecureKey123";
const char* serverUrl = "https://energycore.ai/api/sensor-data";

void setup() {
  Serial.begin(115200);
  dht.begin();
  bme.begin(0x76);
  pinMode(PIR_PIN, INPUT);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nConnected to Wi-Fi");
}

void loop() {
  float dhtTemp = dht.readTemperature();
  float dhtHum = dht.readHumidity();
  bool motion = digitalRead(PIR_PIN);
  float bmeTemp = bme.readTemperature();
  float bmeHum = bme.readHumidity();
  float bmePress = bme.readPressure() / 100.0F;
  int co2 = analogRead(MQ135_PIN); // Calibrated ppm
  float lux = analogRead(LDR_PIN) * (1000.0 / 4095.0);

  Serial.println("=================================");
  Serial.println(" ESP32 Multi Sensor System");
  Serial.println("=================================");
  Serial.printf("Temperature (DHT22): %.2f °C\\n", dhtTemp);
  Serial.printf("Humidity (DHT22): %.2f %%\\n", dhtHum);
  Serial.printf("Motion: %s\\n", motion ? "DETECTED!" : "No Motion");
  Serial.printf("CO2: %d ppm\\n", co2);
  Serial.printf("Temperature (BME280): %.2f °C\\n", bmeTemp);
  Serial.printf("Humidity (BME280): %.2f %%\\n", bmeHum);
  Serial.printf("Pressure (BME280): %.2f hPa\\n", bmePress);
  Serial.printf("Ambient Light: %.2f lux\\n", lux);
  Serial.println("---------------------------------");

  delay(2000);
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sampleArduinoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#131b2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0b1326]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00a572]/20 border border-[#4edea3]/40 flex items-center justify-center text-[#4edea3]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-sans font-bold text-lg text-[#dae2fd] flex items-center gap-2">
                <span>ESP32 Multi-Sensor Serial Data Upload</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/30">
                  Live Terminal
                </span>
              </h2>
              <p className="font-sans text-xs text-[#c2c6d6]">
                Upload, parse, and synchronize raw ESP32 serial logs directly into EnergyCore telemetry dashboard.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#c2c6d6] hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-[#0b1326]/30 font-mono text-xs">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-[#131b2e] text-[#4edea3] font-bold border-t-2 border-[#4edea3]'
                : 'text-[#c2c6d6]/70 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Raw Log Parser</span>
          </button>

          <button
            onClick={() => setActiveTab('view_samples')}
            className={`px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'view_samples'
                ? 'bg-[#131b2e] text-[#4edea3] font-bold border-t-2 border-[#4edea3]'
                : 'text-[#c2c6d6]/70 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Parsed Datasets ({parsedPreview.length} frames)</span>
          </button>

          <button
            onClick={() => setActiveTab('esp32_code')}
            className={`px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'esp32_code'
                ? 'bg-[#131b2e] text-[#4edea3] font-bold border-t-2 border-[#4edea3]'
                : 'text-[#c2c6d6]/70 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>ESP32 Firmware Code</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {statusMessage && (
            <div className={`p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
              statusMessage.startsWith('Error')
                ? 'bg-[#93000a]/20 text-[#ffb4ab] border-[#ffb4ab]/30'
                : 'bg-[#00a572]/20 text-[#4edea3] border-[#4edea3]/30'
            }`}>
              {statusMessage.startsWith('Error') ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{statusMessage}</span>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <label className="font-mono text-xs text-[#adc6ff] flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-[#4edea3]" />
                  <span>Paste ESP32 Serial Output Log Below:</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLoadSampleLog}
                    className="font-mono text-[11px] px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#adc6ff] border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Load 10-Sample Dataset</span>
                  </button>

                  <button
                    onClick={handleCopyLog}
                    className="font-mono text-[11px] px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#adc6ff] border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#4edea3]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <textarea
                value={rawText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Paste Serial monitor text from ESP32 here..."
                rows={12}
                className="w-full bg-[#0b1326] text-[#4edea3] font-mono text-xs p-4 rounded-xl border border-white/10 focus:border-[#4edea3] focus:ring-1 focus:ring-[#4edea3] outline-none transition-all shadow-inner leading-relaxed resize-none"
              />

              {/* Realtime Parse Result Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0b1326]/50 p-4 rounded-xl border border-white/10 font-mono text-xs">
                <div>
                  <span className="text-[#c2c6d6]/60 text-[10px] block uppercase">Parsed Frames</span>
                  <span className="text-base font-bold text-[#4edea3]">{parsedPreview.length} Samples</span>
                </div>
                <div>
                  <span className="text-[#c2c6d6]/60 text-[10px] block uppercase">Temp Range</span>
                  <span className="text-base font-bold text-[#dae2fd]">
                    {parsedPreview.length > 0
                      ? `${Math.min(...parsedPreview.map((p) => p.dht22Temp))}°C - ${Math.max(
                          ...parsedPreview.map((p) => p.dht22Temp)
                        )}°C`
                      : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[#c2c6d6]/60 text-[10px] block uppercase">CO2 Range</span>
                  <span className="text-base font-bold text-[#ffb95f]">
                    {parsedPreview.length > 0
                      ? `${Math.min(...parsedPreview.map((p) => p.co2Ppm))} - ${Math.max(
                          ...parsedPreview.map((p) => p.co2Ppm)
                        )} ppm`
                      : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[#c2c6d6]/60 text-[10px] block uppercase">Motion Events</span>
                  <span className="text-base font-bold text-[#adc6ff]">
                    {parsedPreview.filter((p) => p.motion).length} Detected
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'view_samples' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between font-sans text-xs text-[#c2c6d6]">
                <span>Extracted Multi-Sensor Telemetry Records ({parsedPreview.length} frames)</span>
                <span className="font-mono text-[#4edea3]">Sensor Nodes: DHT22, BME280, MQ135, PIR, LDR</span>
              </div>

              <div className="overflow-x-auto border border-white/10 rounded-xl bg-[#0b1326]/40">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#131b2e] text-[#c2c6d6]/70 uppercase tracking-wider text-[11px]">
                      <th className="p-3">#</th>
                      <th className="p-3">DHT22 Temp / Hum</th>
                      <th className="p-3">BME280 Temp / Hum</th>
                      <th className="p-3">Pressure</th>
                      <th className="p-3">CO2</th>
                      <th className="p-3">Light</th>
                      <th className="p-3">Motion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[#dae2fd]">
                    {parsedPreview.map((sample, idx) => (
                      <tr key={sample.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 text-[#c2c6d6]/60">{sample.sampleIndex}</td>
                        <td className="p-3 text-[#4edea3]">
                          {sample.dht22Temp.toFixed(2)} °C / {sample.dht22Humidity.toFixed(2)}%
                        </td>
                        <td className="p-3 text-[#adc6ff]">
                          {sample.bme280Temp.toFixed(2)} °C / {sample.bme280Humidity.toFixed(2)}%
                        </td>
                        <td className="p-3 text-[#c2c6d6]">{sample.bme280Pressure.toFixed(2)} hPa</td>
                        <td className="p-3 text-[#ffb95f] font-bold">{sample.co2Ppm} ppm</td>
                        <td className="p-3 text-[#dae2fd]">{sample.ambientLightLux.toFixed(1)} lux</td>
                        <td className="p-3">
                          {sample.motion ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffb95f]/20 text-[#ffb95f] border border-[#ffb95f]/40 animate-pulse">
                              DETECTED!
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] text-[#c2c6d6]/50 bg-white/5">
                              No Motion
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'esp32_code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-sans text-xs text-[#c2c6d6]">
                  Upload telemetry directly to EnergyCore AI via ESP32 Wi-Fi / Serial monitor stream using this C++ Arduino code.
                </p>
                <button
                  onClick={handleCopyCode}
                  className="font-mono text-xs px-3 py-1.5 rounded-lg bg-[#adc6ff]/10 hover:bg-[#adc6ff]/20 text-[#adc6ff] border border-[#adc6ff]/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-[#4edea3]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Code Copied!' : 'Copy Sketch Code'}</span>
                </button>
              </div>

              <pre className="bg-[#0b1326] text-[#adc6ff] font-mono text-xs p-4 rounded-xl border border-white/10 overflow-x-auto max-h-80 leading-relaxed">
                <code>{sampleArduinoCode}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0b1326]/60">
          <div className="font-mono text-xs text-[#c2c6d6]/80">
            Status: <span className="text-[#4edea3]">{parsedPreview.length} Valid ESP32 Sensor Frames Ready</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none font-mono text-xs px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#c2c6d6] border border-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyUpload}
              disabled={parsedPreview.length === 0}
              className="flex-1 sm:flex-none font-mono text-xs px-5 py-2 rounded-xl bg-gradient-to-r from-[#00a572] to-[#004395] hover:opacity-90 text-white font-bold shadow-lg shadow-[#00a572]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Telemetry ({parsedPreview.length} Samples)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
