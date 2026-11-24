import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Wrench,
  ShoppingCart,
  Bell,
  RefreshCw,
  Leaf,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { getCurrentUser } from 'aws-amplify/auth';

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [recentDiagnoses, setRecentDiagnoses] = useState<any[]>([]);

  useEffect(() => {
    getCurrentUser()
      .then((u) => setUser(u))
      .catch(() => {
        // demo / fallback user
        setUser({ username: 'Verified Member' });
      });

    // Load recent diagnoses from sessionStorage or local cache
    try {
      const historyStr = localStorage.getItem('diagnosisHistory') || sessionStorage.getItem('diagnosisHistory');
      if (historyStr) {
        setRecentDiagnoses(JSON.parse(historyStr));
      } else {
        // Pre-populate with realistic user activity
        setRecentDiagnoses([
          {
            id: 'REC-2026-891',
            device: 'OnePlus 8T',
            issue: 'Outer Screen Glass Crack & Green Line',
            repairScore: 83,
            verdict: 'Repair Strongly Recommended',
            date: 'Nov 22, 2026',
            status: 'Diagnostic Complete',
            estimatedCost: '₹2,300',
          },
          {
            id: 'REC-2026-742',
            device: 'MacBook Air M1',
            issue: 'Battery Degraded (12% capacity)',
            repairScore: 78,
            verdict: 'Repair Favored',
            date: 'Nov 14, 2026',
            status: 'Battery Replaced',
            estimatedCost: '₹4,500',
          },
        ]);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#103D29]/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#103D29]/10 text-[#103D29] text-xs font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#103D29]" />
              <span>Renewix Sustainability Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17251D]">
              Welcome back{user?.username ? `, ${user.username.split('@')[0]}` : ''}
            </h1>
            <p className="text-sm text-[#68736A]">
              Monitor your devices, track repair decisions, view price alerts, and calculate your carbon savings.
            </p>
          </div>

          <Link
            to="/device"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#103D29] hover:bg-[#174C32] text-white font-bold text-sm shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#F9C49B]" />
            <span>Start New Diagnosis</span>
          </Link>
        </div>

        {/* Top 3 Impact & Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#F9EBDD] p-5 rounded-3xl border border-[#103D29]/10 space-y-2 shadow-editorial">
            <div className="flex items-center justify-between text-xs text-[#68736A] font-semibold">
              <span>Financial Savings</span>
              <span className="p-1.5 rounded-xl bg-[#F9C49B] text-[#103D29]">₹</span>
            </div>
            <div className="text-2xl font-extrabold text-[#103D29]">₹14,800</div>
            <p className="text-[11px] text-[#68736A]">Savings vs buying brand new</p>
          </div>

          <div className="bg-[#F9EBDD] p-5 rounded-3xl border border-[#103D29]/10 space-y-2 shadow-editorial">
            <div className="flex items-center justify-between text-xs text-[#68736A] font-semibold">
              <span>E-Waste Avoided</span>
              <Leaf className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="text-2xl font-extrabold text-[#103D29]">430 g</div>
            <p className="text-[11px] text-[#68736A]">Direct toxic landfill diversion</p>
          </div>

          <div className="bg-[#F9EBDD] p-5 rounded-3xl border border-[#103D29]/10 space-y-2 shadow-editorial">
            <div className="flex items-center justify-between text-xs text-[#68736A] font-semibold">
              <span>Active Price Alerts</span>
              <Bell className="w-4 h-4 text-[#E28E5C]" />
            </div>
            <div className="text-2xl font-extrabold text-[#17251D]">2 Alerts</div>
            <p className="text-[11px] text-[#68736A]">Monitoring OnePlus 8T & MacBook</p>
          </div>

          <div className="bg-[#F9EBDD] p-5 rounded-3xl border border-[#103D29]/10 space-y-2 shadow-editorial">
            <div className="flex items-center justify-between text-xs text-[#68736A] font-semibold">
              <span>Saved Devices</span>
              <Smartphone className="w-4 h-4 text-[#103D29]" />
            </div>
            <div className="text-2xl font-extrabold text-[#17251D]">2 Devices</div>
            <p className="text-[11px] text-[#68736A]">Health telemetry active</p>
          </div>
        </div>

        {/* Main 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Recent Diagnoses & Active Recommendations (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#17251D] flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#103D29]" />
                <span>Recent Diagnostics & Decisions</span>
              </h2>
              <Link to="/history" className="text-xs font-bold text-[#103D29] hover:underline flex items-center gap-1">
                <span>View Full History</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentDiagnoses.map((diag, i) => (
                <div
                  key={i}
                  className="bg-[#F9EBDD] p-5 rounded-3xl border border-[#103D29]/10 shadow-editorial hover:border-[#103D29]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-[#17251D]">{diag.device}</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#103D29]/10 text-[#103D29]">
                        Score: {diag.repairScore}/100
                      </span>
                    </div>
                    <p className="text-xs text-[#68736A] font-medium">{diag.issue}</p>
                    <div className="flex items-center gap-4 text-[11px] text-[#68736A] pt-1">
                      <span>Date: {diag.date}</span>
                      <span>•</span>
                      <span>Est. Repair: <strong className="text-[#103D29]">{diag.estimatedCost}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Link
                      to="/compare"
                      className="text-xs font-bold px-4 py-2 rounded-full bg-[#103D29] text-white hover:bg-[#174C32] transition-colors"
                    >
                      View Verdict
                    </Link>
                    <Link
                      to="/providers"
                      className="text-xs font-bold px-3 py-2 rounded-full bg-white text-[#103D29] border border-[#103D29]/20 hover:bg-[#FFF3E5] transition-colors"
                    >
                      Book Shop
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Alerts Panel */}
            <div className="bg-[#F9EBDD] rounded-3xl p-6 border border-[#103D29]/10 shadow-editorial space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-5 h-5 text-[#E28E5C]" />
                  <h3 className="font-bold text-base text-[#17251D]">Price Drop Alerts Active</h3>
                </div>
                <Link to="/deals" className="text-xs font-bold text-[#103D29] hover:underline">
                  Manage in Deals
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#103D29]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[#17251D]">Target Alert: OnePlus 8T (Refurbished/New)</div>
                  <div className="text-xs text-[#68736A]">
                    Target Price: <strong className="text-[#103D29]">₹12,000</strong> · Current lowest: ₹12,899 on Flipkart
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#D9E5C4] text-[#103D29] self-start sm:self-auto">
                  ⚡ ₹899 to target
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Actions, Resale & Settings (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-[#103D29] text-white rounded-3xl p-6 shadow-editorial-lg space-y-5">
              <h3 className="font-bold text-lg">Quick Actions</h3>
              <div className="space-y-2.5 text-sm">
                <Link
                  to="/device"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#F9C49B]" />
                    <span>Diagnose Broken Device</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-white/50" />
                </Link>

                <Link
                  to="/deals"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-[#F9C49B]" />
                    <span>Browse Replacement Deals</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-white/50" />
                </Link>

                <Link
                  to="/providers"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10"
                >
                  <span className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-[#D9E5C4]" />
                    <span>Find Local Repair Shops</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-white/50" />
                </Link>
              </div>
            </div>

            {/* Resale & Exchange Activity */}
            <div className="bg-[#F9EBDD] rounded-3xl p-6 border border-[#103D29]/10 shadow-editorial space-y-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#103D29]" />
                <h3 className="font-bold text-base text-[#17251D]">Resale & Trade-in Value</h3>
              </div>
              <p className="text-xs text-[#68736A] leading-relaxed">
                Your broken OnePlus 8T still has an estimated trade-in salvage value of <strong className="text-[#103D29]">₹3,000–₹4,200</strong> on verified exchange portals.
              </p>
              <Link
                to="/deals"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#103D29] hover:underline"
              >
                <span>Check Trade-In Partners</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
  );
}
