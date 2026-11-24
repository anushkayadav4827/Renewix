import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import RenewixLogo from './RenewixLogo';
import { BRAND } from '../lib/constants';

export const RenewixFooter: React.FC = () => {
  return (
    <footer className="bg-[#0a2a1d] text-white/80 border-t border-white/10 pt-16 pb-12 relative overflow-hidden select-none">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#14482f]/30 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <RenewixLogo theme="light" size="lg" />
            </Link>
            <p className="text-white/70 text-sm max-w-sm leading-relaxed">
              Before You Replace It. Give It a Second Thought. An AI-assisted platform empowering consumers to diagnose electronics, extend device lifespan, reduce e-waste, and make sustainable financial choices.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14482f] text-[#dcebd9] text-xs font-semibold border border-[#dcebd9]/20">
                <ShieldCheck className="w-3.5 h-3.5 text-[#f8b08c]" />
                <span>Repair · Replace · Reuse</span>
              </span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#f8b08c]">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/device" className="hover:text-white transition-colors relative py-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px hover:after:w-full after:bg-[#f8b08c] after:transition-all">Start Diagnosis</Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors relative py-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px hover:after:w-full after:bg-[#f8b08c] after:transition-all">How It Works</a>
              </li>
              <li>
                <Link to="/deals" className="hover:text-white transition-colors relative py-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px hover:after:w-full after:bg-[#f8b08c] after:transition-all">Replacement Deals</Link>
              </li>
              <li>
                <Link to="/providers" className="hover:text-white transition-colors relative py-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px hover:after:w-full after:bg-[#f8b08c] after:transition-all">Repair Network</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-white transition-colors relative py-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px hover:after:w-full after:bg-[#f8b08c] after:transition-all">Diagnosis History</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Marketplace */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#f8b08c]">Marketplace</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/deals" className="hover:text-white transition-colors relative py-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px hover:after:w-full after:bg-[#f8b08c] after:transition-all">Store Price Comparison</Link>
              </li>
              <li>
                <Link to="/providers" className="hover:text-white transition-colors relative py-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px hover:after:w-full after:bg-[#f8b08c] after:transition-all">Verified Local Repair Shops</Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-white transition-colors relative py-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px hover:after:w-full after:bg-[#f8b08c] after:transition-all">Upcoming Sale Radar</Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-white transition-colors relative py-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px hover:after:w-full after:bg-[#f8b08c] after:transition-all">Verified Discount Coupons</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors relative py-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px hover:after:w-full after:bg-[#f8b08c] after:transition-all">Price Drop Alerts</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: About & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#f8b08c]">About & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-white transition-colors relative py-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px hover:after:w-full after:bg-[#f8b08c] after:transition-all">About Renewix</a>
              </li>
              <li>
                <a href="#impact" className="hover:text-white transition-colors relative py-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px hover:after:w-full after:bg-[#f8b08c] after:transition-all">Environmental Impact</a>
              </li>
              <li>
                <a href="mailto:support@renewix.tech" className="hover:text-white transition-colors flex items-center gap-1 relative py-0.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px hover:after:w-full after:bg-[#f8b08c] after:transition-all">
                  <span>Contact Support</span>
                  <ArrowUpRight className="w-3 h-3 text-white/50" />
                </a>
              </li>
              <li>
                <span className="text-white/60 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              </li>
              <li>
                <span className="text-white/60 hover:text-white cursor-pointer transition-colors">Terms & Conditions</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>
            © {new Date().getFullYear()} {BRAND}. All rights reserved.
          </div>
          <div className="flex items-center space-x-3">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors" aria-label="Twitter">
              𝕏
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors" aria-label="GitHub">
              ⌥
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors" aria-label="LinkedIn">
              in
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default RenewixFooter;
