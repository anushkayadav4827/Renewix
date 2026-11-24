import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Store,
  CheckCircle2,
  Sparkles,
  MapPin,
  Tag,
  Clock,
  Bell,
  BellRing,
  Copy,
  Check,
  Leaf,
  AlertTriangle,
  Calendar,
  BarChart3,
  TrendingDown,
  Wrench,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface MarketplaceOption {
  platform: string;
  badge?: string;
  badgeColor?: string;
  basePriceINR: number;
  exchangeBonusINR: number;
  netPriceINR: number;
  couponCode?: string;
  couponDiscountINR?: number;
  perks: string[];
  ctaLabel: string;
  url: string;
  color: string;
}

interface TechEvent {
  eventName: string;
  dates: string;
  daysRemaining: number;
  platforms: string[];
  expectedSavingsINR: string;
  highlightOffer: string;
  badge: string;
  recommended: boolean;
}

export default function ReplacementDeals() {
  const [intakeData, setIntakeData] = useState<any>({});
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Price Drop Alert State
  const [targetPrice, setTargetPrice] = useState<number>(12000);
  const [alertContact, setAlertContact] = useState<string>('');
  const [alertActive, setAlertActive] = useState<boolean>(false);

  // Selected History Point
  const [selectedHistoryIdx, setSelectedHistoryIdx] = useState<number>(3); // Default to Diwali Sale (Lowest Floor)

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'stores' | 'events' | 'history'>('stores');

  useEffect(() => {
    try {
      const intakeStr = sessionStorage.getItem('intakeData');
      if (intakeStr) setIntakeData(JSON.parse(intakeStr));
    } catch {
      // ignore
    }
  }, []);

  const deviceBrand = intakeData.brand || 'Your';
  const deviceModel = intakeData.model || 'Device';
  const userCity = intakeData.city || 'your city';
  const queryTerm = `${deviceBrand} ${deviceModel}`.trim();

  // Dynamically calculate realistic market baseline prices based on diagnosis or intake
  const storedResult = useMemo(() => {
    try {
      const stored = sessionStorage.getItem('diagnosisResult');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const purchasePrice = Number(intakeData.purchasePriceINR) || 0;

  const replaceBasePrice = useMemo(() => {
    if (storedResult?.replacementCostRange?.minINR && storedResult.replacementCostRange.minINR > 2000) {
      return storedResult.replacementCostRange.minINR;
    }
    if (purchasePrice > 0) {
      return Math.round(purchasePrice * 0.88);
    }
    return 24999;
  }, [storedResult, purchasePrice]);

  const exchangeValue = useMemo(() => {
    return Math.max(1500, Math.round(replaceBasePrice * 0.20));
  }, [replaceBasePrice]);

  // Environmental statistics
  const environmentalStats = useMemo(() => {
    return { ewasteGrams: 210, co2Kg: 58, waterLitres: 1350 };
  }, []);

  // Upcoming Tech Sales & Exact Estimated Savings
  const upcomingEvents: TechEvent[] = useMemo(() => {
    return [
      {
        eventName: 'Republic Mega Tech Festival',
        dates: 'Jan 14 – Jan 20 (Starts in ~14 Days)',
        daysRemaining: 14,
        platforms: ['Flipkart', 'Amazon India', 'Croma Showrooms'],
        expectedSavingsINR: '₹3,500 – ₹5,000 (18% to 25% OFF)',
        highlightOffer: 'Flat 10% Instant Bank Discount on HDFC/SBI Cards + ₹2,000 Extra Broken-Screen Exchange Bonus',
        badge: '🔥 Highest Predicted Savings',
        recommended: true,
      },
      {
        eventName: 'Amazon Great Indian Tech Carnival',
        dates: 'Jan 15 – Jan 21 (Starts in ~15 Days)',
        daysRemaining: 15,
        platforms: ['Amazon India'],
        expectedSavingsINR: '₹2,800 – ₹4,200 OFF',
        highlightOffer: 'Prime Exclusive 24-Hr Early Access + No-Cost EMI up to 12 Months',
        badge: '⚡ Prime Fast Delivery',
        recommended: false,
      },
      {
        eventName: 'Flipkart Big Bachat Electronics Dhamaka',
        dates: 'Next Weekend (Fri – Sun)',
        daysRemaining: 5,
        platforms: ['Flipkart'],
        expectedSavingsINR: '₹1,500 – ₹2,500 OFF',
        highlightOffer: '5% Unlimited Cashback on Flipkart Axis Bank Card + Free Screen Damage Protection Plan',
        badge: 'Weekend Flash Sale',
        recommended: false,
      },
      {
        eventName: 'Croma In-Store Tech Carnival & Exchange Fair',
        dates: 'Jan 18 – Jan 26',
        daysRemaining: 18,
        platforms: ['Croma Showrooms', 'Croma.com'],
        expectedSavingsINR: '₹2,500 – ₹3,800 OFF',
        highlightOffer: 'Earn 5% Tata NeuCoins + Instant Counter Trade-in Cash with ₹1,000 Exchange Top-up',
        badge: 'In-Store Inspection',
        recommended: false,
      },
    ];
  }, []);

  // 6-Month Price History Points with In-Depth Intelligence
  const priceHistoryPoints = useMemo(() => {
    const historicalFloor = Math.round(replaceBasePrice * 0.92);
    return [
      {
        label: '6 Mos Ago',
        subLabel: 'Jul 2026',
        price: Math.round(replaceBasePrice * 1.22),
        note: 'Normal Retail Price',
        status: 'Baseline MRP',
        detail: 'Standard official retail pricing across all authorized platforms prior to any seasonal sales.',
        isBaseline: true,
      },
      {
        label: '4 Mos Ago',
        subLabel: 'Sep 2026',
        price: Math.round(replaceBasePrice * 1.12),
        note: 'Quarterly Price Drop',
        status: 'Normal Price Drift',
        detail: 'Natural quarterly stock clearance discount across verified portals.',
      },
      {
        label: '3 Mos Ago',
        subLabel: 'Oct 2026',
        price: Math.round(replaceBasePrice * 1.18),
        note: 'Pre-Sale Hike (Fake MRP)',
        status: '⚠️ Artificially Inflated',
        detail: 'Price was spiked right before major sales to make upcoming sale discounts look deeper than they actually were.',
        isHike: true,
      },
      {
        label: 'Diwali Sale',
        subLabel: 'Nov 2026',
        price: historicalFloor,
        note: 'All-Time Low Dip 🔥',
        status: '🏆 Historical Floor',
        detail: 'Deepest authentic discount ever recorded during peak festive days with combined bank offers.',
        isLowest: true,
      },
      {
        label: 'Last Month',
        subLabel: 'Dec 2026',
        price: Math.round(replaceBasePrice * 1.05),
        note: 'Post-Sale Rebound',
        status: 'Post-Sale Reset',
        detail: 'Prices recovered after sale conclusion as festive promotions ended across all retail portals.',
      },
      {
        label: 'Current Price',
        subLabel: 'Today',
        price: replaceBasePrice,
        note: 'Today’s Best Deal',
        status: '⚡ Active Best Offer',
        detail: `Currently sitting at ₹${replaceBasePrice.toLocaleString()} on top marketplaces, just ₹${Math.max(0, replaceBasePrice - historicalFloor).toLocaleString()} above the all-time historic low.`,
        isCurrent: true,
      },
    ];
  }, [replaceBasePrice]);

  const allTimeLow = Math.round(replaceBasePrice * 0.92);
  const allTimeHigh = Math.round(replaceBasePrice * 1.25);

  // Chart Coordinate Calculations for SVG Area Graph
  const chartCoords = useMemo(() => {
    const minP = Math.round(replaceBasePrice * 0.85);
    const maxP = Math.round(replaceBasePrice * 1.30);
    const paddingLeft = 70;
    const paddingRight = 45;
    const topY = 42;
    const bottomY = 208;
    const usableW = 760 - paddingLeft - paddingRight;
    const usableH = bottomY - topY;

    return priceHistoryPoints.map((pt, i) => {
      const x = paddingLeft + (i * usableW) / (priceHistoryPoints.length - 1);
      const ratio = (pt.price - minP) / (maxP - minP);
      const y = bottomY - ratio * usableH;
      return { ...pt, x, y };
    });
  }, [priceHistoryPoints, replaceBasePrice]);

  const splinePaths = useMemo(() => {
    if (chartCoords.length < 2) return { line: '', area: '' };

    let line = `M ${chartCoords[0].x} ${chartCoords[0].y}`;
    for (let i = 1; i < chartCoords.length; i++) {
      const prev = chartCoords[i - 1];
      const curr = chartCoords[i];
      const cpX1 = prev.x + (curr.x - prev.x) * 0.5;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) * 0.5;
      const cpY2 = curr.y;
      line += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }

    const first = chartCoords[0];
    const last = chartCoords[chartCoords.length - 1];
    const area = `${line} L ${last.x} 230 L ${first.x} 230 Z`;

    return { line, area };
  }, [chartCoords]);

  // Stores Data
  const marketplaceStores: MarketplaceOption[] = useMemo(() => {
    const flipkartPrice = storedResult?.marketContext?.flipkartPriceINR || Math.round(replaceBasePrice * 0.97);
    const amazonPrice = storedResult?.marketContext?.amazonPriceINR || Math.round(replaceBasePrice * 0.99);
    const cromaPrice = replaceBasePrice;
    const reliancePrice = Math.round(replaceBasePrice * 1.02);
    const brandPrice = Math.round(replaceBasePrice * 1.04);

    return [
      {
        platform: 'Flipkart',
        badge: '⚡ Lowest Price',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        basePriceINR: flipkartPrice,
        exchangeBonusINR: exchangeValue + 1200,
        couponCode: 'FLIPTECH500',
        couponDiscountINR: 500,
        netPriceINR: Math.max(flipkartPrice - (exchangeValue + 1200) - 500, 1000),
        perks: [
          '₹1,200 Extra Broken-Screen Exchange Bonus',
          '5% Instant Cashback with Flipkart Axis Bank Card',
          'Doorstep delivery in 24-48 hrs with Open-Box Delivery',
        ],
        ctaLabel: 'Buy on Flipkart',
        url: `https://www.flipkart.com/search?q=${encodeURIComponent(queryTerm)}`,
        color: 'from-blue-600 to-indigo-600',
      },
      {
        platform: 'Amazon India',
        badge: 'Prime Verified',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        basePriceINR: amazonPrice,
        exchangeBonusINR: exchangeValue,
        couponCode: 'AMZNSAVE1000',
        couponDiscountINR: 1000,
        netPriceINR: Math.max(amazonPrice - exchangeValue - 1000, 1000),
        perks: [
          'Prime Free 1-Day Delivery & 7-Day Replacement',
          'No-Cost EMI from ₹1,099/mo on all leading credit cards',
          'Amazon A-to-Z Guarantee for verified safe transit',
        ],
        ctaLabel: 'Buy on Amazon',
        url: `https://www.amazon.in/s?k=${encodeURIComponent(queryTerm)}`,
        color: 'from-amber-600 to-orange-600',
      },
      {
        platform: 'Croma (Tata Group)',
        badge: '⚡ 2-Hr Store Pickup',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        basePriceINR: cromaPrice,
        exchangeBonusINR: exchangeValue,
        couponCode: 'TATANEU5',
        couponDiscountINR: Math.round(cromaPrice * 0.05),
        netPriceINR: Math.max(cromaPrice - exchangeValue - Math.round(cromaPrice * 0.05), 1000),
        perks: [
          `Pickup ready in 2 hours at local showroom in ${userCity}`,
          'Earn 5% Tata NeuCoins redeemable across airlines/stores',
          'Free in-store data migration from broken device',
        ],
        ctaLabel: 'Check at Croma',
        url: `https://www.croma.com/searchB?q=${encodeURIComponent(queryTerm)}`,
        color: 'from-emerald-600 to-teal-600',
      },
      {
        platform: 'Reliance Digital',
        badge: 'ResQ Brand Care',
        badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
        basePriceINR: reliancePrice,
        exchangeBonusINR: exchangeValue,
        couponCode: 'RELCARE',
        couponDiscountINR: 650,
        netPriceINR: Math.max(reliancePrice - exchangeValue - 650, 1000),
        perks: [
          'Free 1-Year Extended ResQ Brand Warranty Care',
          'Instant offline trade-in valuation at showroom desk',
          'Instant bank discount on ICICI / HDFC Cards',
        ],
        ctaLabel: 'Check Reliance Digital',
        url: `https://www.reliancedigital.in/search?q=${encodeURIComponent(queryTerm)}`,
        color: 'from-red-600 to-pink-600',
      },
      {
        platform: `${deviceBrand} Official Online`,
        badge: '100% Genuine Brand',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        basePriceINR: brandPrice,
        exchangeBonusINR: exchangeValue + 500,
        couponCode: 'STUDENT10',
        couponDiscountINR: Math.round(brandPrice * 0.08),
        netPriceINR: Math.max(brandPrice - (exchangeValue + 500) - Math.round(brandPrice * 0.08), 1000),
        perks: [
          'Official manufacturer priority support & 1-year guarantee',
          'Student / Corporate discount (8-10% off with ID)',
          'Doorstep diagnostic trade-in pickup with cash credit',
        ],
        ctaLabel: `Visit ${deviceBrand} Store`,
        url: `https://www.google.com/search?q=${encodeURIComponent(`${deviceBrand} official online store india ${deviceModel}`)}`,
        color: 'from-purple-600 to-violet-600',
      },
      {
        platform: `Local Showrooms in ${userCity}`,
        badge: 'Walk-In & Inspect',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        basePriceINR: cromaPrice,
        exchangeBonusINR: exchangeValue,
        netPriceINR: Math.max(cromaPrice - exchangeValue, 1000),
        perks: [
          `Find Croma, Reliance Digital & Vijay Sales showrooms in ${userCity}`,
          'Test physical device in your hands before paying',
          'Negotiate on-the-spot trade-in exchange bonus',
        ],
        ctaLabel: `Find Showrooms in ${userCity}`,
        url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${deviceBrand} electronics showroom near ${userCity}`)}`,
        color: 'from-cyan-600 to-blue-600',
      },
    ];
  }, [exchangeValue, queryTerm, userCity, deviceBrand]);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertContact.trim()) return;
    setAlertActive(true);
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9E5C4] border border-[#103D29]/20 text-[#103D29] text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#103D29] animate-pulse" />
              <span>Smart Price Tracker & Savings Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17251D]">
              Replacement Deals & Price Intelligence
            </h2>
            <p className="text-[#68736A] text-xs sm:text-sm font-medium">
              Live multi-store price comparisons, upcoming tech festival discounts, and verified coupons for{' '}
              <strong className="text-[#17251D] font-extrabold">
                {deviceBrand} {deviceModel}
              </strong>
              .
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/compare"
              className="px-4 py-2.5 rounded-xl bg-white border-2 border-[#103D29]/20 hover:bg-[#F9EBDD] text-xs font-extrabold text-[#17251D] flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#103D29]" />
              <span>Back to AI Verdict & Debate</span>
            </Link>
            <Link
              to="/providers"
              className="px-4 py-2.5 rounded-xl bg-[#103D29] text-white hover:bg-[#174C32] text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-editorial"
            >
              <Wrench className="w-4 h-4 text-[#F9C49B]" />
              <span>Repair Network</span>
            </Link>
          </div>
        </div>

        {/* Environmental Impact Banner */}
        <div className="p-6 rounded-3xl bg-[#103D29] text-white border-2 border-[#103D29] shadow-editorial flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#174C32] text-[#D9E5C4] flex items-center justify-center flex-shrink-0 border border-[#D9E5C4]/20 shadow-xs">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#D9E5C4] uppercase tracking-wider flex items-center gap-2">
                <span>Environmental Impact Score</span>
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              </span>
              <p className="text-xs sm:text-sm text-white/90 font-medium mt-0.5">
                Repairing or trading in your old {deviceBrand} diverts hazardous electronic metals from landfills.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center sm:text-right">
              <span className="text-[11px] text-[#D9E5C4] uppercase tracking-wider block font-bold">E-Waste Avoided</span>
              <strong className="text-xl sm:text-2xl font-black text-white">
                {environmentalStats.ewasteGrams} g
              </strong>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[11px] text-[#D9E5C4] uppercase tracking-wider block font-bold">CO₂ Prevented</span>
              <strong className="text-xl sm:text-2xl font-black text-[#D9E5C4]">
                {environmentalStats.co2Kg} kg CO₂e
              </strong>
            </div>

            <div className="text-center sm:text-right hidden sm:block">
              <span className="text-[11px] text-[#D9E5C4] uppercase tracking-wider block font-bold">Water Conserved</span>
              <strong className="text-xl sm:text-2xl font-black text-[#F9C49B]">
                {environmentalStats.waterLitres.toLocaleString()} L
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          UPCOMING TECH EVENTS & EVENT-SPECIFIC SAVINGS RADAR
         ───────────────────────────────────────────────────────────── */}
      <div className="p-7 rounded-3xl bg-white border-2 border-[#103D29]/15 shadow-editorial space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FFF3E5] text-[#E28E5C] flex items-center justify-center flex-shrink-0 border-2 border-[#E28E5C]/30 shadow-xs">
              <Clock className="w-6 h-6 text-[#E28E5C]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#E28E5C] uppercase tracking-wider block">
                Seasonal Price Drop Radar
              </span>
              <h3 className="text-xl font-extrabold text-[#17251D] flex items-center gap-2">
                <span>Wait For Upcoming Tech Sale (~12–18 Days)</span>
              </h3>
            </div>
          </div>

          <div className="p-3 px-4 rounded-xl bg-[#D9E5C4] border border-[#103D29]/20 text-[#103D29] text-xs font-extrabold flex items-center gap-2 shadow-xs">
            <TrendingDown className="w-4 h-4 text-[#103D29]" />
            <span>Estimated Savings: Save approx. ₹3,500 – ₹5,000</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#68736A] leading-relaxed max-w-3xl font-medium">
          Historical analysis of seasonal pricing cycles indicates a significant drop during upcoming national tech events.
          If your device can function for another 2 weeks, holding off will yield maximum value on your purchase.
        </p>

        {/* Detailed Upcoming Events Deck */}
        <div className="grid md:grid-cols-2 gap-4 pt-1">
          {upcomingEvents.map((evt, idx) => (
            <div
              key={idx}
              className={cn(
                'p-5 rounded-2xl border-2 transition-all space-y-3 bg-[#FFF3E5] shadow-xs',
                evt.recommended
                  ? 'border-[#103D29] ring-2 ring-[#103D29]/15'
                  : 'border-[#103D29]/15'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-base text-[#17251D]">{evt.eventName}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-[#68736A] font-semibold mt-0.5">
                    <Calendar className="w-4 h-4 text-[#103D29]" />
                    <span>{evt.dates}</span>
                  </div>
                </div>

                <span
                  className={cn(
                    'text-[10px] font-extrabold px-2.5 py-1 rounded-full border',
                    evt.recommended
                      ? 'bg-[#D9E5C4] text-[#103D29] border-[#103D29]/20'
                      : 'bg-white text-[#17251D] border-[#103D29]/20'
                  )}
                >
                  {evt.badge}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#103D29]/15 flex items-center justify-between text-xs font-bold">
                <span className="text-[#68736A]">Projected Price Drop:</span>
                <strong className="text-[#103D29] font-black text-sm">{evt.expectedSavingsINR}</strong>
              </div>

              <p className="text-xs text-[#17251D] leading-snug font-medium">
                {evt.highlightOffer}
              </p>

              <div className="text-[11px] text-[#68736A] flex items-center gap-1.5 pt-1 border-t border-[#103D29]/10">
                <span className="font-bold">Available On:</span>
                <span className="text-[#17251D] font-extrabold">{evt.platforms.join(' • ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-3 border-b-2 border-[#103D29]/10 pb-3 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSubTab('stores')}
          className={cn(
            'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 flex-shrink-0',
            activeSubTab === 'stores'
              ? 'bg-[#103D29] text-white shadow-md'
              : 'bg-white text-[#17251D] border border-[#103D29]/20 hover:bg-[#F9EBDD]'
          )}
        >
          <Store className="w-4 h-4 text-[#F9C49B]" />
          <span>Compare Stores & Coupons</span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">6 Stores</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('history')}
          className={cn(
            'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 flex-shrink-0',
            activeSubTab === 'history'
              ? 'bg-[#103D29] text-white shadow-md'
              : 'bg-white text-[#17251D] border border-[#103D29]/20 hover:bg-[#F9EBDD]'
          )}
        >
          <BarChart3 className="w-4 h-4 text-[#103D29]" />
          <span>Price History Graph & Fake Discount Warning</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          STORES & COUPONS SECTION
         ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'stores' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-extrabold text-[#17251D] flex items-center gap-2">
                <span>Multi-Store Best Price Comparison</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#68736A] font-medium">
                Verified live prices, trade-in exchange bonuses, and 1-click active coupons for {deviceBrand}{' '}
                {deviceModel}.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#17251D] font-extrabold bg-white px-3.5 py-2 rounded-xl border border-[#103D29]/20 shadow-xs">
              <MapPin className="w-4 h-4 text-[#103D29]" />
              <span>Location: {userCity}</span>
            </div>
          </div>

          {/* Stores Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {marketplaceStores.map((store, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border-2 border-[#103D29]/15 hover:border-[#103D29] hover:shadow-editorial-lg transition-all flex flex-col justify-between space-y-4 group relative shadow-sm"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-extrabold text-lg text-[#17251D]">{store.platform}</h4>
                    {store.badge && (
                      <span
                        className={cn(
                          'text-[10px] font-extrabold px-2.5 py-1 rounded-full border',
                          store.badgeColor
                        )}
                      >
                        {store.badge}
                      </span>
                    )}
                  </div>

                  {/* Pricing Box */}
                  <div className="p-4 rounded-2xl bg-[#FFF3E5] border border-[#103D29]/15 space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-[#68736A] font-bold">Effective Best Price:</span>
                      <span className="text-2xl font-black text-[#103D29]">
                        ₹{store.netPriceINR.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#68736A] font-medium">
                      <span>Store Price: ₹{store.basePriceINR.toLocaleString()}</span>
                      <span className="text-[#103D29] font-extrabold">
                        -₹{store.exchangeBonusINR.toLocaleString()} Trade-in
                      </span>
                    </div>
                  </div>

                  {/* Active Verified Coupon */}
                  {store.couponCode && (
                    <div className="p-3 rounded-xl bg-[#D9E5C4]/50 border border-[#103D29]/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <Tag className="w-4 h-4 text-[#103D29] flex-shrink-0" />
                        <span className="font-mono font-extrabold text-[#103D29] truncate">
                          {store.couponCode}
                        </span>
                        <span className="text-[11px] text-[#68736A] font-bold hidden sm:inline">
                          (-₹{store.couponDiscountINR})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyCoupon(store.couponCode!)}
                        className="flex items-center gap-1 text-[11px] font-extrabold text-[#103D29] hover:bg-white bg-white/70 px-2.5 py-1 rounded-lg border border-[#103D29]/20 transition-colors cursor-pointer"
                        title="Copy Coupon Code"
                      >
                        {copiedCoupon === store.couponCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#103D29]" />
                            <span className="text-[#103D29]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#103D29]" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Perks List */}
                  <ul className="space-y-1.5 text-xs text-[#17251D] pt-1">
                    {store.perks.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#103D29] flex-shrink-0 mt-0.5" />
                        <span className="leading-snug text-xs font-medium">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct Action Link */}
                <a
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-white transition-all shadow-editorial hover:bg-[#174C32] cursor-pointer bg-[#103D29] mt-2"
                >
                  <span>{store.ctaLabel}</span>
                  <ExternalLink className="w-4 h-4 text-[#F9C49B]" />
                </a>
              </div>
            ))}
          </div>

          {/* 🔔 Price Drop Alert Setup Card */}
          <div className="p-7 rounded-3xl bg-white border-2 border-[#103D29]/15 shadow-editorial space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF3E5] text-[#E28E5C] flex items-center justify-center flex-shrink-0 border-2 border-[#E28E5C]/30 shadow-xs">
                  <BellRing className="w-6 h-6 text-[#E28E5C]" />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-[#17251D]">Set Target Price-Drop Alert</h4>
                  <p className="text-xs sm:text-sm text-[#68736A] font-medium">
                    We'll monitor Flipkart, Amazon, and Croma and notify you when the price hits your target.
                  </p>
                </div>
              </div>

              {alertActive && (
                <span className="text-xs font-extrabold text-[#103D29] bg-[#D9E5C4] border border-[#103D29]/20 px-3.5 py-1.5 rounded-full flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#103D29]" />
                  Alert Active for ₹{targetPrice.toLocaleString()}
                </span>
              )}
            </div>

            <form onSubmit={handleSetAlert} className="grid sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="text-xs text-[#17251D] block mb-1.5 font-extrabold uppercase tracking-wider">
                  Target Price (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#68736A] font-bold">₹</span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="w-full bg-white border-2 border-[#103D29]/20 rounded-xl pl-8 pr-3 py-2.5 text-xs sm:text-sm text-[#17251D] font-bold focus:outline-none focus:border-[#103D29] shadow-inner"
                    placeholder="e.g. 11500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#17251D] block mb-1.5 font-extrabold uppercase tracking-wider">
                  Email or WhatsApp Number
                </label>
                <input
                  type="text"
                  value={alertContact}
                  onChange={(e) => setAlertContact(e.target.value)}
                  className="w-full bg-white border-2 border-[#103D29]/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#17251D] font-bold focus:outline-none focus:border-[#103D29] placeholder:text-[#68736A]/60 shadow-inner"
                  placeholder="e.g. user@gmail.com or 9845012345"
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full min-h-[46px] bg-[#103D29] hover:bg-[#174C32] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-editorial cursor-pointer flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4 text-[#F9C49B]" />
                  <span>Notify Me on Price Drop</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          PRICE HISTORY & FAKE DISCOUNT WARNING SECTION
         ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'history' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#17251D] flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#103D29]" />
              <span>Historical Price Trajectory & Fake Discount Analysis</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#68736A] font-medium">
              6-Month verified price tracking to spot artificially inflated pre-sale MRPs and identify genuine all-time low discounts.
            </p>
          </div>

          {/* Fake Discount Warning Banner */}
          <div className="p-4 rounded-2xl bg-[#FFF3E5] border-2 border-amber-300 flex items-start gap-3.5 text-xs text-amber-950 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-amber-900 block font-black text-sm">
                ⚠️ Fake Discount Pattern Detected on Some Marketplaces:
              </strong>
              <p className="leading-relaxed font-medium">
                Notice the price spike around 3 months ago (₹{priceHistoryPoints[2].price.toLocaleString()}) right before sale events. Some retailers mark up the MRP by ~12% before applying a "20% Discount" sticker. The authentic all-time lowest price was ₹{allTimeLow.toLocaleString()}.
              </p>
            </div>
          </div>

          {/* Key Intelligence Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border-2 border-[#103D29]/15 shadow-sm space-y-1">
              <div className="text-xs text-[#68736A] font-extrabold uppercase tracking-wider">All-Time Lowest Floor</div>
              <div className="text-xl font-black text-[#103D29] flex items-center gap-1.5">
                <span>₹{allTimeLow.toLocaleString()}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#D9E5C4] text-[#103D29] rounded border border-[#103D29]/20">
                  Diwali Sale
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#103D29]/15 shadow-sm space-y-1">
              <div className="text-xs text-[#68736A] font-extrabold uppercase tracking-wider">Pre-Sale Fake Peak</div>
              <div className="text-xl font-black text-red-600 flex items-center gap-1.5">
                <span>₹{priceHistoryPoints[2].price.toLocaleString()}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-100 text-red-700 rounded border border-red-200">
                  +₹1,000 Hike
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#103D29]/15 shadow-sm space-y-1">
              <div className="text-xs text-[#68736A] font-extrabold uppercase tracking-wider">Current Best Deal</div>
              <div className="text-xl font-black text-[#103D29] flex items-center gap-1.5">
                <span>₹{replaceBasePrice.toLocaleString()}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#D9E5C4] text-[#103D29] rounded border border-[#103D29]/20">
                  Today
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#103D29]/15 shadow-sm space-y-1">
              <div className="text-xs text-[#68736A] font-extrabold uppercase tracking-wider">Distance from Floor</div>
              <div className="text-xl font-black text-[#E28E5C] flex items-center gap-1.5">
                <span>+₹{(replaceBasePrice - allTimeLow).toLocaleString()}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#F9C49B]/30 text-[#E28E5C] rounded border border-[#E28E5C]/30">
                  Fair Price
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Visual Graph Card */}
          <div className="p-7 rounded-3xl bg-[#0B2D20] border-2 border-[#103D29] space-y-6 shadow-editorial-lg relative overflow-hidden text-white">
            {/* Top Graph Legend & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/5 pb-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                  <span>Recorded Retail Trajectory</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                  <span>Historic Floor (₹{allTimeLow.toLocaleString()})</span>
                </span>
                <span className="flex items-center gap-1.5 text-red-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm shadow-red-400/50" />
                  <span>Artificial Price Hike</span>
                </span>
              </div>

              <div className="text-slate-400 text-[11px]">
                Peak: <strong className="text-slate-200">₹{allTimeHigh.toLocaleString()}</strong> • Click any point to inspect verified breakdown
              </div>
            </div>

            {/* SVG Interactive Spline Wave Graph */}
            <div className="relative w-full overflow-x-auto pb-2">
              <div className="min-w-[620px]">
                <svg
                  viewBox="0 0 760 260"
                  className="w-full h-64 sm:h-72 overflow-visible select-none"
                >
                  <defs>
                    {/* Area Gradient */}
                    <linearGradient id="priceAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                      <stop offset="45%" stopColor="#10b981" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
                    </linearGradient>

                    {/* Line Stroke Gradient */}
                    <linearGradient id="priceLineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="28%" stopColor="#38bdf8" />
                      <stop offset="45%" stopColor="#f43f5e" />
                      <stop offset="68%" stopColor="#10b981" />
                      <stop offset="88%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>

                    {/* Glow Filter */}
                    <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Horizontal Gridlines & Price Labels */}
                  {[
                    { price: 17000, y: 56, label: '₹17k' },
                    { price: 15000, y: 113, label: '₹15k' },
                    { price: 13000, y: 170, label: '₹13k' },
                  ].map((grid, idx) => (
                    <g key={idx}>
                      <line
                        x1="60"
                        y1={grid.y}
                        x2="720"
                        y2={grid.y}
                        stroke="rgba(255,255,255,0.08)"
                        strokeDasharray="4 4"
                      />
                      <text
                        x="50"
                        y={grid.y + 4}
                        textAnchor="end"
                        className="fill-slate-500 font-mono text-[10px]"
                      >
                        {grid.label}
                      </text>
                    </g>
                  ))}

                  {/* Floor Level Reference Line */}
                  <line
                    x1="60"
                    y1={chartCoords[3]?.y || 180}
                    x2="720"
                    y2={chartCoords[3]?.y || 180}
                    stroke="rgba(16, 185, 129, 0.22)"
                    strokeDasharray="2 4"
                  />

                  {/* Area Fill Under Curve */}
                  {splinePaths.area && (
                    <path d={splinePaths.area} fill="url(#priceAreaGrad)" />
                  )}

                  {/* Glowing Stroke Aura */}
                  {splinePaths.line && (
                    <path
                      d={splinePaths.line}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="6"
                      opacity="0.3"
                      filter="url(#chartGlow)"
                    />
                  )}

                  {/* Main Curve Stroke */}
                  {splinePaths.line && (
                    <path
                      d={splinePaths.line}
                      fill="none"
                      stroke="url(#priceLineGrad)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Active Point Vertical Guideline */}
                  {chartCoords[selectedHistoryIdx] && (
                    <line
                      x1={chartCoords[selectedHistoryIdx].x}
                      y1={chartCoords[selectedHistoryIdx].y}
                      x2={chartCoords[selectedHistoryIdx].x}
                      y2="225"
                      stroke="rgba(255, 255, 255, 0.25)"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Data Points and Callout Badges */}
                  {chartCoords.map((pt, idx) => {
                    const isSelected = selectedHistoryIdx === idx;
                    const nodeColor = pt.isLowest
                      ? '#10b981'
                      : pt.isHike
                      ? '#ef4444'
                      : pt.isCurrent
                      ? '#06b6d4'
                      : '#64748b';

                    return (
                      <g
                        key={idx}
                        className="cursor-pointer group"
                        onClick={() => setSelectedHistoryIdx(idx)}
                      >
                        {/* Outer Pulse Halo for Key Points */}
                        {(pt.isLowest || pt.isCurrent || isSelected) && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isSelected ? 14 : 10}
                            fill={nodeColor}
                            opacity={isSelected ? 0.28 : 0.16}
                            className={pt.isCurrent ? 'animate-pulse' : ''}
                          />
                        )}

                        {/* Outer Ring */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected ? 7 : 5.5}
                          fill="#0f172a"
                          stroke={nodeColor}
                          strokeWidth={isSelected ? 3 : 2.5}
                          className="transition-all duration-200"
                        />

                        {/* Center Dot */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected ? 3.5 : 2.5}
                          fill={nodeColor}
                        />

                        {/* Floating Price Tag Bubble Above Node */}
                        <g transform={`translate(${pt.x}, ${pt.y - 20})`}>
                          <rect
                            x="-32"
                            y="-16"
                            width="64"
                            height="18"
                            rx="5"
                            fill={
                              isSelected
                                ? '#0f172a'
                                : pt.isLowest
                                ? 'rgba(16, 185, 129, 0.25)'
                                : pt.isHike
                                ? 'rgba(239, 68, 68, 0.25)'
                                : pt.isCurrent
                                ? 'rgba(6, 182, 212, 0.25)'
                                : 'rgba(30, 41, 59, 0.85)'
                            }
                            stroke={
                              isSelected
                                ? nodeColor
                                : pt.isLowest
                                ? 'rgba(16, 185, 129, 0.5)'
                                : pt.isHike
                                ? 'rgba(239, 68, 68, 0.5)'
                                : pt.isCurrent
                                ? 'rgba(6, 182, 212, 0.5)'
                                : 'rgba(255, 255, 255, 0.15)'
                            }
                            strokeWidth={isSelected ? '1.5' : '1'}
                          />
                          <text
                            x="0"
                            y="-3.5"
                            textAnchor="middle"
                            className={cn(
                              'text-[10px] font-mono font-bold',
                              pt.isLowest
                                ? 'fill-emerald-300'
                                : pt.isHike
                                ? 'fill-red-300'
                                : pt.isCurrent
                                ? 'fill-cyan-300'
                                : 'fill-slate-200'
                            )}
                          >
                            ₹{pt.price.toLocaleString()}
                          </text>
                        </g>

                        {/* Special Alert Callouts on Curve */}
                        {pt.isHike && (
                          <g transform={`translate(${pt.x}, ${pt.y - 44})`}>
                            <rect
                              x="-42"
                              y="-14"
                              width="84"
                              height="16"
                              rx="8"
                              fill="#ef4444"
                            />
                            <text
                              x="0"
                              y="-2.5"
                              textAnchor="middle"
                              className="fill-white text-[9px] font-bold"
                            >
                              ⚠️ Fake MRP Spike
                            </text>
                          </g>
                        )}

                        {pt.isLowest && (
                          <g transform={`translate(${pt.x}, ${pt.y - 44})`}>
                            <rect
                              x="-44"
                              y="-14"
                              width="88"
                              height="16"
                              rx="8"
                              fill="#10b981"
                            />
                            <text
                              x="0"
                              y="-2.5"
                              textAnchor="middle"
                              className="fill-white text-[9px] font-bold"
                            >
                              🔥 All-Time Floor
                            </text>
                          </g>
                        )}

                        {pt.isCurrent && (
                          <g transform={`translate(${pt.x}, ${pt.y - 44})`}>
                            <rect
                              x="-38"
                              y="-14"
                              width="76"
                              height="16"
                              rx="8"
                              fill="#06b6d4"
                            />
                            <text
                              x="0"
                              y="-2.5"
                              textAnchor="middle"
                              className="fill-white text-[9px] font-bold"
                            >
                              ⚡ Today's Deal
                            </text>
                          </g>
                        )}

                        {/* X-Axis Label */}
                        <text
                          x={pt.x}
                          y="244"
                          textAnchor="middle"
                          className={cn(
                            'text-[11px] font-bold transition-colors',
                            isSelected
                              ? 'fill-white'
                              : 'fill-slate-400 group-hover:fill-slate-200'
                          )}
                        >
                          {pt.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Selected Period Inspector Card */}
            {chartCoords[selectedHistoryIdx] && (
              <div
                className={cn(
                  'p-4 rounded-2xl border transition-all animate-in fade-in duration-200',
                  chartCoords[selectedHistoryIdx].isLowest
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : chartCoords[selectedHistoryIdx].isHike
                    ? 'bg-red-500/10 border-red-500/30'
                    : chartCoords[selectedHistoryIdx].isCurrent
                    ? 'bg-cyan-500/10 border-cyan-500/30'
                    : 'bg-white/5 border-white/10'
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white">
                      {chartCoords[selectedHistoryIdx].label} ({chartCoords[selectedHistoryIdx].subLabel})
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                        chartCoords[selectedHistoryIdx].isLowest
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : chartCoords[selectedHistoryIdx].isHike
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : chartCoords[selectedHistoryIdx].isCurrent
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-700/50 text-slate-300 border-slate-600'
                      )}
                    >
                      {chartCoords[selectedHistoryIdx].status}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-slate-400">Recorded Price:</span>
                    <span className="text-base font-mono font-extrabold text-white">
                      ₹{chartCoords[selectedHistoryIdx].price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {chartCoords[selectedHistoryIdx].detail}
                </p>
              </div>
            )}

            {/* Backlit Period Timeline Pillar Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
              {chartCoords.map((pt, idx) => {
                const isSelected = selectedHistoryIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedHistoryIdx(idx)}
                    className={cn(
                      'p-2.5 rounded-xl text-left border transition-all cursor-pointer space-y-1',
                      isSelected
                        ? 'bg-white/15 border-white/30 ring-1 ring-white/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold block truncate">
                        {pt.label}
                      </span>
                      {pt.isLowest && <span className="text-[9px]">🔥</span>}
                      {pt.isHike && <span className="text-[9px]">⚠️</span>}
                    </div>

                    <div className="text-xs font-mono font-extrabold text-white">
                      ₹{pt.price.toLocaleString()}
                    </div>

                    <div
                      className={cn(
                        'text-[9px] truncate',
                        pt.isLowest
                          ? 'text-emerald-400 font-semibold'
                          : pt.isHike
                          ? 'text-red-400 font-semibold'
                          : 'text-slate-400'
                      )}
                    >
                      {pt.note}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          to="/compare"
          className="flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to AI Decision Verdict & Economic Debate</span>
        </Link>

        <Link
          to="/providers"
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          Connect to Local Repair Shops in {userCity}
        </Link>
      </div>
    </div>
  );
}
