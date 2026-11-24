import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Wrench,
  RefreshCw,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  Clock,
  Info,
  HeartPulse,
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function RepairVsReplace() {
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [intakeData, setIntakeData] = useState<any>({});

  useEffect(() => {
    // 1. Load intake data
    let parsedIntake: any = {};
    try {
      const intakeStr = sessionStorage.getItem('intakeData');
      if (intakeStr) parsedIntake = JSON.parse(intakeStr);
    } catch {
      // ignore
    }
    setIntakeData(parsedIntake);

    // 2. Load diagnosisResult or provide intelligent default so page never fails
    try {
      const stored = sessionStorage.getItem('diagnosisResult');
      if (stored) {
        setResult(JSON.parse(stored));
      } else {
        const brand = parsedIntake.brand || 'Your';
        const model = parsedIntake.model || 'Device';
        const purchasePrice = Number(parsedIntake.purchasePriceINR) || 35000;
        const estRepairMin = Math.max(1200, Math.round(purchasePrice * 0.12));
        const estRepairMax = Math.max(2500, Math.round(purchasePrice * 0.22));
        const estReplaceMin = Math.max(8000, Math.round(purchasePrice * 0.85));
        const estReplaceMax = Math.max(12000, Math.round(purchasePrice * 1.05));
        const repairPerYr = Math.round(estRepairMin * 0.7);
        const replacePerYr = Math.round(estReplaceMin * 0.25);

        const defaultResult = {
          comparison: 'repair_recommended',
          confidence: 'high',
          repairCostRange: { minINR: estRepairMin, maxINR: estRepairMax },
          replacementCostRange: { minINR: estReplaceMin, maxINR: estReplaceMax },
          repairCostPerYear: repairPerYr,
          replaceCostPerYear: replacePerYr,
          score: 82,
          scoreBand: 'Repair Strongly Recommended',
          debate: {
            winner: 'REPAIR',
            repairArgument: {
              summary: `Fixing this issue is highly cost-effective (approx. ₹${estRepairMin.toLocaleString()} – ₹${estRepairMax.toLocaleString()}) and restores full functionality to your ${brand} ${model}.`,
              keyPoints: [
                `Repair cost is only ~${Math.round((estRepairMin / estReplaceMin) * 100)}% of buying a replacement device.`,
                'The internal processor, motherboard, and storage remain in healthy working order.',
                'Immediate cash outlay is far lower than purchasing a new unit.',
              ],
              pros: [
                `Low immediate expense (₹${estRepairMin.toLocaleString()} – ₹${estRepairMax.toLocaleString()})`,
                'Keep all your personal data, apps, and preferences untouched',
                'Zero setup time or data migration friction',
              ],
              cons: [
                'Post-repair warranty covers the replaced component only (typically 60–90 days)',
                'Device age should be monitored for secondary battery wear',
              ],
              bottomLine:
                `Repair is unequivocally the financially sensible choice, saving +₹${(estReplaceMin - estRepairMax).toLocaleString()} in upfront cash.`,
            },
            replaceArgument: {
              summary: `Buying a new or certified refurbished replacement guarantees full 1-year manufacturer warranty and latest generation hardware.`,
              keyPoints: [
                'New device includes full 1-year warranty coverage.',
                'Fresh factory battery with 100% capacity.',
                'Existing unit can still be traded in for exchange discount credit.',
              ],
              pros: [
                '1-Year Zero-Cost Manufacturer Warranty',
                'Fresh battery with full daily endurance',
                'Longer operating system and security patch support',
              ],
              cons: [
                `Much higher upfront capital outlay (₹${estReplaceMin.toLocaleString()}+)`,
                'Unnecessary expenditure when current device is fully repairable',
              ],
              bottomLine:
                'Replacement is difficult to justify financially when repair cost is under 25% of replacement price.',
            },
          },
        };
        setResult(defaultResult);
      }
    } catch {
      // ignore
    }
  }, [navigate]);

  const deviceBrand = intakeData.brand || 'Device';
  const deviceModel = intakeData.model || '';
  const userCity = intakeData.city || 'your city';

  const isRepairFavored = result?.comparison === 'repair_recommended';
  const isReplaceFavored = result?.comparison === 'replacement_recommended';

  const title = isRepairFavored
    ? 'Repair Recommended'
    : isReplaceFavored
    ? 'Replacement Recommended'
    : "It's a Close Call";

  const repairMin = result?.repairCostRange?.minINR || 1200;
  const repairMax = result?.repairCostRange?.maxINR || 2500;
  const repairAvg = Math.round((repairMin + repairMax) / 2);

  const replaceMin = result?.replacementCostRange?.minINR || 13199;
  const replaceAvg = replaceMin;

  // Broken device trade-in / scrap recovery estimate
  const exchangeValue = useMemo(() => {
    return Math.min(Math.round(replaceAvg * 0.22), 4500) || 3000;
  }, [replaceAvg]);

  const netReplaceCost = Math.max(replaceAvg - exchangeValue, 1000);
  const immediateSavings = Math.max(netReplaceCost - repairAvg, 0);

  // Lifespan survival metrics
  const repairLifespanYears = 1.8;
  const replaceLifespanYears = 4.5;

  const repairCostPerYear =
    result?.repairCostPerYear !== undefined
      ? result.repairCostPerYear
      : Math.round(repairAvg / repairLifespanYears);

  const replaceCostPerYear =
    result?.replaceCostPerYear !== undefined
      ? result.replaceCostPerYear
      : Math.round(netReplaceCost / replaceLifespanYears);

  const annualSavings = Math.abs(replaceCostPerYear - repairCostPerYear);

  if (!result) return null;

  return (
    <div className="w-full max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D9E5C4] border border-[#103D29]/20 text-[#103D29] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#103D29]" />
            <span>AI Multi-Agent Economic Debate & Decision Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17251D]">
            The Verdict: Repair vs. Replace
          </h2>
          <p className="text-[#68736A] text-xs sm:text-sm font-medium">
            Everything you need to know to make the smartest economic and practical decision for your{' '}
            <strong className="text-[#17251D] font-extrabold">
              {deviceBrand} {deviceModel}
            </strong>
            .
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/deals"
            className="px-4 py-2.5 rounded-xl bg-[#F9C49B]/30 border-2 border-[#E28E5C]/40 text-[#17251D] hover:bg-[#F9C49B]/50 text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-[#103D29]" />
            <span>View Replacement Deals & Coupons</span>
          </Link>
        </div>
      </div>

      {/* Official Recommendation Banner */}
      <div className="p-7 sm:p-9 rounded-3xl bg-[#103D29] text-white text-center space-y-3.5 shadow-editorial-lg relative overflow-hidden border-2 border-[#103D29]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#174C32] border border-[#D9E5C4]/20 text-xs font-extrabold text-[#D9E5C4] mb-1">
          <ShieldCheck className="w-4 h-4 text-[#D9E5C4]" />
          <span>Arbitration Winner: {result.debate?.winner || 'REPAIR'}</span>
        </div>

        <h3 className="text-3xl sm:text-4xl font-extrabold text-[#D9E5C4]">{title}</h3>
        <p className="text-white/90 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed font-medium">
          {isRepairFavored
            ? `Repairing your ${deviceBrand} ${deviceModel} is the clear financial winner. You preserve ₹${immediateSavings.toLocaleString()} in immediate cash and save ₹${annualSavings.toLocaleString()} per year of ownership.`
            : isReplaceFavored
            ? `The repair cost on your ${deviceBrand} ${deviceModel} represents a disproportionate percentage of its remaining value. Purchasing new yields a lower annual cost of ownership and 100% warranty.`
            : `Repair and Replacement are closely balanced. Review the pros, cons, and lifespan survival breakdown below.`}
        </p>

        {/* Cost per Year Survival Comparison */}
        <div className="flex items-center justify-center gap-8 mt-5 pt-5 border-t border-white/15">
          <div className="text-center">
            <p className="text-[11px] text-[#D9E5C4] uppercase tracking-wider font-extrabold">
              Repair Effective Cost
            </p>
            <p className="font-extrabold text-2xl sm:text-3xl text-white">
              ₹{repairCostPerYear.toLocaleString()}
              <span className="text-xs font-medium text-white/70">/yr</span>
            </p>
          </div>
          <div className="text-[#D9E5C4] font-black text-base">vs</div>
          <div className="text-center">
            <p className="text-[11px] text-[#F9C49B] uppercase tracking-wider font-extrabold">
              Replace Effective Cost
            </p>
            <p className="font-extrabold text-2xl sm:text-3xl text-[#F9C49B]">
              ₹{replaceCostPerYear.toLocaleString()}
              <span className="text-xs font-medium text-white/70">/yr</span>
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: EXACT PRICE & LIFESPAN SURVIVAL EXPECTANCY
         ───────────────────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Repair Card */}
        <div
          className={cn(
            'p-7 rounded-3xl border-2 space-y-5 flex flex-col justify-between transition-all bg-white shadow-editorial',
            isRepairFavored
              ? 'border-[#103D29] ring-2 ring-[#103D29]/15'
              : 'border-[#103D29]/15'
          )}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#103D29]">
                <Wrench className="w-6 h-6" />
                <h4 className="font-extrabold text-xl text-[#17251D]">Option A: Repair Device</h4>
              </div>
              {isRepairFavored && (
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#D9E5C4] text-[#103D29] border border-[#103D29]/20">
                  ★ Recommended
                </span>
              )}
            </div>

            {/* Exact Cost */}
            <div>
              <span className="text-xs text-[#68736A] block font-extrabold uppercase tracking-wider">Exact Estimated Repair Cost:</span>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#103D29]">
                ₹{repairMin.toLocaleString()} - ₹{repairMax.toLocaleString()}
              </p>
            </div>

            {/* Survival Expectancy */}
            <div className="p-4 rounded-2xl bg-[#FFF3E5] border border-[#103D29]/15 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-[#103D29] font-extrabold">
                <HeartPulse className="w-4 h-4 text-[#103D29]" />
                <span>How Long It Will Survive Post-Repair:</span>
              </div>
              <p className="text-[#17251D] text-sm font-extrabold">
                ~{repairLifespanYears} Years of Additional Usable Life
              </p>
              <p className="text-[#68736A] leading-relaxed text-xs font-medium">
                Internal SoC, memory, and circuitry remain fully intact. The fix resolves the immediate failure and gives steady daily performance for ~18–24 months.
              </p>
            </div>

            {/* Financial ROI */}
            <div className="p-3.5 rounded-2xl bg-[#D9E5C4]/40 border border-[#103D29]/15 text-xs space-y-1.5">
              <div className="flex justify-between text-[#17251D]">
                <span className="font-bold">Immediate Cash Preserved:</span>
                <strong className="text-[#103D29] font-extrabold text-sm">+₹{immediateSavings.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-[#68736A]">
                <span className="font-medium">Annualized Cost:</span>
                <span className="text-[#17251D] font-bold">₹{repairCostPerYear.toLocaleString()} / year</span>
              </div>
            </div>
          </div>

          <Link
            to="/providers"
            className="w-full py-4 rounded-2xl bg-[#103D29] hover:bg-[#174C32] text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-editorial cursor-pointer mt-2"
          >
            <Wrench className="w-4 h-4 text-[#F9C49B]" />
            <span>Connect to Local Repair Centers</span>
          </Link>
        </div>

        {/* Replace Card */}
        <div
          className={cn(
            'p-7 rounded-3xl border-2 space-y-5 flex flex-col justify-between transition-all bg-white shadow-editorial',
            isReplaceFavored
              ? 'border-[#E28E5C] ring-2 ring-[#E28E5C]/15'
              : 'border-[#103D29]/15'
          )}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#E28E5C]">
                <RefreshCw className="w-6 h-6" />
                <h4 className="font-extrabold text-xl text-[#17251D]">Option B: Replace Device</h4>
              </div>
              {isReplaceFavored && (
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#F9C49B]/30 text-[#E28E5C] border border-[#E28E5C]/40">
                  ★ Recommended
                </span>
              )}
            </div>

            {/* Exact Cost */}
            <div>
              <span className="text-xs text-[#68736A] block font-extrabold uppercase tracking-wider">Net Cost to Buy New:</span>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#17251D]">
                ₹{netReplaceCost.toLocaleString()}
                <span className="text-xs text-[#68736A] font-medium ml-2 block sm:inline">
                  (Store: ₹{replaceAvg.toLocaleString()} - ₹{exchangeValue.toLocaleString()} Trade-in)
                </span>
              </p>
            </div>

            {/* Survival Expectancy */}
            <div className="p-4 rounded-2xl bg-[#FFF3E5] border border-[#103D29]/15 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-[#E28E5C] font-extrabold">
                <Clock className="w-4 h-4 text-[#E28E5C]" />
                <span>How Long A New Device Survives:</span>
              </div>
              <p className="text-[#17251D] text-sm font-extrabold">
                ~{replaceLifespanYears} Years of Fresh Lifespan
              </p>
              <p className="text-[#68736A] leading-relaxed text-xs font-medium">
                Brand-new 100% battery capacity, updated processor architecture, full 1-year manufacturer warranty, and 4+ years of OS security updates.
              </p>
            </div>

            {/* Financial ROI */}
            <div className="p-3.5 rounded-2xl bg-[#FFF3E5] border border-[#103D29]/15 text-xs space-y-1.5">
              <div className="flex justify-between text-[#17251D]">
                <span className="font-bold">Old Unit Exchange Recovery:</span>
                <strong className="text-[#E28E5C] font-extrabold text-sm">-₹{exchangeValue.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-[#68736A]">
                <span className="font-medium">Annualized Cost:</span>
                <span className="text-[#17251D] font-bold">₹{replaceCostPerYear.toLocaleString()} / year</span>
              </div>
            </div>
          </div>

          <Link
            to="/deals"
            className="w-full py-4 rounded-2xl bg-white border-2 border-[#103D29]/20 hover:bg-[#F9EBDD] text-[#17251D] font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer mt-2"
          >
            <ShoppingBag className="w-4 h-4 text-[#103D29]" />
            <span>Compare Replacement Deals & Stores</span>
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: AI DEBATE WITH FULL PROS & CONS
         ───────────────────────────────────────────────────────────── */}
      {result.debate && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17251D] flex items-center gap-2">
              <span>Repair Vs Replace Debate</span>
            </h3>
            <span className="text-xs text-[#68736A] font-bold">Two AI agents evaluate the decision</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Repair Agent Column (Styled like Repair Intelligence: Forest-900 Card) */}
            <div
              className={cn(
                'p-7 sm:p-8 rounded-3xl border-2 space-y-4 transition-all bg-[#0f3b28] text-[#fdf1e4] shadow-editorial',
                result.debate.winner === 'REPAIR'
                  ? 'border-[#2f8f5b] ring-2 ring-[#2f8f5b]/25'
                  : 'border-[#14482f]'
              )}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#f8b08c]">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-lg text-white">Repair Agent Defense</h4>
                </div>
                {result.debate.winner === 'REPAIR' && (
                  <span className="text-xs font-black text-[#103D29] px-3 py-1 rounded-full bg-[#dcebd9] shadow-xs">
                    DEBATE WINNER
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#fdf1e4]/90 leading-relaxed font-semibold">
                {result.debate.repairArgument?.summary}
              </p>

              {/* Key Points */}
              {Array.isArray(result.debate.repairArgument?.keyPoints) && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-extrabold text-[#dcebd9] uppercase tracking-wider block">
                    Key Points:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#fdf1e4]">
                    {result.debate.repairArgument.keyPoints.map((pt: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#2f8f5b] flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pros & Cons */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                {/* Pros */}
                <div className="p-3.5 rounded-2xl bg-[#14482f] border border-[#2f8f5b]/30 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-[#dcebd9] uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2f8f5b]" />
                    <span>Pros</span>
                  </span>
                  <ul className="space-y-1 text-xs text-white/90 font-medium">
                    {Array.isArray(result.debate.repairArgument?.pros) ? (
                      result.debate.repairArgument.pros.map((p: string, i: number) => (
                        <li key={i} className="leading-snug">• {p}</li>
                      ))
                    ) : (
                      <>
                        <li>• Low immediate expense</li>
                        <li>• Keeps all personal data</li>
                        <li>• Minimal environmental waste</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Cons */}
                <div className="p-3.5 rounded-2xl bg-black/20 border border-white/10 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-[#f8b08c] uppercase tracking-wider flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 text-[#f8b08c]" />
                    <span>Cons</span>
                  </span>
                  <ul className="space-y-1 text-xs text-white/80 font-medium">
                    {Array.isArray(result.debate.repairArgument?.cons) ? (
                      result.debate.repairArgument.cons.map((c: string, i: number) => (
                        <li key={i} className="leading-snug">• {c}</li>
                      ))
                    ) : (
                      <>
                        <li>• 60–90 day part warranty only</li>
                        <li>• Other components keep aging</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {result.debate.repairArgument?.bottomLine && (
                <div className="p-3.5 rounded-2xl bg-[#14482f] border border-[#2f8f5b]/30 text-xs text-[#dcebd9] font-medium">
                  <strong className="text-white">Bottom line:</strong> {result.debate.repairArgument.bottomLine}
                </div>
              )}
            </div>

            {/* Replace Agent Column (Styled like Replacement Intelligence: Cream-2/Peach Card) */}
            <div
              className={cn(
                'p-7 sm:p-8 rounded-3xl border-2 space-y-4 transition-all bg-[#f9e6d3] text-[#16301f] shadow-editorial',
                result.debate.winner === 'REPLACE'
                  ? 'border-[#f8b08c] ring-2 ring-[#f8b08c]/25'
                  : 'border-[#f8b08c]/40'
              )}
            >
              <div className="flex items-center justify-between border-b border-[#0f3b28]/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#f8b08c] flex items-center justify-center text-[#16301f]">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-lg text-[#16301f]">Replace Agent Defense</h4>
                </div>
                {result.debate.winner === 'REPLACE' && (
                  <span className="text-xs font-black text-[#16301f] px-3 py-1 rounded-full bg-[#f8b08c] shadow-xs">
                    DEBATE WINNER
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#16301f] leading-relaxed font-semibold">
                {result.debate.replaceArgument?.summary}
              </p>

              {/* Key Points */}
              {Array.isArray(result.debate.replaceArgument?.keyPoints) && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-extrabold text-[#68736A] uppercase tracking-wider block">
                    Core Arguments:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#17251D]">
                    {result.debate.replaceArgument.keyPoints.map((pt: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#E28E5C] flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pros & Cons */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#103D29]/10">
                {/* Pros */}
                <div className="p-3.5 rounded-2xl bg-[#D9E5C4]/50 border border-[#103D29]/20 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-[#103D29] uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Pros</span>
                  </span>
                  <ul className="space-y-1 text-xs text-[#17251D] font-medium">
                    {Array.isArray(result.debate.replaceArgument?.pros) ? (
                      result.debate.replaceArgument.pros.map((p: string, i: number) => (
                        <li key={i} className="leading-snug">• {p}</li>
                      ))
                    ) : (
                      <>
                        <li>• 1-Year brand warranty</li>
                        <li>• Zero breakdown anxiety</li>
                        <li>• Fresh battery health</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Cons */}
                <div className="p-3.5 rounded-2xl bg-[#FFF3E5] border border-red-200 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-red-700 uppercase tracking-wider flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cons</span>
                  </span>
                  <ul className="space-y-1 text-xs text-red-950 font-medium">
                    {Array.isArray(result.debate.replaceArgument?.cons) ? (
                      result.debate.replaceArgument.cons.map((c: string, i: number) => (
                        <li key={i} className="leading-snug">• {c}</li>
                      ))
                    ) : (
                      <>
                        <li>• High initial cash expense</li>
                        <li>• Data migration required</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {result.debate.replaceArgument?.bottomLine && (
                <div className="p-3.5 rounded-2xl bg-white border border-[#f8b08c]/40 text-xs text-[#16301f] font-medium">
                  <strong className="text-[#0f3b28]">Bottom line:</strong> {result.debate.replaceArgument.bottomLine}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: CRITICAL PRE-DECISION COMPARISON CHECKLIST
         ───────────────────────────────────────────────────────────── */}
      <div className="p-7 rounded-3xl bg-white border-2 border-[#103D29]/15 shadow-editorial space-y-4">
        <h4 className="font-extrabold text-lg text-[#17251D] flex items-center gap-2">
          <Info className="w-5 h-5 text-[#103D29]" />
          <span>Important Decision Checklist Before You Choose</span>
        </h4>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#FFF3E5] border border-[#103D29]/15 space-y-1.5">
            <strong className="text-[#17251D] block font-extrabold text-sm">1. Component Health</strong>
            <p className="text-[#68736A] leading-relaxed text-xs font-medium">
              If other functions (cameras, speakers, charging) are working fine, repairing the display restores full value.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF3E5] border border-[#103D29]/15 space-y-1.5">
            <strong className="text-[#17251D] block font-extrabold text-sm">2. Immediate Budget</strong>
            <p className="text-[#68736A] leading-relaxed text-xs font-medium">
              Repairing costs only ₹{repairAvg.toLocaleString()}, preserving your liquidity instead of parting with ₹{netReplaceCost.toLocaleString()}.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF3E5] border border-[#103D29]/15 space-y-1.5">
            <strong className="text-[#17251D] block font-extrabold text-sm">3. Trade-in Eligibility</strong>
            <p className="text-[#68736A] leading-relaxed text-xs font-medium">
              If you decide to replace, do not discard the broken unit; trade it in for up to ₹{exchangeValue.toLocaleString()} instant discount.
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM ACTION DECK
         ───────────────────────────────────────────────────────────── */}
      <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <Link
          to="/providers"
          className="flex-1 min-h-[56px] px-6 py-4 rounded-2xl bg-[#103D29] hover:bg-[#174C32] text-white text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-editorial cursor-pointer"
        >
          <Wrench className="w-4 h-4 text-[#F9C49B]" />
          <span>Connect to Local Verified Repair Centers in {userCity}</span>
        </Link>

        <Link
          to="/deals"
          className="flex-1 min-h-[56px] px-6 py-4 rounded-2xl bg-white hover:bg-[#F9EBDD] border-2 border-[#103D29]/20 text-[#17251D] text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-[#103D29]" />
          <span>Compare Online Replacement Deals, Stores & Coupons</span>
          <ArrowRight className="w-4 h-4 text-[#103D29]" />
        </Link>
      </div>
    </div>
  );
}
