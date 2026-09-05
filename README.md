# ⚡ EnergyCore AI — ESP32 Multi-Sensor Telemetry & Smart Building Management System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-4edea3?style=for-the-badge&logo=github)](https://kshitiz-jayaswal.github.io/EnergyCore-AI/)
[![Stack](https://img.shields.io/badge/React%2019-Vite%20%7C%20TypeScript-004395?style=for-the-badge&logo=react)](https://react.dev/)
[![Hardware](https://img.shields.io/badge/ESP32-DHT22%20%7C%20BME280%20%7C%20MQ135-ca8100?style=for-the-badge&logo=espressif)](https://www.espressif.com/)

An advanced, industrial-grade **IoT Telemetry & Building Energy Management Dashboard** powered by **ESP32 Edge Sensing Nodes**, real-time **Serial Log Ingestion**, dual-sensor cross-validation, and predictive AI energy optimization.

---

## 🛠️ Software Stack & Technologies Used

### **Frontend & Web Development Frameworks**
1. **React 19 (`react`, `react-dom`)**: Modern UI library utilizing component-based architecture and state hooks for high-performance interactive interfaces.
2. **Vite (`vite`)**: Ultra-fast next-generation frontend build tool providing Instant Hot Module Replacement (HMR) and optimized ESBuild compilation.
3. **TypeScript (`typescript`)**: Strongly typed programming language ensuring zero runtime crashes, type safety across sensor data structures, and maintainable codebase.
4. **Tailwind CSS v4 (`@tailwindcss/vite`)**: Utility-first CSS engine delivering dark-mode glassmorphism aesthetics, responsive grids, and micro-animations.
5. **Lucide React (`lucide-react`)**: Lightweight vector icon library powering telemetry indicators, sensor cards, and system state badges.

### **Hardware Firmware & Microcontroller Software**
1. **C++ / Arduino Framework**: Code compiled for ESP32 microcontrollers to interface with digital & analog sensors over I2C/OneWire protocols.
2. **ESP-IDF RTOS**: Real-Time Operating System kernel handling sensor polling tasks, UART serial output, and Wi-Fi stack.
3. **Adafruit BME280 & DHT Sensor Libraries**: Low-level hardware abstraction layers for temperature, humidity, and barometric pressure calculations.

---

## 🛰️ Hardware Architecture & Sensor Fleet (`ESP32-MS-01`)

The system integrates a multi-sensor array deployed on an **ESP32 Edge Microcontroller Node**:

| Sensor Module | Measured Parameter | Unit | Application / Function |
| :--- | :--- | :--- | :--- |
| **DHT22 (AM2302)** | Ambient Temperature & Humidity | °C, % | Primary environmental comfort monitoring |
| **BME280** | Precision Temp, Humidity & Barometric Pressure | °C, %, hPa | Cross-validation delta check & weather forecasting |
| **MQ135 Gas Sensor** | Carbon Dioxide (CO2) & Air Quality | ppm | Indoor Air Quality (IAQ) & fresh air damper control |
| **PIR Sensor (HC-SR501)** | Human Motion Detection | Boolean | Zone occupancy detection & auto-lighting |
| **LDR Photocell** | Ambient Light Illuminance | Lux | Daylight harvesting & smart dimmer control |

---

## 🔥 Key System Features

- **Live Serial Telemetry Log Parser**: Ingests raw serial monitor outputs directly from ESP32 nodes, parsing multi-sensor data blocks using high-speed regular expressions.
- **Dual Sensor Cross-Validation**: Simultaneously monitors DHT22 vs BME280 readings to compute thermal variance ($\Delta T$) and detect sensor drift or calibration degradation.
- **Interactive Frame Scrubber**: Timeline scrubber allowing frame-by-frame inspection, playback simulation, and historical state playback.
- **Dynamic CO2 & Motion Alerts**: Triggers real-time HVAC ventilation alerts when CO2 exceeds safety thresholds (1250+ ppm) during occupied motion frames.
- **Emergency Load Shedding**: AI-assisted load shedding module for non-essential campus circuits during peak pricing windows.

---

## 🎓 Viva Voce Examination Questions & Answers (Project Defense Guide)

Here are the most important technical questions examiners and professors ask during Viva Voce examinations, along with model responses:

### **Q1: What is the main objective of this project?**
> **Answer:** The primary objective is to create an integrated IoT-driven Smart Building Energy & Environmental Management System. It combines ESP32 multi-sensor edge nodes with a real-time React web dashboard to monitor indoor air quality (CO2, Temp, Humidity, Light), detect physical occupancy, validate sensor accuracy, and execute automated energy optimization and load shedding.

---

### **Q2: Why did you use TWO temperature and humidity sensors (DHT22 and BME280) on the same ESP32 node?**
> **Answer:** Dual-sensor redundancy provides **cross-validation**. Single sensors can suffer from thermal drift, self-heating, or degradation. By comparing DHT22 and BME280 readings in real-time, the system calculates a cross-sensor delta ($\Delta T$ and $\Delta H$). If variance exceeds standard limits (e.g., $>1.5^\circ\text{C}$), the system flags a sensor maintenance alert while using weighted averaging for accurate HVAC control.

---

### **Q3: How does the website parse raw ESP32 serial logs in real-time?**
> **Answer:** The application includes a custom regular-expression-based stream parser (`esp32Parser.ts`). When raw text from the ESP32 serial monitor is pasted or received over serial/API, the parser splits the stream into sample blocks delimited by standard markers (`---`), extracts individual parameters (`Temperature (DHT22)`, `CO2`, `Motion`, etc.) using regex matching, converts them into typed `ESP32SensorReading` TypeScript objects, and updates React state dynamically.

---

### **Q4: What protocols are used for data communication between ESP32 and the dashboard?**
> **Answer:** 
> 1. **UART Serial Protocol (115200 Baud)**: Used for direct hardware debugging and text log ingestion.
> 2. **HTTP REST API (`POST /api/sensor-data`)**: ESP32 posts JSON telemetry payloads over Wi-Fi.
> 3. **I2C Protocol**: ESP32 communicates with the BME280 sensor (Address `0x76`).
> 4. **OneWire Protocol**: Used for DHT22 digital communication on GPIO 4.

---

### **Q5: Explain how the PIR motion sensor and CO2 sensor work together for energy efficiency.**
> **Answer:** This is called **Demand-Controlled Ventilation (DCV)**. If the PIR sensor detects no motion (space vacant), the HVAC system reduces fan speeds and cooling to conserve energy, even if baseline CO2 is moderate. However, when PIR detects motion AND CO2 rises above 1200 ppm, the system triggers fresh air dampers to maintain ASHRAE 62.1 indoor air standards without over-cooling empty rooms.

---

### **Q6: Why did you choose React 19 with Vite instead of traditional HTML/JS or Next.js?**
> **Answer:** 
> - **React 19**: Component-driven architecture allows sub-components (like sensor gauge cards and timeline scrubbers) to re-render independently without re-rendering the whole page.
> - **Vite**: Provides lightning-fast HMR and bundling using ESBuild.
> - **Client-side SPA**: Ensures zero latency during live telemetry updates, ideal for real-time dashboard visualization.

---

### **Q7: How is the web application deployed and hosted?**
> **Answer:** The project is compiled into static production assets (`HTML/CSS/JS`) via `vite build` with relative base path configuration (`base: './'`). The assets are deployed directly to **GitHub Pages** on the `gh-pages` branch, hosted at `https://kshitiz-jayaswal.github.io/EnergyCore-AI/`.

---

## 🚀 Running Locally

### Prerequisites:
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher

### Steps:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Kshitiz-jayaswal/EnergyCore-AI.git
   cd EnergyCore-AI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at **`http://localhost:3000/`**.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📜 License & Author

- **Project Lead**: Kshitiz Jayaswal
- **GitHub Repository**: [EnergyCore-AI](https://github.com/Kshitiz-jayaswal/EnergyCore-AI)
- **Live Site**: [https://kshitiz-jayaswal.github.io/EnergyCore-AI/](https://kshitiz-jayaswal.github.io/EnergyCore-AI/)
