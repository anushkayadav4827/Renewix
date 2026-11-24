import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import RenewixLogo from './RenewixLogo';

interface RenewixNavbarProps {
  transparentAtTop?: boolean;
}

export const RenewixNavbar: React.FC<RenewixNavbarProps> = ({ transparentAtTop = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const isLandingPage = location.pathname === '/';
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const checkUser = async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } catch {
        setUser(null);
      }
    };
    checkUser();
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      // Past hero
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Active section detection
      const sections = ['how-it-works', 'features', 'resale', 'price-alerts', 'environmental-impact', 'impact', 'about'];
      const scrollPos = window.scrollY + 250;
      let current = '';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            current = id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { label: 'How it Works', href: isLandingPage ? '#how-it-works' : '/#how-it-works', id: 'how-it-works' },
    { label: 'Features', href: isLandingPage ? '#features' : '/#features', id: 'features' },
    { label: 'Marketplace', href: isLandingPage ? '#resale' : '/#resale', id: 'resale' },
    { label: 'Impact', href: isLandingPage ? '#environmental-impact' : '/#environmental-impact', id: 'environmental-impact' },
    { label: 'About', href: isLandingPage ? '#about' : '/#about', id: 'about' },
  ];

  const isOverHero = isLandingPage && !isScrolled && transparentAtTop;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isOverHero
            ? 'bg-[#0a2a1d]/60 backdrop-blur-xl border-b border-white/10 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)]'
            : 'bg-[#0a2a1d]/85 backdrop-blur-2xl border-b border-white/15 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
        }`}
      >
        <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between">
            {/* Logo on the left */}
            <Link to="/" className="flex items-center gap-2">
              <RenewixLogo theme="light" size="md" />
            </Link>

            {/* Center Navigation Links (Desktop) */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => {
                const isAnchor = link.href.includes('#');
                const isActive = activeSection === link.id || (link.id === 'environmental-impact' && activeSection === 'impact');

                const linkClasses = `text-sm font-semibold transition-all px-4 py-2 rounded-full relative select-none ${
                  isActive
                    ? 'bg-white/15 text-[#f8b08c] shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`;

                return isAnchor ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className={linkClasses}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={linkClasses}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Action Buttons */}
            <div className="hidden sm:flex items-center space-x-3.5">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all bg-white/15 text-white hover:bg-white/25 border border-white/20 shadow-xs"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="p-2 rounded-full transition-colors cursor-pointer text-white/70 hover:text-white hover:bg-white/10"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold border border-white/25 text-white hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Login
                  </Link>
                  <Link to="/device" className="btn-peach !py-2 !px-5 !text-xs shadow-md">
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Toggle (≤860px) */}
            <div className="lg:hidden flex items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-xl transition-colors ${
                  isOverHero ? 'text-white hover:bg-white/10' : 'text-[#16301f] hover:bg-black/5'
                }`}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-Screen Mobile Drawer (Velia Spec Port - Forest Green with Cream Links) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a2a1d] text-[#fdf1e4] flex flex-col justify-between p-8 pt-28 lg:hidden animate-in fade-in duration-300">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#f8b08c] font-bold">
              Navigation
            </span>
            <div className="flex flex-col space-y-4 text-2xl font-black">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#f8b08c] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-8 border-t border-white/10">
            <Link
              to="/device"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-peach w-full !py-3.5 justify-center text-sm"
            >
              <span>Start Free Diagnosis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-full border border-white/20 text-center text-xs font-bold text-white hover:bg-white/10 transition-colors block"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default RenewixNavbar;
