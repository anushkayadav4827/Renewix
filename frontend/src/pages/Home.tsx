import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Leaf,
  Recycle,
  Zap,
  Play,
  Wrench,
  ShoppingCart,
  Layers,
  Brain,
  Scale,
  Bell,
  Coins,
  Check,
  Tag,
  Sparkles,
} from 'lucide-react';

import RenewixNavbar from '../components/RenewixNavbar';
import RenewixFooter from '../components/RenewixFooter';
import SplitText from '../components/SplitText';
import RepairabilityRing from '../components/RepairabilityRing';
import BestDealsCarousel from '../components/BestDealsCarousel';
import ResaleSection from '../components/landing/ResaleSection';
import PriceAlertsSection from '../components/landing/PriceAlertsSection';
import ImpactExpandedSection from '../components/landing/ImpactExpandedSection';
import {
  LeafDecor,
  LeafCluster,
  CircuitTrail,
  Fireflies,
  DotGrid,
  LightShaft,
  SwooshDecor,
} from '../components/decor';
import { useLenis } from '../hooks/useLenis';
import { useReveal } from '../hooks/useReveal';
import { useCountUp } from '../hooks/useCountUp';
import { BRAND } from '../lib/constants';

export default function Home() {
  // Initialize smooth scroll & reveal system
  useLenis();
  useReveal();

  // Mouse Parallax coordinates (-1 to 1) for 3D visual responsiveness
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 2,
      y: (clientY / innerHeight - 0.5) * 2,
    });
  };

  // Stats Count-up hooks with Indian number formatting
  const savingsStat = useCountUp({
    end: 1240000,
    prefix: '₹',
    suffix: '+',
    formatIndian: true,
    duration: 2200,
  });

  const devicesStat = useCountUp({
    end: 3200,
    suffix: '+',
    duration: 2000,
  });

  const ewasteStat = useCountUp({
    end: 1.8,
    suffix: ' tons',
    decimals: 1,
    duration: 1800,
  });

  return (
    <div className="min-h-screen bg-[#fdf1e4] text-[#16301f] flex flex-col overflow-x-hidden selection:bg-[#f8b08c]/45 selection:text-[#0f3b28]">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: GLOBAL NAVBAR WITH LIQUID GLASS & ACTIVE SPY
         ───────────────────────────────────────────────────────────── */}
      <RenewixNavbar transparentAtTop={true} />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: FULL-BLEED HERO SECTION (No dead space, massive cluster)
         ───────────────────────────────────────────────────────────── */}
      <section
        onMouseMove={handleMouseMove}
        className="relative min-h-screen bg-gradient-to-b from-[#05170f] via-[#09261b] to-[#0f3b28] text-white flex flex-col justify-center overflow-hidden pt-24 sm:pt-28 pb-10 sm:pb-14"
      >
        {/* Ambient Fireflies & Drifting Particles */}
        <Fireflies count={26} />

        {/* Slow Light-Shaft Sweep from Top-Right behind devices */}
        <LightShaft className="top-0 right-0 w-[60vw] h-[85%] opacity-75 animate-pulse duration-[6000ms]" />

        {/* Radial Ambient Glows reacting to cursor */}
        <div
          className="absolute w-[65vw] h-[65vw] max-w-[950px] max-h-[950px] bg-[#2f8f5b]/20 rounded-full blur-[160px] pointer-events-none transition-transform duration-700 ease-out"
          style={{
            left: '12%',
            top: '4%',
            transform: `translate(${mousePos.x * 28}px, ${mousePos.y * 28}px)`,
          }}
        />
        <div
          className="absolute w-[55vw] h-[55vw] max-w-[850px] max-h-[850px] bg-[#f8b08c]/15 rounded-full blur-[140px] pointer-events-none transition-transform duration-700 ease-out"
          style={{
            right: '4%',
            top: '18%',
            transform: `translate(${-mousePos.x * 32}px, ${-mousePos.y * 32}px)`,
          }}
        />

        {/* Foliage: Corner Leaves & Overlapping Edge Cluster */}
        <div className="absolute -top-4 -left-4 w-[16vw] max-w-[240px] pointer-events-none opacity-45 animate-sway">
          <LeafCluster color="#2f8f5b" />
        </div>
        <div className="absolute top-2 -right-4 w-[18vw] max-w-[260px] pointer-events-none opacity-45 animate-sway-alt">
          <LeafCluster color="#2f8f5b" />
        </div>
        {/* Large Leaf Cluster overlapping into problem band at bottom-right edge */}
        <div className="absolute -bottom-8 -right-6 w-[26vw] max-w-[400px] pointer-events-none z-30 opacity-80 animate-sway">
          <LeafCluster color="#2f8f5b" />
        </div>

        {/* Hero Content Canvas */}
        <div className="renewix-container relative z-10 w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left Column: Headline, Copy, CTAs, and Trust Row */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-left z-20">
              {/* Chip: Repair • Replace • Reuse */}
              <div
                className="rv inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#dcebd9] text-chip-label font-bold backdrop-blur-md shadow-xs"
                style={{ '--base': '100ms' } as React.CSSProperties}
              >
                <Leaf className="w-3.5 h-3.5 text-[#f8b08c]" />
                <span>Repair • Replace • Reuse</span>
              </div>

              {/* H1 strictly locked to 2 lines at >=1024px with unclipped italics */}
              <h1 className="text-hero-h1 font-extrabold tracking-tight text-white max-w-full">
                <span className="block whitespace-normal lg:whitespace-nowrap">
                  <SplitText text="Before You Replace It." baseDelayMs={120} />
                </span>
                <span className="block whitespace-normal lg:whitespace-nowrap">
                  <SplitText
                    text="Give It a Second Thought."
                    baseDelayMs={260}
                    highlightText="Second Thought."
                    highlightClassName="font-editorial italic font-extrabold text-[#f8b08c]"
                  />
                </span>
              </h1>

              {/* Sub-copy with generous reading width */}
              <p
                className="rv text-hero-lead text-[#fdf1e4]/85 font-normal leading-relaxed"
                style={{ '--base': '600ms' } as React.CSSProperties}
              >
                An AI-assisted platform that helps you diagnose device issues, get a repairability score, compare repair vs. replacement, and make a smarter, more sustainable choice.
              </p>

              {/* Action Buttons with High-Level Elevation & Glow */}
              <div
                className="rv flex flex-wrap items-center gap-4 pt-1"
                style={{ '--base': '750ms' } as React.CSSProperties}
              >
                <Link
                  to="/device"
                  className="btn-peach !py-4 !px-9 text-btn font-bold shadow-[0_12px_28px_rgba(248,176,140,0.38)] hover:shadow-[0_18px_38px_rgba(248,176,140,0.52)] hover:scale-105 transition-all"
                >
                  <span>Start Diagnosis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="btn-outline !py-4 !px-8 text-btn font-bold backdrop-blur-md hover:bg-white/10 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#f8b08c]" />
                  <span>See How It Works</span>
                </a>
              </div>

              {/* Divider & Trust Row */}
              <div
                className="rv pt-5 flex flex-wrap items-center gap-4 sm:gap-7 text-chip-label text-[#dcebd9] font-medium border-t border-white/15"
                style={{ '--base': '900ms' } as React.CSSProperties}
              >
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-[#2f8f5b]" />
                  <span>Save Money</span>
                </div>
                <div className="hidden sm:block w-px h-3.5 bg-white/25" />
                <div className="flex items-center gap-2">
                  <Recycle className="w-4 h-4 text-[#2f8f5b]" />
                  <span>Reduce E-waste</span>
                </div>
                <div className="hidden sm:block w-px h-3.5 bg-white/25" />
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#f8b08c]" />
                  <span>Extend Device Life</span>
                </div>
              </div>

              {/* Live Intelligence Telemetry Bar to gracefully occupy space */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#dcebd9]/75 tracking-wider uppercase border-t border-white/10">
                <span className="flex items-center gap-1.5 text-[#a8dfc1]">
                  <span className="w-2 h-2 rounded-full bg-[#2f8f5b] animate-pulse" />
                  AI Reasoning Active
                </span>
                <span>•</span>
                <span>Component-Level Schematics</span>
                <span>•</span>
                <span>Multi-Market Price Radar</span>
              </div>

              {/* Nature-Tech Circuit Decoration */}
              <div className="pt-1 opacity-25 max-w-sm hidden lg:block pointer-events-none">
                <CircuitTrail color="#dcebd9" accentColor="#f8b08c" />
              </div>
            </div>

            {/* Right Column: Device Cluster enlarged and prominent */}
            <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center">
              <div
                className="relative w-full max-w-[800px] h-[460px] sm:h-[540px] lg:h-[620px] flex items-center justify-center select-none transition-transform duration-200 ease-out"
                style={{
                  perspective: '1200px',
                  transform: `rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 6}deg)`,
                }}
              >
                {/* Slow Rotating Circulation Light Ring */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ring-slow">
                  <img
                    src="/assets/hero-ring.png"
                    alt=""
                    className="w-[600px] h-[600px] object-contain opacity-85"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                {/* Floating Liquid-Glass Recycle Badge with Inverse Parallax */}
                <div
                  className="absolute top-4 right-6 z-30 transition-transform duration-300"
                  style={{
                    transform: `translate(${-mousePos.x * 16}px, ${-mousePos.y * 16}px)`,
                  }}
                >
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-white/15 border border-white/30 flex items-center justify-center shadow-[0_16px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl animate-badge-pulse">
                    <Recycle className="w-8 h-8 text-[#dcebd9]" />
                  </div>
                </div>

                {/* Floating Telemetry Chip 1: 83% Repairable */}
                <div
                  className="hidden md:flex absolute top-16 left-2 z-30 items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-md shadow-lg text-xs font-bold text-white transition-transform duration-300"
                  style={{
                    transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
                  }}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2f8f5b] animate-ping" />
                  <span>83% Repairability Score</span>
                </div>

                {/* Floating Telemetry Chip 2: Verified Schematics */}
                <div
                  className="hidden md:flex absolute bottom-8 left-10 z-30 items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-md shadow-lg text-xs font-bold text-[#dcebd9] transition-transform duration-300"
                  style={{
                    transform: `translate(${-mousePos.x * 10}px, ${-mousePos.y * 10}px)`,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#f8b08c]" />
                  <span>Verified Schematics</span>
                </div>

                {/* Seamlessly Blended Hero Composite (Laptop, Phone, Headphones, Moss) */}
                <div className="relative z-10 w-full flex items-center justify-center">
                  <img
                    src="/assets/hero-products-blended.png"
                    alt="Renewix Diagnostics: Laptop, Phone, Headphones"
                    className="w-full max-w-[760px] object-contain filter drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)] hover:scale-102 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: BALANCED PROBLEM / SOLUTION BANNER (No empty gulf)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#fdf1e4] border-b border-[#0f3b28]/10 py-7 sm:py-10 overflow-hidden">
        {/* Soft Peach Radial Glow behind left */}
        <div className="absolute top-1/2 left-[10vw] -translate-y-1/2 w-[280px] h-[280px] bg-[#f9c49b]/35 rounded-full blur-[90px] pointer-events-none" />

        <div className="renewix-container relative z-10">
          <div className="w-full bg-[#f9ede0] p-6 sm:p-8 lg:p-9 rounded-3xl sm:rounded-4xl border border-[#0f3b28]/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-10">
            
            {/* Left: The Problem with High-Res Cracked Phone on Peach Disc */}
            <div className="flex-1 flex items-center gap-5 sm:gap-7 text-left relative min-w-0">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 flex-shrink-0 flex items-center justify-center">
                <img
                  src="/assets/problem-phone-blended-hq.png"
                  alt="Cracked device diagnostic"
                  className="w-full h-full object-contain relative z-10 filter drop-shadow-md hover:scale-105 transition-transform"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl text-[#16301f] font-extrabold tracking-tight">
                  The Problem
                </h3>
                <p className="text-sm sm:text-base lg:text-[17px] text-[#4a5f52] leading-relaxed">
                  When a device breaks, we often replace it because we don't know the real issue, repair cost, or whether it's worth fixing.
                </p>
              </div>
            </div>

            {/* Centre: Connector Button with Dividers */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="hidden lg:block w-8 sm:w-12 h-px bg-[#0f3b28]/20" />
              <div className="w-12 h-12 rounded-full bg-white shadow-md border border-[#0f3b28]/12 flex items-center justify-center group hover:scale-115 transition-transform duration-300">
                <ArrowRight className="w-5 h-5 text-[#2f8f5b] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="hidden lg:block w-8 sm:w-12 h-px bg-[#0f3b28]/20" />
            </div>

            {/* Right: Our Solution */}
            <div className="flex-1 text-left space-y-2 pl-0 md:pl-2 min-w-0">
              <h3 className="text-2xl sm:text-3xl text-[#2f8f5b] font-extrabold tracking-tight">
                Our Solution
              </h3>
              <p className="text-sm sm:text-base lg:text-[17px] text-[#4a5f52] leading-relaxed">
                <strong className="text-[#16301f] font-extrabold">{BRAND}</strong> gives you a clear, data-backed recommendation to repair or replace — with costs, lifespan, best deals, and sustainable options, all in one place.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: HOW RENEWIX WORKS (3 Horizontal Cards joined by arrows)
         ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="relative bg-[#fdf1e4] pt-12 sm:pt-16 pb-12 sm:pb-16 overflow-hidden">
        {/* Subtle Dot Grid & Corner Leaves */}
        <DotGrid opacity={0.06} />
        <LeafDecor variant="broad" className="absolute top-4 left-6 opacity-8" color="#0f3b28" size={140} />
        <LeafDecor variant="pointed" className="absolute bottom-4 right-8 opacity-8" color="#0f3b28" size={140} />

        <div className="renewix-container relative z-10 space-y-10">
          
          {/* Section Header */}
          <div className="text-center space-y-2.5 max-w-2xl mx-auto">
            <h2 className="text-section-h2 text-[#16301f] font-extrabold tracking-tight">
              How <span className="text-[#2f8f5b]">{BRAND}</span> Works
            </h2>
            <p className="text-hero-lead text-[#4a5f52] font-medium mx-auto">
              A simple 3-step process to make the right decision for your device.
            </p>
          </div>

          {/* 3 Horizontal Cards Joined by Connectors */}
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-5 justify-between">
            
            {/* Step 1 */}
            <div className="rv flex-1 bg-white p-6 sm:p-7 rounded-3xl border border-[#0f3b28]/10 shadow-sm hover:shadow-md transition-all flex items-center gap-5 group w-full">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#dcebd9] to-[#c7e0c3] flex items-center justify-center text-[#2f8f5b] flex-shrink-0 group-hover:rotate-6 transition-transform shadow-xs">
                <Layers className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>
              <div className="space-y-1 text-left min-w-0">
                <h3 className="text-card-title text-[#16301f] font-extrabold">
                  1. Tell Us the Issue
                </h3>
                <p className="text-body-card text-[#4a5f52] leading-snug">
                  Select your device and describe the problem or pick symptoms from our AI visual inspection.
                </p>
              </div>
            </div>

            {/* Step 1 -> 2 Arrow Connector */}
            <div className="hidden lg:flex items-center justify-center flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#0f3b28]/10 flex items-center justify-center text-[#2f8f5b] group hover:scale-110 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="rv flex-1 bg-white p-6 sm:p-7 rounded-3xl border border-[#0f3b28]/10 shadow-sm hover:shadow-md transition-all flex items-center gap-5 group w-full">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#dcebd9] to-[#c7e0c3] flex items-center justify-center text-[#2f8f5b] flex-shrink-0 group-hover:rotate-6 transition-transform shadow-xs">
                <Brain className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>
              <div className="space-y-1 text-left min-w-0">
                <h3 className="text-card-title text-[#16301f] font-extrabold">
                  2. Get a Smart Analysis
                </h3>
                <p className="text-body-card text-[#4a5f52] leading-snug">
                  AI identifies the likely issue, queries parts availability, and calculates an accurate Repairability Score.
                </p>
              </div>
            </div>

            {/* Step 2 -> 3 Arrow Connector */}
            <div className="hidden lg:flex items-center justify-center flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#0f3b28]/10 flex items-center justify-center text-[#2f8f5b] group hover:scale-110 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="rv flex-1 bg-white p-6 sm:p-7 rounded-3xl border border-[#0f3b28]/10 shadow-sm hover:shadow-md transition-all flex items-center gap-5 group w-full">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#dcebd9] to-[#c7e0c3] flex items-center justify-center text-[#2f8f5b] flex-shrink-0 group-hover:rotate-6 transition-transform shadow-xs">
                <Scale className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>
              <div className="space-y-1 text-left min-w-0">
                <h3 className="text-card-title text-[#16301f] font-extrabold">
                  3. Decide with Confidence
                </h3>
                <p className="text-body-card text-[#4a5f52] leading-snug">
                  See repair vs. replace options, financial comparison, and connect to local verified repair centers.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: DUAL INTELLIGENCE PANELS (Side by Side, Equal Heights)
         ───────────────────────────────────────────────────────────── */}
      <section id="features" className="bg-[#fdf1e4] py-10 sm:py-14">
        <div className="renewix-container space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            
            {/* Panel 1: Repair Intelligence (Forest-900 Card) */}
            <div
              className="rv bg-[#0f3b28] text-[#fdf1e4] p-6 sm:p-8 rounded-3xl border border-[#14482f] shadow-editorial-lg flex flex-col justify-between space-y-5"
              style={{ '--base': '150ms' } as React.CSSProperties}
            >
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#dcebd9] shadow-xs">
                  <Wrench className="w-5 h-5 text-[#f8b08c]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Repair Intelligence
                </h3>
                <p className="text-sm sm:text-base text-[#dcebd9]/85 leading-snug">
                  If repair is a good option, get everything you need to fix it.
                </p>
              </div>

              {/* Rows and Inner Score Card */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 items-center">
                {/* Left Checklist with Clean Single-Line Bullets (matching reference) */}
                <div className="sm:col-span-6 space-y-3 text-sm sm:text-base font-semibold">
                  {[
                    'Estimated repair cost',
                    'Pros and cons of repair',
                    'Expected remaining life',
                    'Nearby trusted repair shops',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#2f8f5b] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-[#fdf1e4] font-bold">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Right Inner Cream Card with Repairability Ring */}
                <div className="sm:col-span-6 bg-[#fdf1e4] text-[#16301f] p-4 sm:p-5 rounded-3xl shadow-sm border border-white/40 space-y-2.5 text-center">
                  <RepairabilityRing score={83} size={96} strokeWidth={9} label="Repairability Score" />

                  {/* Two Stat Tiles */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div className="p-2.5 rounded-2xl bg-[#f8b08c]/25 border border-[#f8b08c]/30 text-center">
                      <span className="text-[10px] uppercase font-bold text-[#4a5f52] block">
                        Estimated Cost
                      </span>
                      <strong className="text-sm sm:text-base font-extrabold text-[#103D29]">
                        ₹2,300
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-[#f8b08c]/25 border border-[#f8b08c]/30 text-center">
                      <span className="text-[10px] uppercase font-bold text-[#4a5f52] block">
                        Expected Life
                      </span>
                      <strong className="text-sm sm:text-base font-extrabold text-[#103D29]">
                        +2–3 years
                      </strong>
                    </div>
                  </div>

                  <div className="pt-0.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#2f8f5b]/15 text-[#0f3b28] text-xs font-bold">
                      <Check className="w-3.5 h-3.5 text-[#2f8f5b]" />
                      <span>Repair is 78% cheaper than buying new</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 2: Replacement Intelligence (Cream-2 Card) */}
            <div
              className="rv bg-[#f9e6d3] text-[#16301f] p-6 sm:p-8 rounded-3xl border border-[#f8b08c]/40 shadow-editorial-lg flex flex-col justify-between space-y-5"
              style={{ '--base': '300ms' } as React.CSSProperties}
            >
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#f8b08c] flex items-center justify-center text-[#16301f] shadow-xs">
                  <ShoppingCart className="w-5 h-5 text-[#16301f]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Replacement Intelligence
                </h3>
                <p className="text-sm sm:text-base text-[#4a5f52] leading-snug">
                  If replacement is better, find the right device at the right price.
                </p>
              </div>

              {/* Rows and Inner Carousel */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 items-center">
                {/* Left Checklist with Clean Single-Line Bullets (matching reference) */}
                <div className="sm:col-span-5 space-y-3 text-sm sm:text-base font-semibold">
                  {[
                    'Best product recommendations',
                    'Price comparison across platforms',
                    'Local showroom offers & deals',
                    'Buy now or wait (sale prediction)',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#f8b08c] text-[#16301f] flex items-center justify-center flex-shrink-0 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-[#16301f] font-bold">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Right Inner Carousel */}
                <div className="sm:col-span-7">
                  <BestDealsCarousel />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: FEATURE OVERVIEW ROW (3 Interactive Tiles with Real Product Imagery)
         ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#fdf1e4] py-7 sm:py-9">
        <div className="renewix-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Tile 1: Resale & Exchange (Real Device Box Imagery matching reference) */}
            <a
              href="#resale"
              className="rv bg-[#f9e6d3] p-5 sm:p-6 rounded-3xl border border-[#0f3b28]/10 shadow-sm flex flex-col justify-between min-h-[175px] sm:min-h-[185px] hover:-translate-y-1 hover:shadow-md transition-all group overflow-hidden relative"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#dcebd9] flex items-center justify-center text-[#2f8f5b] shadow-xs">
                <Tag className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-left z-10">
                <h4 className="text-lg sm:text-xl text-[#16301f] font-extrabold flex items-center justify-between">
                  <span>Resale & Exchange</span>
                  <ArrowRight className="w-4 h-4 text-[#2f8f5b] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h4>
                <p className="text-xs sm:text-[13px] text-[#4a5f52] leading-snug line-clamp-2 max-w-[70%]">
                  Sell your old device, get an exchange value, or buy quality second-hand devices.
                </p>
              </div>
              <div className="w-full flex justify-end items-end pt-1">
                <img
                  src="/assets/real-box-clean.png"
                  alt="Resale device in box"
                  className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                />
              </div>
            </a>

            {/* Tile 2: Price Alerts (Real 3D Bell Imagery matching reference) */}
            <a
              href="#price-alerts"
              className="rv bg-[#f9e6d3] p-5 sm:p-6 rounded-3xl border border-[#0f3b28]/10 shadow-sm flex flex-col justify-between min-h-[175px] sm:min-h-[185px] hover:-translate-y-1 hover:shadow-md transition-all group overflow-hidden relative"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#f8b08c] flex items-center justify-center text-[#16301f] shadow-xs">
                <Bell className="w-5 h-5 animate-bell" />
              </div>
              <div className="space-y-1 text-left z-10">
                <h4 className="text-lg sm:text-xl text-[#16301f] font-extrabold flex items-center justify-between">
                  <span>Price Alerts</span>
                  <ArrowRight className="w-4 h-4 text-[#f08a5d] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h4>
                <p className="text-xs sm:text-[13px] text-[#4a5f52] leading-snug line-clamp-2 max-w-[70%]">
                  Get notified when the price drops or a sale is near with historical price prediction.
                </p>
              </div>
              <div className="w-full flex justify-between items-end pt-1">
                <div className="px-2.5 py-1 rounded-lg bg-white/95 border border-[#f8b08c]/40 text-[11px] font-bold text-[#16301f] flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-[#f8b08c]" />
                  <span>Target: ₹25,000 alert</span>
                </div>
                <img
                  src="/assets/real-bell-clean.png"
                  alt="Price drop alert"
                  className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                />
              </div>
            </a>

            {/* Tile 3: Environmental Impact (Real Soil Sprout Photographic Imagery matching reference) */}
            <a
              href="#environmental-impact"
              className="rv bg-[#f9e6d3] p-5 sm:p-6 rounded-3xl border border-[#0f3b28]/10 shadow-sm flex flex-col justify-between min-h-[175px] sm:min-h-[185px] hover:-translate-y-1 hover:shadow-md transition-all group overflow-hidden relative"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#dcebd9] flex items-center justify-center text-[#2f8f5b] shadow-xs">
                <Leaf className="w-5 h-5 animate-sprout" />
              </div>
              <div className="space-y-1 text-left z-10">
                <h4 className="text-lg sm:text-xl text-[#16301f] font-extrabold flex items-center justify-between">
                  <span>Environmental Impact</span>
                  <ArrowRight className="w-4 h-4 text-[#2f8f5b] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h4>
                <p className="text-xs sm:text-[13px] text-[#4a5f52] leading-snug line-clamp-2 max-w-[70%]">
                  Track how your choice helps reduce e-waste and carbon footprint with verified audit metrics.
                </p>
              </div>
              <div className="w-full flex justify-end items-end pt-1">
                <img
                  src="/assets/real-sprout-clean.png"
                  alt="Sprouting plant impact"
                  className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                />
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7: THREE EXPANDED FULL-LENGTH SECTIONS
         ───────────────────────────────────────────────────────────── */}
      <ResaleSection />
      <PriceAlertsSection />
      <ImpactExpandedSection />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 8: STATS BAND + CTA INSET (Dark Forest 100vw Band)
         ───────────────────────────────────────────────────────────── */}
      <section id="impact" className="relative bg-gradient-to-r from-[#05170f] via-[#09261b] to-[#0f3b28] text-white pt-[clamp(48px,5vw,90px)] pb-[clamp(36px,4vw,70px)] overflow-hidden">
        {/* Soft Radial Ambient Lights & Fireflies */}
        <Fireflies count={20} />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[300px] bg-[#2f8f5b]/20 blur-[130px] pointer-events-none rounded-full" />

        <div className="renewix-container relative z-10 space-y-14">
          
          {/* Stats Row: 4 cols headline | 8 cols 3 stats with generous spacing */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Headline with Animated Swoosh Underline */}
            <div className="lg:col-span-4 space-y-3 text-left">
              <h2 className="text-section-h2 text-white font-extrabold tracking-tight leading-snug">
                A Smarter Choice for You and the Planet.
              </h2>
              <SwooshDecor />
            </div>

            {/* Right: Three Stats with Count-Up (Spacious, no collision, clear dividers) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10 sm:divide-x sm:divide-white/20">
              
              {/* Stat 1 */}
              <div ref={savingsStat.elementRef as any} className="sm:pl-7 lg:pl-9 space-y-1.5 text-left min-w-0">
                <div className="flex items-center gap-2 text-[#f8b08c] mb-1">
                  <Coins className="w-5 h-5 flex-shrink-0" />
                </div>
                <div className="text-stat-num text-white font-sans">
                  {savingsStat.displayValue}
                </div>
                <p className="text-stat-label text-[#dcebd9]/80 font-medium">
                  Estimated savings for users
                </p>
              </div>

              {/* Stat 2 */}
              <div ref={devicesStat.elementRef as any} className="sm:pl-7 lg:pl-9 space-y-1.5 text-left min-w-0">
                <div className="flex items-center gap-2 text-[#dcebd9] mb-1">
                  <Recycle className="w-5 h-5 flex-shrink-0" />
                </div>
                <div className="text-stat-num text-white font-sans">
                  {devicesStat.displayValue}
                </div>
                <p className="text-stat-label text-[#dcebd9]/80 font-medium">
                  Devices retained from e-waste
                </p>
              </div>

              {/* Stat 3 */}
              <div ref={ewasteStat.elementRef as any} className="sm:pl-7 lg:pl-9 space-y-1.5 text-left min-w-0">
                <div className="flex items-center gap-2 text-[#f8b08c] mb-1">
                  <Leaf className="w-5 h-5 flex-shrink-0" />
                </div>
                <div className="text-stat-num text-white font-sans">
                  {ewasteStat.displayValue}
                </div>
                <p className="text-stat-label text-[#dcebd9]/80 font-medium">
                  E-waste potentially avoided
                </p>
              </div>

            </div>

          </div>

          {/* Right-aligned Footnote */}
          <div className="text-right">
            <span className="text-chip-label text-white/50 italic">
              *Illustrative figures based on aggregate user diagnostics
            </span>
          </div>

          {/* CTA Card sits fully inside the dark band's bottom (NO cream band under it) */}
          <div id="about" className="pt-4">
            <div
              className="rv rv-scale bg-white rounded-3xl sm:rounded-4xl p-7 sm:p-11 border border-[#0f3b28]/15 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
              style={{ '--base': '150ms' } as React.CSSProperties}
            >
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-card-title sm:text-panel-title font-extrabold text-[#16301f] tracking-tight">
                  Ready to Check Your Device?
                </h3>
              </div>

              <div className="hidden md:block w-px h-12 bg-[#0f3b28]/15" />

              <div className="max-w-md text-body-card text-[#4a5f52] text-center md:text-left font-medium leading-relaxed">
                Get an instant, reliable repair-or-replace recommendation and give your device a longer life.
              </div>

              <Link
                to="/device"
                className="btn-forest flex-shrink-0 !py-4 !px-8 text-btn font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <span>Start Diagnosis</span>
                <ArrowRight className="w-4 h-4 text-[#f8b08c]" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 9: FOOTER (Starts right after hairline)
         ───────────────────────────────────────────────────────────── */}
      <RenewixFooter />
    </div>
  );
}
