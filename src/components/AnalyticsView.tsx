import React, { useState } from 'react';
import { 
  Zap, 
  Gauge, 
  Leaf, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  Download, 
  MoreHorizontal,
  FileSpreadsheet
} from 'lucide-react';
import { TimeRange, HourlyTrendRow } from '../types';
import { hourlyTrendsData } from '../data/mockData';

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [dataRows, setDataRows] = useState<HourlyTrendRow[]>(hourlyTrendsData);
  const [exportNotice, setExportNotice] = useState<boolean>(false);

  // Dynamic values depending on timeframe
  const kpis = {
    daily: { peak: '412', peakDiff: '+5.2%', avg: '184', avgDiff: '-2.1%', savings: '24.8' },
    weekly: { peak: '489', peakDiff: '+1.8%', avg: '176', avgDiff: '-4.6%', savings: '168.4' },
    monthly: { peak: '520', peakDiff: '-0.9%', avg: '172', avgDiff: '-7.2%', savings: '684.0' },
  }[timeRange];

  // CSV Export functionality
  const handleExportCSV = () => {
    const headers = 'Time Block,Consumption (kWh),HVAC Load (%),Occupancy,Status\n';
    const rows = dataRows
      .map(
        (r) =>
          `"${r.timeBlock}",${r.consumptionKwh},${r.hvacLoadPercent}%,${r.occupancy},"${r.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `energycore_trends_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Page Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-2xl md:text-3xl text-[#dae2fd] tracking-tight">
            Analytics Overview
          </h1>
          <p className="font-sans text-sm text-[#c2c6d6] mt-0.5">
            Real-time facility consumption and load distribution.
          </p>
        </div>

        {/* Timeframe Tabs */}
        <div className="flex bg-[#222a3d] rounded-lg p-1 border border-white/5 w-max">
          {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeRange(tab)}
              className={`font-mono text-xs px-4 py-1.5 rounded capitalize transition-all ${
                timeRange === tab
                  ? 'bg-[#31394d] text-[#dae2fd] font-semibold shadow-sm'
                  : 'text-[#c2c6d6]/70 hover:text-[#dae2fd] hover:bg-[#31394d]/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* KPI 1: Peak Demand */}
        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-4 z-10">
            <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">
              PEAK DEMAND
            </span>
            <span className="p-1.5 rounded-lg bg-[#93000a]/20 text-[#ffb4ab]">
              <Zap className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-2 z-10">
            <span className="font-sans font-bold text-4xl md:text-5xl text-[#dae2fd] tracking-tight">
              {kpis.peak}
            </span>
            <span className="font-mono text-sm text-[#c2c6d6]">kW</span>
          </div>

          <div className="mt-4 flex items-center gap-1.5 font-mono text-xs text-[#ffb4ab] z-10">
            <TrendingUp className="w-4 h-4" />
            <span>{kpis.peakDiff} vs baseline</span>
          </div>

          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#ffb4ab]/10 rounded-full blur-2xl group-hover:bg-[#ffb4ab]/20 transition-colors pointer-events-none" />
        </div>

        {/* KPI 2: Avg Consumption */}
        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-4 z-10">
            <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">
              AVG CONSUMPTION
            </span>
            <span className="p-1.5 rounded-lg bg-[#004395]/20 text-[#adc6ff]">
              <Gauge className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-2 z-10">
            <span className="font-sans font-bold text-4xl md:text-5xl text-[#dae2fd] tracking-tight">
              {kpis.avg}
            </span>
            <span className="font-mono text-sm text-[#c2c6d6]">kWh/h</span>
          </div>

          <div className="mt-4 flex items-center gap-1.5 font-mono text-xs text-[#4edea3] z-10">
            <TrendingDown className="w-4 h-4" />
            <span>{kpis.avgDiff} vs baseline</span>
          </div>

          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#adc6ff]/10 rounded-full blur-2xl group-hover:bg-[#adc6ff]/20 transition-colors pointer-events-none" />
        </div>

        {/* KPI 3: Est. Savings */}
        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-4 z-10">
            <span className="font-mono text-xs text-[#c2c6d6] uppercase tracking-wider">
              EST. SAVINGS
            </span>
            <span className="p-1.5 rounded-lg bg-[#00a572]/20 text-[#4edea3]">
              <Leaf className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-2 z-10">
            <span className="font-sans font-bold text-4xl md:text-5xl text-[#dae2fd] tracking-tight">
              {kpis.savings}
            </span>
            <span className="font-mono text-sm text-[#c2c6d6]">kWh</span>
          </div>

          <div className="mt-4 flex items-center gap-1.5 font-mono text-xs text-[#4edea3] z-10 font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>AI Optimization Active</span>
          </div>

          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#4edea3]/10 rounded-full blur-2xl group-hover:bg-[#4edea3]/20 transition-colors pointer-events-none" />
        </div>
      </div>

      {/* Main Charts Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Daily Energy Consumption (2 cols on lg) */}
        <div className="glass-panel rounded-xl p-5 md:p-6 lg:col-span-2 flex flex-col min-h-[360px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-sans font-semibold text-lg text-[#dae2fd]">
                Daily Energy Consumption
              </h2>
              <p className="font-mono text-xs text-[#c2c6d6]/60">24-hour load ramp curve & peak distribution</p>
            </div>
            <button className="text-[#c2c6d6]/60 hover:text-[#adc6ff] p-1 rounded">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 relative w-full border-b border-l border-white/10 mt-auto min-h-[200px] flex items-end">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-15">
              <div className="border-t border-white/40 w-full" />
              <div className="border-t border-white/40 w-full" />
              <div className="border-t border-white/40 w-full" />
              <div className="border-t border-white/40 w-full" />
            </div>

            {/* Simulated Bar Chart */}
            <div className="absolute inset-0 flex items-end justify-between px-3 pb-1 gap-2">
              <div className="flex-1 h-[20%] bg-[#adc6ff]/20 hover:bg-[#adc6ff]/40 transition-colors rounded-t" />
              <div className="flex-1 h-[35%] bg-[#adc6ff]/30 hover:bg-[#adc6ff]/50 transition-colors rounded-t" />
              <div className="flex-1 h-[40%] bg-[#adc6ff]/40 hover:bg-[#adc6ff]/60 transition-colors rounded-t" />
              <div className="flex-1 h-[75%] bg-[#adc6ff]/60 hover:bg-[#adc6ff]/80 transition-colors rounded-t" />
              <div className="flex-1 h-[92%] bg-[#adc6ff]/85 hover:bg-[#adc6ff] transition-colors rounded-t relative group">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#31394d] text-[#dae2fd] font-mono text-[10px] px-2 py-0.5 rounded border border-white/10 shadow">
                  Peak: 412 kW
                </div>
              </div>
              <div className="flex-1 h-[60%] bg-[#adc6ff]/50 hover:bg-[#adc6ff]/70 transition-colors rounded-t" />
              <div className="flex-1 h-[45%] bg-[#adc6ff]/40 hover:bg-[#adc6ff]/60 transition-colors rounded-t" />
              <div className="flex-1 h-[30%] bg-[#adc6ff]/30 hover:bg-[#adc6ff]/50 transition-colors rounded-t" />
            </div>
          </div>

          <div className="flex justify-between mt-3 font-mono text-[11px] text-[#c2c6d6]/60 px-2">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:59</span>
          </div>
        </div>

        {/* Load Distribution Donut (1 col) */}
        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col min-h-[360px] justify-between">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-sans font-semibold text-lg text-[#dae2fd]">
              Load Distribution
            </h2>
            <button className="text-[#c2c6d6]/60 hover:text-[#adc6ff] p-1 rounded">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Donut Chart Visual */}
          <div className="flex-1 flex flex-col items-center justify-center relative my-2">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#2d3449" strokeWidth="12" />
                
                {/* HVAC 55% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#adc6ff"
                  strokeWidth="12"
                  strokeDasharray="238.76"
                  strokeDashoffset="107.44"
                  strokeLinecap="round"
                />

                {/* Lighting 30% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#4edea3"
                  strokeWidth="12"
                  strokeDasharray="238.76"
                  strokeDashoffset="167.13"
                  strokeLinecap="round"
                  transform="rotate(198 50 50)"
                />

                {/* Plugs/Misc 15% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#ffb95f"
                  strokeWidth="12"
                  strokeDasharray="238.76"
                  strokeDashoffset="202.94"
                  strokeLinecap="round"
                  transform="rotate(306 50 50)"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="font-sans font-extrabold text-3xl text-[#dae2fd] leading-none">
                  100<span className="text-lg font-normal">%</span>
                </div>
                <div className="font-mono text-[11px] text-[#c2c6d6]/70 mt-1 uppercase tracking-wider">
                  Total Load
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Legend */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#adc6ff]" />
                <span className="text-[#dae2fd]">HVAC</span>
              </div>
              <span className="text-[#c2c6d6] font-semibold">55%</span>
            </div>

            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3]" />
                <span className="text-[#dae2fd]">Lighting</span>
              </div>
              <span className="text-[#c2c6d6] font-semibold">30%</span>
            </div>

            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffb95f]" />
                <span className="text-[#dae2fd]">Plugs/Misc</span>
              </div>
              <span className="text-[#c2c6d6] font-semibold">15%</span>
            </div>
          </div>
        </div>

        {/* Occupancy vs Energy Correlation (Spans 3 cols) */}
        <div className="glass-panel rounded-xl p-5 md:p-6 lg:col-span-3 flex flex-col min-h-[300px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="font-sans font-semibold text-lg text-[#dae2fd]">
                Occupancy vs Energy Correlation
              </h2>
              <p className="font-mono text-xs text-[#c2c6d6]/60">Dual-axis synchrony of headcount spikes and chiller ramp</p>
            </div>

            <div className="flex items-center gap-4 font-mono text-xs text-[#c2c6d6]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#adc6ff]/40" />
                <span>Energy (kWh)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-[2px] bg-[#4edea3]" />
                <span>Occupancy (Headcount)</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full border-b border-white/10 mt-auto flex items-end justify-between px-4 pb-2 min-h-[160px]">
            {/* Bars for Energy */}
            <div className="w-[10%] h-[30%] bg-[#adc6ff]/30 rounded-t-sm" />
            <div className="w-[10%] h-[50%] bg-[#adc6ff]/40 rounded-t-sm" />
            <div className="w-[10%] h-[80%] bg-[#adc6ff]/60 rounded-t-sm" />
            <div className="w-[10%] h-[95%] bg-[#adc6ff]/80 rounded-t-sm" />
            <div className="w-[10%] h-[70%] bg-[#adc6ff]/50 rounded-t-sm" />
            <div className="w-[10%] h-[40%] bg-[#adc6ff]/30 rounded-t-sm" />

            {/* Line for Occupancy (SVG overlay) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path
                d="M 5,80 L 22,60 L 40,20 L 58,10 L 76,40 L 95,70"
                fill="none"
                stroke="#4edea3"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx="5" cy="80" r="3.5" fill="#4edea3" />
              <circle cx="22" cy="60" r="3.5" fill="#4edea3" />
              <circle cx="40" cy="20" r="3.5" fill="#4edea3" />
              <circle cx="58" cy="10" r="3.5" fill="#4edea3" />
              <circle cx="76" cy="40" r="3.5" fill="#4edea3" />
              <circle cx="95" cy="70" r="3.5" fill="#4edea3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className="glass-panel rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10">
        <div className="p-4 md:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#131b2e]/60">
          <div>
            <h2 className="font-sans font-semibold text-lg text-[#dae2fd]">
              Hourly Trends Table
            </h2>
            <p className="font-mono text-xs text-[#c2c6d6]/60">Granular facility sensor readings</p>
          </div>

          <div className="flex items-center gap-3">
            {exportNotice && (
              <span className="font-mono text-xs text-[#4edea3] animate-pulse">
                CSV Exported Successfully!
              </span>
            )}
            <button
              id="export-csv-btn"
              onClick={handleExportCSV}
              className="font-mono text-xs text-[#adc6ff] hover:text-white bg-[#adc6ff]/10 hover:bg-[#adc6ff]/20 px-3.5 py-2 rounded-lg border border-[#adc6ff]/30 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#0b1326]/50">
                <th className="py-3.5 px-4 md:px-6 font-mono text-xs text-[#c2c6d6]/60 uppercase tracking-wider">
                  Time Block
                </th>
                <th className="py-3.5 px-4 md:px-6 font-mono text-xs text-[#c2c6d6]/60 uppercase tracking-wider text-right">
                  Consumption (kWh)
                </th>
                <th className="py-3.5 px-4 md:px-6 font-mono text-xs text-[#c2c6d6]/60 uppercase tracking-wider text-right">
                  HVAC Load (%)
                </th>
                <th className="py-3.5 px-4 md:px-6 font-mono text-xs text-[#c2c6d6]/60 uppercase tracking-wider text-right">
                  Occupancy
                </th>
                <th className="py-3.5 px-4 md:px-6 font-mono text-xs text-[#c2c6d6]/60 uppercase tracking-wider text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm text-[#dae2fd] divide-y divide-white/5">
              {dataRows.map((row, idx) => {
                const isHighLoad = row.status === 'High Load';

                return (
                  <tr
                    key={idx}
                    className={`hover:bg-[#2d3449]/40 transition-colors ${
                      isHighLoad ? 'bg-[#93000a]/10' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 md:px-6 font-mono text-xs">
                      {row.timeBlock}
                    </td>
                    <td
                      className={`py-3.5 px-4 md:px-6 text-right font-mono text-xs font-medium ${
                        isHighLoad ? 'text-[#ffb4ab] font-bold' : 'text-[#dae2fd]'
                      }`}
                    >
                      {row.consumptionKwh.toFixed(1)}
                    </td>
                    <td
                      className={`py-3.5 px-4 md:px-6 text-right font-mono text-xs ${
                        isHighLoad ? 'text-[#ffb4ab] font-bold' : 'text-[#c2c6d6]'
                      }`}
                    >
                      {row.hvacLoadPercent}%
                    </td>
                    <td className="py-3.5 px-4 md:px-6 text-right font-mono text-xs text-[#dae2fd]">
                      {row.occupancy.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 md:px-6 text-center">
                      <span
                        className={`inline-flex items-center justify-center px-2.5 py-1 rounded font-mono text-[11px] font-semibold border ${
                          isHighLoad
                            ? 'bg-[#93000a]/20 text-[#ffb4ab] border-[#ffb4ab]/30'
                            : 'bg-[#00a572]/15 text-[#4edea3] border-[#4edea3]/30'
                        }`}
                      >
                        {row.status}
                      </span>
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
