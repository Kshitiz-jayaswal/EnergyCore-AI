import React, { useState, useEffect } from 'react';
import { NavTab, AlertItem, ESP32SensorReading } from './types';
import { initialAlerts } from './data/mockData';
import { initialESP32Readings } from './utils/esp32Parser';
import { TopAppBar } from './components/TopAppBar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { BottomNavBar } from './components/BottomNavBar';
import { DashboardView } from './components/DashboardView';
import { OccupancyView } from './components/OccupancyView';
import { AnalyticsView } from './components/AnalyticsView';
import { AIInsightsView } from './components/AIInsightsView';
import { AlertsView } from './components/AlertsView';
import { DigitalTwinView } from './components/DigitalTwinView';
import { LoadControlView } from './components/LoadControlView';
import { LiveMonitoringView } from './components/LiveMonitoringView';
import { DevicesView } from './components/DevicesView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { ESP32UploadModal } from './components/ESP32UploadModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLiveStream, setIsLiveStream] = useState<boolean>(true);
  const [isAutoMode, setIsAutoMode] = useState<boolean>(true);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ESP32 Telemetry State
  const [esp32Readings, setEsp32Readings] = useState<ESP32SensorReading[]>(initialESP32Readings);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const alertCount = alerts.filter((a) => a.severity === 'CRITICAL' || a.severity === 'WARNING').length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUploadESP32Data = (newReadings: ESP32SensorReading[]) => {
    setEsp32Readings(newReadings);
    showToast(`Successfully uploaded ${newReadings.length} ESP32 sensor frames into website!`);
    
    // Check if high CO2 detected in uploaded batch and add warning alert
    const maxCo2 = Math.max(...newReadings.map(r => r.co2Ppm));
    if (maxCo2 > 1250) {
      setAlerts(prev => [
        {
          id: `alt-esp32-${Date.now()}`,
          title: `ESP32 Node High CO2 (${maxCo2} ppm)`,
          description: `Uploaded telemetry indicates CO2 peak at ${maxCo2} ppm. Automated air recirculation requested.`,
          severity: 'WARNING',
          category: 'Env',
          timestamp: new Date().toTimeString().substring(0, 5),
          timeAgo: 'Just now',
          deviceId: 'ESP32-MS-01'
        },
        ...prev
      ]);
    }
  };

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Alert resolved and incident recorded in facility log.');
  };

  const handleDismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleClearAllAlerts = () => {
    setAlerts([]);
    showToast('All active alerts cleared.');
  };

  const handleEmergencyShed = () => {
    setIsAutoMode(false);
    showToast('EMERGENCY LOAD SHED ACTIVATED: Non-essential circuits isolated.');
    setActiveTab('load_control');
  };

  return (
    <div className="flex h-screen w-full bg-[#0b1326] text-[#dae2fd] overflow-hidden font-sans selection:bg-[#4edea3]/30 selection:text-[#4edea3]">
      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:flex flex-shrink-0">
        <NavigationDrawer
          activeTab={activeTab}
          onTabChange={setActiveTab}
          alertCount={alertCount}
        />
      </div>

      {/* Mobile Drawer Backdrop & Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#131b2e] shadow-2xl z-10 animate-slideRight">
            <NavigationDrawer
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              alertCount={alertCount}
              onCloseMobile={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header */}
        <TopAppBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isLiveStream={isLiveStream}
          onToggleLiveStream={() => {
            const nextState = !isLiveStream;
            setIsLiveStream(nextState);
            showToast(nextState ? 'Live telemetry streaming connected.' : 'Telemetry paused.');
          }}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          alertCount={alertCount}
          alerts={alerts}
          onResolveAlert={handleResolveAlert}
          onClearAllAlerts={handleClearAllAlerts}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          uploadedCount={esp32Readings.length}
        />

        {/* Dynamic Global Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 right-4 z-50 bg-[#171f33] text-[#4edea3] font-mono text-xs px-4 py-3 rounded-xl border border-[#4edea3]/40 shadow-2xl flex items-center gap-2 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                onNavigate={setActiveTab}
                alerts={alerts}
                onEmergencyShed={handleEmergencyShed}
              />
            )}

            {activeTab === 'occupancy' && <OccupancyView />}

            {activeTab === 'analytics' && <AnalyticsView />}

            {(activeTab === 'insights' || (activeTab as string) === 'ai_insights') && (
              <AIInsightsView
                onShedLoadTrigger={() => {
                  showToast('AI automated load shedding armed for 2:00 PM.');
                }}
              />
            )}

            {activeTab === 'alerts' && (
              <AlertsView
                alerts={alerts}
                onResolveAlert={handleResolveAlert}
                onDismissAlert={handleDismissAlert}
              />
            )}

            {activeTab === 'digital_twin' && <DigitalTwinView />}

            {activeTab === 'load_control' && (
              <LoadControlView
                isAutoMode={isAutoMode}
                onToggleAutoMode={(mode) => {
                  setIsAutoMode(mode);
                  showToast(
                    mode
                      ? 'Control Mode switched to AUTO: AI optimization active.'
                      : 'Control Mode switched to MANUAL: AI scheduling bypassed.'
                  );
                }}
              />
            )}

            {activeTab === 'live_monitoring' && (
              <LiveMonitoringView
                esp32Readings={esp32Readings}
                onOpenUploadModal={() => setIsUploadModalOpen(true)}
              />
            )}

            {activeTab === 'devices' && (
              <DevicesView
                onOpenUploadModal={() => setIsUploadModalOpen(true)}
              />
            )}

            {activeTab === 'reports' && <ReportsView />}

            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <div className="md:hidden">
          <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Global ESP32 Serial Log Upload Modal */}
      <ESP32UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadData={handleUploadESP32Data}
        currentReadings={esp32Readings}
      />
    </div>
  );
}

