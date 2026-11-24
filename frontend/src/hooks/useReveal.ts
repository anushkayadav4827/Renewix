import { useEffect } from 'react';

/**
 * useReveal Hook
 * IntersectionObserver with a sweep safety net (Velia spec)
 * Observes .rv, .rv-scale, .row, .split-word, .swoosh-path
 * Adds .in-view class when in viewport, with a fallback safety sweep.
 */
export function useReveal() {
  useEffect(() => {
    // If reduced motion, immediately mark everything in view
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.rv, .rv-scale, .row, .split-word, .swoosh-path').forEach((el) => {
        el.classList.add('in-view');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Unobserve once revealed to keep GPU overhead low
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1,
      }
    );

    const elements = document.querySelectorAll(
      '.rv, .rv-scale, .row, .split-word, .swoosh-path, [data-reveal]'
    );
    elements.forEach((el) => observer.observe(el));

    // Sweep safety net: After 1200ms, mark any elements that are already within or above the viewport
    const sweepTimer = setTimeout(() => {
      const windowHeight = window.innerHeight;
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowHeight + 50) {
          el.classList.add('in-view');
        }
      });
    }, 1200);

    return () => {
      clearTimeout(sweepTimer);
      observer.disconnect();
    };
  }, []);
}
