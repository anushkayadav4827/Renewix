import { useState, useEffect, useRef } from 'react';

interface RepairabilityRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showPercent?: boolean;
  textColor?: string;
  trackColor?: string;
  arcColor?: string;
  labelColor?: string;
}

export function RepairabilityRing({
  score,
  size = 140,
  strokeWidth = 12,
  label = 'Repairability Score',
  showPercent = true,
  textColor,
  trackColor,
  arcColor = '#2F8F5B',
  labelColor,
}: RepairabilityRingProps) {
  const [currentScore, setCurrentScore] = useState(score || 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [strokeDashoffset, setStrokeDashoffset] = useState(() => {
    return circumference - ((score || 0) / 100) * circumference;
  });

  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // If score is 0 or negative, set to 0
    const targetScore = Math.max(0, Math.min(100, score || 0));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrentScore(targetScore);
      setStrokeDashoffset(circumference - (targetScore / 100) * circumference);
      return;
    }

    let animationFrameId: number;
    const duration = 1600; // 1.6s
    const startTime = performance.now();
    const startOffset = circumference;
    const targetOffset = circumference - (targetScore / 100) * circumference;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart: 1 - Math.pow(1 - progress, 4)
      const ease = 1 - Math.pow(1 - progress, 4);

      const nowScore = Math.round(ease * targetScore);
      const nowOffset = startOffset - ease * (startOffset - targetOffset);

      setCurrentScore(nowScore);
      setStrokeDashoffset(nowOffset);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCurrentScore(targetScore);
        setStrokeDashoffset(targetOffset);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [score, circumference]);

  const defaultTrack = trackColor || 'rgba(47, 143, 91, 0.15)';
  const defaultText = textColor || 'text-[#103D29]';
  const defaultLabel = labelColor || 'text-[#68736A]';

  return (
    <div ref={ringRef} className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90 origin-center"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Pale background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={defaultTrack}
            strokeWidth={strokeWidth}
          />
          {/* Dynamic Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={arcColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.05s linear',
            }}
          />
        </svg>

        {/* Center Number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className={`text-3xl sm:text-4xl font-black font-sans tracking-tight ${defaultText}`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {currentScore}
            {showPercent && <span className="text-xl sm:text-2xl font-bold ml-0.5">%</span>}
          </span>
        </div>
      </div>

      {label && (
        <span className={`text-xs font-bold mt-2 tracking-wider uppercase ${defaultLabel}`}>
          {label}
        </span>
      )}
    </div>
  );
}

export default RepairabilityRing;
