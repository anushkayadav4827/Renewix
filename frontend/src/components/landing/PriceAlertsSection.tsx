import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ArrowRight, TrendingDown, Calendar, ShieldCheck, Tag } from 'lucide-react';
import { LeafDecor, CircuitTrail } from '../decor';

export const PriceAlertsSection: React.FC = () => {
  return (
    <section id="price-alerts" className="relative bg-white text-[#16301f] py-[var(--sec-y)] border-b border-[#0f3b28]/10 overflow-hidden">
      {/* Background Soft Green Glow & Decor */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#dcebd9]/40 rounded-full blur-[140px] pointer-events-none" />
      <CircuitTrail className="absolute bottom-6 left-6 w-[340px] opacity-15" color="#2f8f5b" />
      <LeafDecor variant="oval" className="absolute top-10 right-10 opacity-10" color="#2f8f5b" size={140} />

      <div className="renewix-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Phone Mockup with Sliding Notifications & Mini Self-Drawing Chart */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[480px] bg-[#0a2a1d] rounded-4xl p-5 sm:p-7 text-white shadow-editorial-lg border border-white/15 space-y-5">
              
              {/* Phone Header / Dynamic Island */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-mono font-bold text-[#dcebd9]">9:41 AM</span>
                <div className="w-20 h-4 bg-black/60 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <span className="text-[10px] font-bold">5G</span>
                  <div className="w-5 h-2.5 border border-white/60 rounded-xs p-0.5">
                    <div className="w-full h-full bg-emerald-400" />
                  </div>
                </div>
              </div>

              {/* 3 Animated Sliding Notification Cards */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm space-y-1 transform hover:-translate-y-0.5 transition-transform">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#f8b08c] flex items-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5 text-[#f8b08c]" />
                      <span>Price Drop Alert</span>
                    </span>
                    <span className="text-[10px] text-white/60">2m ago</span>
                  </div>
                  <p className="text-xs font-bold text-white leading-snug">
                    Laptop 14″ dropped ₹12,000 on Amazon & Flipkart!
                  </p>
                  <div className="flex items-center gap-2 pt-0.5 text-[11px] text-[#dcebd9]">
                    <span className="line-through text-white/50">₹64,999</span>
                    <strong className="text-emerald-400 font-extrabold">₹52,990</strong>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">↓ 18% OFF</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm space-y-1 transform hover:-translate-y-0.5 transition-transform">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#f2c94c] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#f2c94c]" />
                      <span>Sale Timing Radar</span>
                    </span>
                    <span className="text-[10px] text-white/60">1h ago</span>
                  </div>
                  <p className="text-xs font-medium text-white/90 leading-snug">
                    Upcoming Tech Mega Sale starts in <strong>~12 days</strong>. Projected savings: ₹3,500 – ₹5,000.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm space-y-1 transform hover:-translate-y-0.5 transition-transform">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified Local Store</span>
                    </span>
                    <span className="text-[10px] text-white/60">Just now</span>
                  </div>
                  <p className="text-xs font-medium text-white/90 leading-snug">
                    Store match found 2.4 km away: unit available in stock with 1-year brand warranty.
                  </p>
                </div>
              </div>

              {/* Mini Price History Line Chart */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-chip-label font-bold text-[#dcebd9] uppercase tracking-wider">
                    6-Month Historical Trajectory
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    All-Time Low Dip
                  </span>
                </div>

                {/* SVG Curve */}
                <div className="relative h-28 w-full">
                  <svg viewBox="0 0 300 100" fill="none" className="w-full h-full overflow-visible">
                    {/* Shaded Sale Band */}
                    <rect x="180" y="0" width="80" height="100" fill="#2f8f5b" fillOpacity="0.12" rx="4" />
                    <text x="185" y="16" fill="#a7f3d0" fontSize="9" fontWeight="bold">Expected Sale</text>

                    {/* Gradient under curve */}
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f8b08c" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#f8b08c" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 10 30 Q 70 20 120 45 T 200 85 T 260 55 T 290 60 L 290 95 L 10 95 Z"
                      fill="url(#chartGrad)"
                    />
                    {/* Main trajectory path */}
                    <path
                      d="M 10 30 Q 70 20 120 45 T 200 85 T 260 55 T 290 60"
                      stroke="#f8b08c"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Optimal Buy Point Beacon */}
                    <circle cx="200" cy="85" r="5" fill="#10B981" />
                    <circle cx="200" cy="85" r="9" stroke="#10B981" strokeWidth="1.5" className="animate-ping" opacity="0.75" />
                  </svg>
                  <div className="absolute top-16 left-[56%] bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                    BEST TIME TO BUY
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-white/60 font-mono pt-1">
                  <span>6 Mos Ago</span>
                  <span>Diwali Sale Dip</span>
                  <span>Today</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Value Proposition & Feature List */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dcebd9] border border-[#2f8f5b]/30 text-[#103D29] text-chip-label font-bold uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5 text-[#2f8f5b]" />
              <span>Smart Price Alerts & Radar</span>
            </div>

            <h2 className="text-section-h2 text-[#16301f] font-extrabold tracking-tight">
              Never overpay. Buy at the exact right moment.
            </h2>

            <p className="text-body-card text-[#4a5f52] leading-relaxed max-w-xl">
              Electronics prices fluctuate wildly with artificial MRP markups before sales. Renewix radar monitors price history across Amazon, Flipkart, Croma, and verified regional retailers to spot true discounts and predict upcoming festive dips.
            </p>

            {/* Feature List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#dcebd9] flex items-center justify-center text-[#2f8f5b] flex-shrink-0 mt-0.5">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-card-title text-[#16301f] font-extrabold">Real-Time Price Drop Alerts</h4>
                  <p className="text-body-card text-[#4a5f52] text-xs sm:text-sm">
                    Set a target budget and receive instant push or WhatsApp alerts the second retail price hits your threshold.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#f8b08c]/40 flex items-center justify-center text-[#f08a5d] flex-shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-card-title text-[#16301f] font-extrabold">Seasonal Festival Discount Radar</h4>
                  <p className="text-body-card text-[#4a5f52] text-xs sm:text-sm">
                    Predictive analysis alerts you when an upcoming mega sale (Diwali, Republic Day, Prime Day) is 12–18 days away so you avoid buying at pre-sale peaks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#dcebd9] flex items-center justify-center text-[#2f8f5b] flex-shrink-0 mt-0.5">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-card-title text-[#16301f] font-extrabold">Fake Discount & Pre-Sale Markup Detection</h4>
                  <p className="text-body-card text-[#4a5f52] text-xs sm:text-sm">
                    Algorithmic price history exposes inflated pre-sale MRP markups to guarantee you only purchase on genuine floor prices.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/deals"
                className="btn-forest !py-3.5 !px-8 text-btn font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span>Explore Replacement Deals & Radar</span>
                <ArrowRight className="w-4 h-4 text-[#f8b08c]" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PriceAlertsSection;
