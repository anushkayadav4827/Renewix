import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RefreshCw,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function SecondHandMarketplace() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'exchange'>('buy');

  // Sell form state
  const [sellBrand, setSellBrand] = useState('Apple');
  const [sellModel, setSellModel] = useState('iPhone 12');
  const [condition, setCondition] = useState('good');
  const [estimatedValue, setEstimatedValue] = useState(19500);

  const calculateEstimate = (cond: string) => {
    setCondition(cond);
    if (cond === 'flawless') setEstimatedValue(23500);
    else if (cond === 'good') setEstimatedValue(19500);
    else if (cond === 'minor_damage') setEstimatedValue(14800);
    else setEstimatedValue(8500);
  };

  const refurbishedListings = [
    {
      id: 'REF-1',
      title: 'Apple iPhone 13 128GB (Renewix Certified)',
      category: 'Smartphone',
      condition: 'Excellent Grade A',
      price: 36999,
      originalPrice: 59900,
      warranty: '12 Months Renewix Warranty',
      seller: 'Renewix Verified Recommerce',
      batteryHealth: '92% Genuine Apple Battery',
      image: '📱',
    },
    {
      id: 'REF-2',
      title: 'MacBook Air M1 256GB Space Grey',
      category: 'Laptop',
      condition: 'Pristine Condition',
      price: 54990,
      originalPrice: 89900,
      warranty: '12 Months Comprehensive',
      seller: 'Tata Neu NeuPass Partner',
      batteryHealth: '96% Cycle Count 84',
      image: '💻',
    },
    {
      id: 'REF-3',
      title: 'Sony WH-1000XM4 Noise Cancelling',
      category: 'Headphones',
      condition: 'Refurbished Grade A+',
      price: 16499,
      originalPrice: 26990,
      warranty: '6 Months Replacement',
      seller: 'SoundPro Refurbished Hub',
      batteryHealth: 'Tested 28+ Hours Playback',
      image: '🎧',
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#103D29]/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#103D29] text-[#D9E5C4] text-xs font-bold">
              <RefreshCw className="w-3.5 h-3.5 text-[#F9C49B]" />
              <span>Renewix Circular Recommerce</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17251D]">
              Second-Hand & Refurbished Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-[#68736A]">
              Buy certified refurbished devices with warranty, sell your used tech, or exchange with top trade-in partners.
            </p>
          </div>

          {/* Sub-Tabs */}
          <div className="flex bg-[#F9EBDD] p-1.5 rounded-full border border-[#103D29]/10 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('buy')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'buy' ? 'bg-[#103D29] text-white shadow-sm' : 'text-[#68736A] hover:text-[#17251D]'
              }`}
            >
              Buy Refurbished
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sell')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sell' ? 'bg-[#103D29] text-white shadow-sm' : 'text-[#68736A] hover:text-[#17251D]'
              }`}
            >
              Sell Device
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('exchange')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'exchange' ? 'bg-[#103D29] text-white shadow-sm' : 'text-[#68736A] hover:text-[#17251D]'
              }`}
            >
              Trade-in Exchange
            </button>
          </div>
        </div>

        {/* Tab 1: Buy Refurbished */}
        {activeTab === 'buy' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {refurbishedListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#F9EBDD] rounded-3xl p-6 border border-[#103D29]/10 shadow-editorial hover:shadow-editorial-lg transition-all flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm border border-[#103D29]/10">
                      {item.image}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D9E5C4] text-[#103D29]">
                        {item.condition}
                      </span>
                      <h3 className="font-bold text-base text-[#17251D] pt-1">{item.title}</h3>
                      <p className="text-xs text-[#68736A]">{item.batteryHealth}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white border border-[#103D29]/10 space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-[#103D29]">₹{item.price.toLocaleString()}</span>
                        <span className="text-xs text-[#68736A] line-through">₹{item.originalPrice.toLocaleString()}</span>
                      </div>
                      <div className="text-[11px] text-[#10B981] font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{item.warranty}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/deals"
                    className="w-full py-3 rounded-full bg-[#103D29] hover:bg-[#174C32] text-white font-bold text-xs text-center shadow-md transition-colors"
                  >
                    View Verified Listing Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Sell Your Device */}
        {activeTab === 'sell' && (
          <div className="bg-[#F9EBDD] rounded-4xl p-8 sm:p-12 border border-[#103D29]/10 shadow-editorial max-w-3xl mx-auto space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#17251D]">Instant Second-Hand Device Valuation</h2>
              <p className="text-xs sm:text-sm text-[#68736A]">
                Select your device details and condition for a guaranteed cash quote with doorstep pickup.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#17251D]">Device Brand</label>
                <select
                  value={sellBrand}
                  onChange={(e) => setSellBrand(e.target.value)}
                  className="w-full bg-white border border-[#103D29]/15 rounded-2xl px-4 py-2.5 text-xs text-[#17251D] focus:outline-none"
                >
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="OnePlus">OnePlus</option>
                  <option value="Xiaomi">Xiaomi</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#17251D]">Model</label>
                <input
                  type="text"
                  value={sellModel}
                  onChange={(e) => setSellModel(e.target.value)}
                  className="w-full bg-white border border-[#103D29]/15 rounded-2xl px-4 py-2 text-xs text-[#17251D]"
                />
              </div>
            </div>

            {/* Condition Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#17251D]">Physical Condition</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'flawless', label: 'Flawless' },
                  { id: 'good', label: 'Good / Minor Wear' },
                  { id: 'minor_damage', label: 'Screen Cracked' },
                  { id: 'broken', label: 'Won’t Turn On' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => calculateEstimate(c.id)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      condition === c.id
                        ? 'bg-[#103D29] text-white border-[#103D29]'
                        : 'bg-white text-[#17251D] border-[#103D29]/15 hover:border-[#103D29]/40'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Value Quote */}
            <div className="p-6 rounded-3xl bg-white border border-[#103D29]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#68736A] font-medium">Estimated Instant Payout:</span>
                <div className="text-3xl font-extrabold text-[#103D29]">₹{estimatedValue.toLocaleString()}</div>
                <p className="text-[11px] text-[#10B981] font-semibold mt-0.5">Free doorstep inspection & instant UPI transfer</p>
              </div>

              <button
                type="button"
                className="px-6 py-3 rounded-full bg-[#F9C49B] text-[#17251D] font-bold text-xs shadow-md hover:bg-[#f7b684] transition-colors cursor-pointer"
              >
                Schedule Free Pickup
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Trade-in Exchange */}
        {activeTab === 'exchange' && (
          <div className="bg-[#103D29] text-white rounded-4xl p-8 sm:p-12 shadow-editorial-lg space-y-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-[#D9E5C4]">
                Renewix Multi-Store Exchange Radar
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">Trade-in Exchange Top-Up Program</h2>
              <p className="text-xs sm:text-sm text-white/70">
                Major retail partners provide up to ₹2,500 extra broken-screen exchange bonus when upgrading.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                <div className="font-bold text-sm text-[#F9C49B]">Flipkart Exchange</div>
                <div className="text-lg font-extrabold">₹1,200 Extra Bonus</div>
                <p className="text-xs text-white/60">Applied directly at checkout for broken display units</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                <div className="font-bold text-sm text-[#F9C49B]">Amazon Trade-in</div>
                <div className="text-lg font-extrabold">₹1,000 Extra Bonus</div>
                <p className="text-xs text-white/60">Instant Amazon Pay balance credit on courier pickup</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                <div className="font-bold text-sm text-[#F9C49B]">Croma In-Store</div>
                <div className="text-lg font-extrabold">₹1,500 Extra Bonus</div>
                <p className="text-xs text-white/60">Tata NeuCoins + instant showroom trade-in discount</p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/deals"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#F9C49B] text-[#17251D] font-bold text-xs shadow-md hover:bg-[#f7b684] transition-colors"
              >
                <span>Compare Exchange Deals for Your Device</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
    </div>
  );
}
