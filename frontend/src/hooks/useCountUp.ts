import { useState, useEffect, useRef } from 'react';

interface CountUpOptions {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  formatIndian?: boolean;
}

/**
 * Format Indian currency / numbers (e.g. 12,40,000)
 */
function formatIndianNumber(num: number): string {
  const parts = num.toString().split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return parts.length > 1 ? res + '.' + parts[1] : res;
}

export function useCountUp({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  formatIndian = false,
}: CountUpOptions) {
  const [displayValue, setDisplayValue] = useState(`${prefix}0${suffix}`);
  const elementRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Reduced motion: show full value immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const formatted = formatIndian
        ? formatIndianNumber(end)
        : end.toLocaleString('en-IN');
      setDisplayValue(`${prefix}${formatted}${suffix}`);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();

          const startTime = performance.now();

          const updateCounter = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // easeOutQuart: 1 - Math.pow(1 - progress, 4)
            const ease = 1 - Math.pow(1 - progress, 4);
            const currentVal = progress === 1 ? end : ease * end;

            let formatted: string;
            if (decimals > 0) {
              formatted = currentVal.toFixed(decimals);
            } else {
              const rounded = Math.round(currentVal);
              formatted = formatIndian
                ? formatIndianNumber(rounded)
                : rounded.toLocaleString('en-IN');
            }

            setDisplayValue(`${prefix}${formatted}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          };

          requestAnimationFrame(updateCounter);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [end, duration, prefix, suffix, decimals, formatIndian]);

  return { displayValue, elementRef };
}
