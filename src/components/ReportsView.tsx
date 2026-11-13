import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Leaf, 
  Calendar, 
  TrendingDown, 
  DollarSign, 
  CheckCircle,
  Share2
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownloadReport = (name: string) => {
    setDownloading(name);
    setTimeout(() => {
      // Trigger file download
      const content = `EnergyCore AI Facility Audit Report\nGenerated: ${new Date().toISOString()}\nTarget: Global Campus & Substation Load\nTotal Savings: 2,480 kWh ($347.20 USD)\nCarbon Offset: 1.84 Metric Tons CO2e\nStatus: Verified\n`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(null);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      <div>
        <h1 className="font-sans font-bold text-2xl md:text-3xl text-[#1c2a22] tracking-tight">
          Executive Energy & ESG Reports
        </h1>
        <p className="font-sans text-sm text-[#56655b] mt-0.5">
          Automated compliance audits, peak billing analysis, and carbon reduction certification.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between border border-[#1c2a22]/10 shadow-xl">
          <span className="font-mono text-xs text-[#56655b] uppercase tracking-wider">MONTHLY COST SAVINGS</span>
          <div className="font-sans font-bold text-4xl text-[#3d7a4e] my-2 text-glow-secondary">
            $3,480.00
          </div>
          <div className="font-mono text-xs text-[#3d7a4e] flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-14.2% Peak Tariff Reduction</span>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between border border-[#1c2a22]/10 shadow-xl">
          <span className="font-mono text-xs text-[#56655b] uppercase tracking-wider">CARBON OFFSET (MT CO2e)</span>
          <div className="font-sans font-bold text-4xl text-[#1f4632] my-2 text-glow-primary">
            18.42 MT
          </div>
          <div className="font-mono text-xs text-[#1f4632] flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5" />
            <span>Equivalent to 420 Trees Planted</span>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 md:p-6 flex flex-col justify-between border border-[#1c2a22]/10 shadow-xl">
          <span className="font-mono text-xs text-[#56655b] uppercase tracking-wider">ASHRAE EFFICIENCY INDEX</span>
          <div className="font-sans font-bold text-4xl text-[#1c2a22] my-2">
            94.8 / 100
          </div>
          <div className="font-mono text-xs text-[#3d7a4e] flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>ENERGY STAR Tier 1 Certified</span>
          </div>
        </div>
      </div>

      {/* Available Downloads List */}
      <div className="glass-panel rounded-xl p-6 border border-[#1c2a22]/10 shadow-xl">
        <h3 className="font-sans font-bold text-lg text-[#1c2a22] mb-4">
          Generated Compliance Audits
        </h3>

        <div className="space-y-3">
          {[
            { title: 'Monthly Facility Energy Audit (October 2026)', date: 'Generated Oct 31, 2026', size: '2.4 MB PDF' },
            { title: 'Peak Demand & Tariff Analysis Report', date: 'Generated Oct 28, 2026', size: '1.8 MB PDF' },
            { title: 'HVAC Chiller Psychrometric Efficiency Log', date: 'Generated Oct 24, 2026', size: '3.1 MB CSV' },
            { title: 'YOLO Computer Vision Occupancy Headcount Log', date: 'Generated Oct 20, 2026', size: '840 KB CSV' },
          ].map((rep, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#fdfbf6]/60 hover:bg-[#eee9dc] border border-[#1c2a22]/[0.07] transition-colors gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#1f4632]/20 text-[#1f4632]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans font-semibold text-sm text-[#1c2a22]">{rep.title}</h4>
                  <p className="font-mono text-xs text-[#56655b]">{rep.date} • {rep.size}</p>
                </div>
              </div>

              <button
                onClick={() => handleDownloadReport(rep.title)}
                disabled={downloading === rep.title}
                className="font-mono text-xs px-4 py-2 bg-[#1f4632]/10 hover:bg-[#1f4632]/20 text-[#1f4632] rounded-lg border border-[#1f4632]/30 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{downloading === rep.title ? 'Preparing File...' : 'Download'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
