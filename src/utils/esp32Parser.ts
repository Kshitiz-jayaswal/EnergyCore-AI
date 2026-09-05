import { ESP32SensorReading } from '../types';

export const RAW_USER_LOG = `=================================
 ESP32 Multi Sensor System
=================================
Sensors warming up...

Temperature (DHT22): 23.00 °C
Humidity (DHT22): 72.60 %
Motion: DETECTED!
CO2: 1277 ppm
Temperature (BME280): 23.15 °C
Humidity (BME280): 71.80 %
Pressure (BME280): 1006.42 hPa
Ambient Light: 92.30 lux
---------------------------------
Temperature (DHT22): 23.00 °C
Humidity (DHT22): 72.80 %
Motion: No Motion
CO2: 1275 ppm
Temperature (BME280): 23.14 °C
Humidity (BME280): 72.00 %
Pressure (BME280): 1006.40 hPa
Ambient Light: 91.70 lux
---------------------------------
Temperature (DHT22): 23.00 °C
Humidity (DHT22): 73.20 %
Motion: No Motion
CO2: 1272 ppm
Temperature (BME280): 23.16 °C
Humidity (BME280): 72.40 %
Pressure (BME280): 1006.38 hPa
Ambient Light: 90.90 lux
---------------------------------
Temperature (DHT22): 23.00 °C
Humidity (DHT22): 73.50 %
Motion: DETECTED!
CO2: 1270 ppm
Temperature (BME280): 23.18 °C
Humidity (BME280): 72.70 %
Pressure (BME280): 1006.35 hPa
Ambient Light: 95.60 lux
---------------------------------
Temperature (DHT22): 23.00 °C
Humidity (DHT22): 73.70 %
Motion: No Motion
CO2: 1269 ppm
Temperature (BME280): 23.17 °C
Humidity (BME280): 72.90 %
Pressure (BME280): 1006.33 hPa
Ambient Light: 89.40 lux
---------------------------------
Temperature (DHT22): 23.00 °C
Humidity (DHT22): 73.90 %
Motion: No Motion
CO2: 1269 ppm
Temperature (BME280): 23.19 °C
Humidity (BME280): 73.10 %
Pressure (BME280): 1006.30 hPa
Ambient Light: 88.80 lux
---------------------------------
Temperature (DHT22): 23.00 °C
Humidity (DHT22): 74.10 %
Motion: DETECTED!
CO2: 1270 ppm
Temperature (BME280): 23.20 °C
Humidity (BME280): 73.30 %
Pressure (BME280): 1006.28 hPa
Ambient Light: 93.50 lux
---------------------------------
Temperature (DHT22): 23.30 °C
Humidity (DHT22): 78.20 %
Motion: No Motion
CO2: 1265 ppm
Temperature (BME280): 23.44 °C
Humidity (BME280): 77.40 %
Pressure (BME280): 1006.20 hPa
Ambient Light: 86.20 lux
---------------------------------
Temperature (DHT22): 23.30 °C
Humidity (DHT22): 78.30 %
Motion: No Motion
CO2: 1267 ppm
Temperature (BME280): 23.45 °C
Humidity (BME280): 77.50 %
Pressure (BME280): 1006.18 hPa
Ambient Light: 85.60 lux
---------------------------------
Temperature (DHT22): 23.30 °C
Humidity (DHT22): 78.40 %
Motion: No Motion
CO2: 1267 ppm
Temperature (BME280): 23.46 °C
Humidity (BME280): 77.60 %
Pressure (BME280): 1006.15 hPa
Ambient Light: 85.10 lux
---------------------------------`;

/**
 * Parses raw serial log text from ESP32 multi-sensor node into structured readings.
 */
export function parseESP32SerialLogs(rawText: string): ESP32SensorReading[] {
  if (!rawText || typeof rawText !== 'string') return [];

  // Split by delimiter lines or header banners
  const blocks = rawText
    .split(/---------------------------------|=+/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0 && !b.toLowerCase().includes('esp32 multi sensor system'));

  const readings: ESP32SensorReading[] = [];

  blocks.forEach((block, index) => {
    // Check if block has temperature or humidity readings
    const dht22TempMatch = block.match(/Temperature\s*\(DHT22\):\s*([\d.]+)/i);
    const dht22HumMatch = block.match(/Humidity\s*\(DHT22\):\s*([\d.]+)/i);
    const motionMatch = block.match(/Motion:\s*(DETECTED!?|No Motion|TRUE|FALSE|1|0)/i);
    const co2Match = block.match(/CO2:\s*([\d.]+)/i);
    const bme280TempMatch = block.match(/Temperature\s*\(BME280\):\s*([\d.]+)/i);
    const bme280HumMatch = block.match(/Humidity\s*\(BME280\):\s*([\d.]+)/i);
    const bme280PressMatch = block.match(/Pressure\s*\(BME280\):\s*([\d.]+)/i);
    const luxMatch = block.match(/Ambient Light:\s*([\d.]+)/i);

    // If block doesn't contain at least a temperature or CO2 reading, ignore header line blocks (e.g. "Sensors warming up...")
    if (dht22TempMatch || bme280TempMatch || co2Match) {
      const now = new Date();
      // Generate realistic sequential timestamps spaced by 2 seconds
      const sampleTime = new Date(now.getTime() - (blocks.length - 1 - readings.length) * 2000);
      const timestamp = sampleTime.toTimeString().split(' ')[0];

      const dht22Temp = dht22TempMatch ? parseFloat(dht22TempMatch[1]) : 23.0;
      const dht22Humidity = dht22HumMatch ? parseFloat(dht22HumMatch[1]) : 72.0;
      const motionVal = motionMatch ? motionMatch[1].toUpperCase() : 'NO MOTION';
      const motion = motionVal.includes('DETECTED') || motionVal === 'TRUE' || motionVal === '1';
      const co2Ppm = co2Match ? parseInt(co2Match[1], 10) : 1250;
      const bme280Temp = bme280TempMatch ? parseFloat(bme280TempMatch[1]) : dht22Temp + 0.15;
      const bme280Humidity = bme280HumMatch ? parseFloat(bme280HumMatch[1]) : dht22Humidity - 0.8;
      const bme280Pressure = bme280PressMatch ? parseFloat(bme280PressMatch[1]) : 1006.2;
      const ambientLightLux = luxMatch ? parseFloat(luxMatch[1]) : 90.0;

      readings.push({
        id: `esp32-frame-${readings.length + 1}`,
        sampleIndex: readings.length + 1,
        timestamp,
        dht22Temp,
        dht22Humidity,
        motion,
        co2Ppm,
        bme280Temp,
        bme280Humidity,
        bme280Pressure,
        ambientLightLux,
        rawBlock: block,
      });
    }
  });

  return readings;
}

export const initialESP32Readings: ESP32SensorReading[] = parseESP32SerialLogs(RAW_USER_LOG);
