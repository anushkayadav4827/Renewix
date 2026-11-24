import { useState, useEffect, useRef } from 'react';
import { Tag, Sparkles } from 'lucide-react';

interface DealSlide {
  id: string;
  category: string;
  name: string;
  currentPrice: string;
  originalPrice: string;
  saleTag: string;
  image: string;
  isDemo?: boolean;
}

const DEMO_SLIDES: DealSlide[] = [
  {
    id: 'laptop-1',
    category: 'Laptop (14″)',
    name: 'MacBook Air M2 (Refurbished)',
    currentPrice: '₹52,990',
    originalPrice: '₹64,999',
    saleTag: 'Buy during Festive Sale (Save up to 18%)',
    image: '/assets/deal-laptop-transparent.png',
    isDemo: true,
  },
  {
    id: 'phone-1',
    category: 'Smartphone (6.7″)',
    name: 'Flagship Refurbished 5G Phone',
    currentPrice: '₹28,499',
    originalPrice: '₹37,999',
    saleTag: 'Wait ~12 days for Mega Sale (15% drop expected)',
    image: '/assets/hero-phone.png',
    isDemo: true,
  },
  {
    id: 'audio-1',
    category: 'Wireless ANC',
    name: 'Over-Ear Studio Headphones',
    currentPrice: '₹14,990',
    originalPrice: '₹19,990',
    saleTag: 'Verified lowest price across all platforms',
    image: '/assets/hero-headphones.png',
    isDemo: true,
  },
];

export function BestDealsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto-advance every 4.5s (pauses on hover)
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DEMO_SLIDES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isHovered]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) {
      // Swiped left -> next
      setActiveIndex((prev) => (prev + 1) % DEMO_SLIDES.length);
    } else if (distance < -40) {
      // Swiped right -> prev
      setActiveIndex((prev) => (prev - 1 + DEMO_SLIDES.length) % DEMO_SLIDES.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentDeal = DEMO_SLIDES[activeIndex];

  return (
    <div
      className="relative bg-white rounded-3xl p-5 sm:p-6 border border-[#F8B08C]/40 shadow-sm space-y-4 overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Floating "Best Deal" Chip Top-Right */}
      <div className="absolute top-4 right-4 z-10 animate-chip-float">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8B08C] text-[#16301F] text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#16301F]" />
          <span>Best Deal</span>
        </span>
      </div>

      {/* Slide Visual and Content with Cross-Fade */}
      <div className="relative min-h-[220px] flex flex-col justify-between transition-opacity duration-500 ease-out">
        {/* Product Image Stage */}
        <div className="h-32 w-full flex items-center justify-center py-2 relative">
          <div className="w-40 h-28 relative flex items-center justify-center">
            {/* Soft Ambient Shadow */}
            <div className="absolute -bottom-2 w-32 h-6 bg-black/10 rounded-full blur-md" />
            <img
              src={currentDeal.image}
              alt={currentDeal.name}
              className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                // High-fidelity fallback SVG if image not found
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector('.fallback-icon')) {
                  const svg = document.createElement('div');
                  svg.className =
                    'fallback-icon w-24 h-20 rounded-2xl bg-[#DCEBD9]/60 border border-[#2F8F5B]/30 flex items-center justify-center text-3xl font-extrabold text-[#1F6B45]';
                  svg.innerText = '💻';
                  parent.appendChild(svg);
                }
              }}
            />
          </div>
        </div>

        {/* Product Pricing and Details */}
        <div className="space-y-1.5 pt-2">
          <div className="text-xs font-bold text-[#4A5F52]">
            {currentDeal.category}
          </div>
          <div className="text-base font-extrabold text-[#16301F] leading-tight">
            {currentDeal.name}
          </div>

          <div className="flex items-baseline gap-2.5 pt-0.5">
            <span
              className="text-2xl font-black text-[#103D29]"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {currentDeal.currentPrice}
            </span>
            <span
              className="text-sm font-semibold text-[#68736A] line-through"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {currentDeal.originalPrice}
            </span>
          </div>

          {/* Festive Sale Prediction Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DCEBD9] border border-[#2F8F5B]/20 text-[#1F6B45] text-xs font-bold mt-2">
            <Tag className="w-3.5 h-3.5 text-[#2F8F5B] flex-shrink-0" />
            <span className="leading-snug">{currentDeal.saleTag}</span>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        {DEMO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === activeIndex
                ? 'w-6 bg-[#103D29]'
                : 'w-2 bg-[#103D29]/20 hover:bg-[#103D29]/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default BestDealsCarousel;
