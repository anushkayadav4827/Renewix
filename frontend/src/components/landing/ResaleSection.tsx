import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, ShieldCheck, Zap, Sparkles, RefreshCw } from 'lucide-react';
import { LeafDecor, CircuitTrail, Bokeh } from '../decor';

export const ResaleSection: React.FC = () => {
  const [deviceType, setDeviceType] = useState<'smartphone' | 'laptop' | 'tablet' | 'smartwatch'>('smartphone');
  const [deviceAge, setDeviceAge] = useState<'< 1 yr' | '1-2 yrs' | '2-3 yrs' | '3+ yrs'>('1-2 yrs');
  const [condition, setCondition] = useState<'Flawless' | 'Good' | 'Fair' | 'Damaged'>('Good');

  // Dynamic estimate calculation based on state
  const basePrices: Record<string, number> = {
    smartphone: 32000,
    laptop: 58000,
    tablet: 26000,
    smartwatch: 14000,
  };

  const ageMultipliers: Record<string, number> = {
    '< 1 yr': 0.72,
    '1-2 yrs': 0.55,
    '2-3 yrs': 0.40,
    '3+ yrs': 0.28,
  };

  const condMultipliers: Record<string, number> = {
    Flawless: 1.15,
    Good: 1.0,
    Fair: 0.8,
    Damaged: 0.55,
  };

  const calculatedBase = (basePrices[deviceType] || 30000) * (ageMultipliers[deviceAge] || 0.5) * (condMultipliers[condition] || 1.0);
  const minVal = Math.round((calculatedBase * 0.92) / 100) * 100;
  const maxVal = Math.round((calculatedBase * 1.08) / 100) * 100;

  return (
    <section id="resale" className="relative bg-[#f9e6d3] text-[#16301f] py-[var(--sec-y)] border-b border-[#0f3b28]/10 overflow-hidden">
      {/* Background Decor */}
      <CircuitTrail className="absolute top-10 right-4 w-[360px] opacity-15" color="#0f3b28" />
      <LeafDecor variant="broad" className="absolute -bottom-6 -left-6 opacity-10" color="#0f3b28" size={180} />
      <Bokeh className="top-1/4 left-1/3 w-80 h-80" color="#f8b08c" />

      <div className="renewix-container relative z-10 space-y-12">
        {/* Top Grid: Copy on Left, Estimator Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f8b08c]/40 border border-[#f8b08c]/60 text-[#16301f] text-chip-label font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#f08a5d]" />
              <span>Resale & Exchange</span>
            </div>

            <h2 className="text-section-h2 text-[#16301f] font-extrabold tracking-tight">
              Give your old device a second life, and get real value back.
            </h2>

            <p className="text-body-card text-[#4a5f52] leading-relaxed max-w-xl">
              Don't leave retiring electronics sitting in a drawer. Renewix evaluates genuine device health, unlocks fair trade-in value, and facilitates trusted local exchange with certified data eradication.
            </p>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              {[
                'Instant AI-backed trade-in and exchange valuation',
                'Transparent pricing with zero hidden deduction fees',
                'Certified DoD 5220.22-M military-grade data wipe guarantee',
                'Convenient doorstep inspection and instant UPI payout',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#2f8f5b] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-body-card text-[#16301f] font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                to="/device"
                className="btn-peach !py-3.5 !px-8 text-btn font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span>Check My Device's Value</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Estimator Card + Floating Box */}
          <div className="lg:col-span-6 relative">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-[#0f3b28]/15 shadow-editorial-lg space-y-6">
              <div className="flex items-center justify-between border-b border-[#0f3b28]/10 pb-4">
                <div className="space-y-0.5">
                  <h3 className="text-card-title text-[#16301f] font-extrabold">Instant Trade-in Estimator</h3>
                  <p className="text-chip-label text-[#4a5f52]">Select device profile for real-time market value</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#dcebd9] flex items-center justify-center text-[#2f8f5b]">
                  <RefreshCw className="w-5 h-5" />
                </div>
              </div>

              {/* Device Selector */}
              <div className="space-y-2">
                <label className="text-chip-label text-[#4a5f52] font-bold uppercase tracking-wider block">1. Device Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['smartphone', 'laptop', 'tablet', 'smartwatch'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDeviceType(type)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        deviceType === type
                          ? 'bg-[#103D29] text-white shadow-xs'
                          : 'bg-[#fdf1e4] text-[#16301f] hover:bg-[#f8b08c]/30 border border-[#0f3b28]/10'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Selector */}
              <div className="space-y-2">
                <label className="text-chip-label text-[#4a5f52] font-bold uppercase tracking-wider block">2. Device Age</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['< 1 yr', '1-2 yrs', '2-3 yrs', '3+ yrs'] as const).map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => setDeviceAge(age)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        deviceAge === age
                          ? 'bg-[#103D29] text-white shadow-xs'
                          : 'bg-[#fdf1e4] text-[#16301f] hover:bg-[#f8b08c]/30 border border-[#0f3b28]/10'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Selector */}
              <div className="space-y-2">
                <label className="text-chip-label text-[#4a5f52] font-bold uppercase tracking-wider block">3. Cosmetic Condition</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Flawless', 'Good', 'Fair', 'Damaged'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCondition(c)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        condition === c
                          ? 'bg-[#103D29] text-white shadow-xs'
                          : 'bg-[#fdf1e4] text-[#16301f] hover:bg-[#f8b08c]/30 border border-[#0f3b28]/10'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Valuation Display Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0a2a1d] to-[#14482f] text-white space-y-1 shadow-md">
                <span className="text-chip-label text-[#f8b08c] font-bold uppercase tracking-wider block">
                  Estimated Resale / Exchange Range
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#dcebd9] font-sans tracking-tight">
                  ₹{minVal.toLocaleString()} – ₹{maxVal.toLocaleString()}
                </div>
                <p className="text-[11px] text-white/60 italic pt-1">
                  *Illustrative demo estimate. Final verified quote generated post-diagnostic intake.
                </p>
              </div>
            </div>

            {/* Floating Device Box Mascot Overlay */}
            <div className="absolute -bottom-6 -right-6 w-28 sm:w-36 pointer-events-none float-device-2 hidden sm:block">
              <img
                src="/assets/tile-resale-box.png"
                alt="Box resale"
                className="w-full object-contain filter drop-shadow-xl"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </div>

        </div>

        {/* Bottom Strip: 3-Step Handover Flow & Trust Badges */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#0f3b28]/10 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#103D29] text-white font-extrabold flex items-center justify-center flex-shrink-0 text-sm shadow-xs">
                1
              </div>
              <div className="space-y-1">
                <h4 className="text-card-title text-[#16301f] font-extrabold">Diagnostic Valuation</h4>
                <p className="text-body-card text-[#4a5f52] leading-relaxed">
                  Run a 2-minute diagnostic to generate your verified hardware health certificate.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#103D29] text-white font-extrabold flex items-center justify-center flex-shrink-0 text-sm shadow-xs">
                2
              </div>
              <div className="space-y-1">
                <h4 className="text-card-title text-[#16301f] font-extrabold">Instant Payout Choice</h4>
                <p className="text-body-card text-[#4a5f52] leading-relaxed">
                  Select direct bank transfer, instant UPI, or bonus exchange credits on trusted retailer stores.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#103D29] text-white font-extrabold flex items-center justify-center flex-shrink-0 text-sm shadow-xs">
                3
              </div>
              <div className="space-y-1">
                <h4 className="text-card-title text-[#16301f] font-extrabold">Zero-Hassle Handover</h4>
                <p className="text-body-card text-[#4a5f52] leading-relaxed">
                  Technician handles free doorstep pickup and performs certified data erasure before collection.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-around gap-4 pt-4 border-t border-[#0f3b28]/10 text-chip-label text-[#16301f] font-bold">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2f8f5b]" />
              <span>Certified DoD Data Erasure</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#f08a5d]" />
              <span>Instant UPI & Bank Settlement</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2f8f5b]" />
              <span>Free Doorstep Pickup Across 40+ Cities</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResaleSection;
