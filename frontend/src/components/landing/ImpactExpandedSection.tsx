import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Recycle, ArrowRight, TreePine, Droplets, Wind, Sparkles } from 'lucide-react';
import RepairabilityRing from '../RepairabilityRing';
import { LeafDecor, FernFrond, Fireflies, Bokeh } from '../decor';

export const ImpactExpandedSection: React.FC = () => {
  return (
    <section id="environmental-impact" className="relative bg-gradient-to-b from-[#0a2a1d] via-[#0f3b28] to-[#071f15] text-white py-[var(--sec-y)] border-b border-white/10 overflow-hidden">
      {/* Background Ambience & Foliage everywhere */}
      <Fireflies count={24} />
      <FernFrond className="absolute -top-10 -left-10 w-64 h-96 opacity-20 text-[#2f8f5b]" />
      <FernFrond className="absolute -bottom-10 -right-10 w-72 h-[420px] opacity-20 text-[#2f8f5b] transform -scale-x-100" />
      <LeafDecor variant="broad" className="absolute top-1/3 right-8 opacity-15" color="#dcebd9" size={160} />
      <Bokeh className="top-1/4 left-1/2 w-96 h-96" color="#2f8f5b" />

      <div className="renewix-container relative z-10 space-y-14">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#dcebd9] text-chip-label font-bold uppercase tracking-wider backdrop-blur-md">
            <Leaf className="w-3.5 h-3.5 text-[#2f8f5b]" />
            <span>Planetary Stewardship & Metrics</span>
          </div>

          <h2 className="text-section-h2 text-white font-extrabold tracking-tight">
            Every repair keeps a device out of the landfill.
          </h2>

          <p className="text-hero-lead text-[#dcebd9]/85 mx-auto">
            Manufacturing electronic replacements accounts for over 80% of consumer tech carbon footprint. Choosing repair preserves finite rare-earth elements and diverts toxic heavy metals from soil beds.
          </p>
        </div>

        {/* Row of 3 Large Ring Counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Ring 1: E-Waste Avoided */}
          <div className="p-7 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-md flex flex-col items-center text-center space-y-4 hover:border-white/30 transition-all shadow-editorial">
            <div className="w-12 h-12 rounded-2xl bg-[#2f8f5b]/20 flex items-center justify-center text-[#dcebd9]">
              <Recycle className="w-6 h-6 text-[#2f8f5b]" />
            </div>
            <RepairabilityRing score={92} size={130} strokeWidth={10} textColor="text-white" labelColor="text-[#dcebd9]" arcColor="#10B981" trackColor="rgba(255,255,255,0.15)" label="Landfill Diversion" />
            <div className="space-y-1">
              <h4 className="text-card-title font-extrabold text-white">210g E-Waste Diverted</h4>
              <p className="text-chip-label text-[#dcebd9]/75">
                Per repaired smartphone. Prevents lead, mercury, and cadmium landfill contamination.
              </p>
            </div>
          </div>

          {/* Ring 2: CO2e Emissions Avoided */}
          <div className="p-7 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-md flex flex-col items-center text-center space-y-4 hover:border-white/30 transition-all shadow-editorial">
            <div className="w-12 h-12 rounded-2xl bg-[#f8b08c]/20 flex items-center justify-center text-[#f8b08c]">
              <Wind className="w-6 h-6 text-[#f8b08c]" />
            </div>
            <RepairabilityRing score={85} size={130} strokeWidth={10} textColor="text-white" labelColor="text-[#dcebd9]" arcColor="#f8b08c" trackColor="rgba(255,255,255,0.15)" label="Emissions Offset" />
            <div className="space-y-1">
              <h4 className="text-card-title font-extrabold text-white">58 kg CO₂e Offset</h4>
              <p className="text-chip-label text-[#dcebd9]/75">
                Equivalent to driving 240 km. Bypasses intense silicon wafer fabrication and transport.
              </p>
            </div>
          </div>

          {/* Ring 3: Clean Water Conserved */}
          <div className="p-7 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-md flex flex-col items-center text-center space-y-4 hover:border-white/30 transition-all shadow-editorial">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-300">
              <Droplets className="w-6 h-6 text-cyan-300" />
            </div>
            <RepairabilityRing score={78} size={130} strokeWidth={10} textColor="text-white" labelColor="text-[#dcebd9]" arcColor="#38bdf8" trackColor="rgba(255,255,255,0.15)" label="Resource Preservation" />
            <div className="space-y-1">
              <h4 className="text-card-title font-extrabold text-white">1,350 Liters Water Saved</h4>
              <p className="text-chip-label text-[#dcebd9]/75">
                Ultra-pure water conserved from semiconductor chip extraction and chemical etching cycles.
              </p>
            </div>
          </div>

        </div>

        {/* Dual Impact Graphic: Growing Sprout & Live Monthly Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/5 rounded-3xl p-6 sm:p-10 border border-white/15 backdrop-blur-lg">
          
          {/* Left: Growing Sprout Mascot with Nature Message */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-[#2f8f5b]/20 flex items-center justify-center border border-[#2f8f5b]/40 shadow-inner">
              <TreePine className="w-10 h-10 text-emerald-400 animate-sprout" />
            </div>
            <h3 className="text-card-title font-extrabold text-white">Your Personal Repair Footprint</h3>
            <p className="text-body-card text-[#dcebd9]/80 max-w-sm">
              Every completed repair logs immutable environmental audit telemetry into your Renewix User Dashboard, translating fixes into trees planted and carbon avoided.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#f8b08c]">
              <Sparkles className="w-4 h-4" />
              <span>Certified ESG compliance standard</span>
            </div>
          </div>

          {/* Right: Live Monthly E-Waste Diverted Bar Chart */}
          <div className="lg:col-span-7 bg-black/40 rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#dcebd9] uppercase tracking-wider">
                Platform Aggregate E-Waste Diverted (2026 Run-rate)
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/15 px-2 py-0.5 rounded">
                +34% MoM
              </span>
            </div>

            {/* Bars */}
            <div className="h-32 flex items-end justify-between gap-2 pt-4 pb-2 border-b border-white/10">
              {[
                { month: 'Jan', val: 35, label: '350kg' },
                { month: 'Feb', val: 42, label: '420kg' },
                { month: 'Mar', val: 56, label: '560kg' },
                { month: 'Apr', val: 68, label: '680kg' },
                { month: 'May', val: 74, label: '740kg' },
                { month: 'Jun', val: 89, label: '890kg' },
                { month: 'Jul', val: 95, label: '950kg' },
                { month: 'Aug', val: 100, label: '1.2t' },
              ].map((b) => (
                <div key={b.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[9px] font-mono text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {b.label}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-[#2f8f5b] to-[#10B981] rounded-t-md transition-all duration-700 ease-out group-hover:brightness-125"
                    style={{ height: `${b.val}%` }}
                  />
                  <span className="text-[10px] text-white/60 font-mono">{b.month}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/50 italic">
              <span>*Illustrative figures based on aggregate user diagnostics</span>
              <Link to="/auth" className="text-emerald-400 font-bold hover:underline not-italic">
                View Live Audit Report &rarr;
              </Link>
            </div>
          </div>

        </div>

        {/* Closing CTA Line */}
        <div className="text-center pt-4">
          <Link
            to="/device"
            className="btn-peach !py-3.5 !px-9 text-btn font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
          >
            <span>Start Your First Diagnosis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ImpactExpandedSection;
