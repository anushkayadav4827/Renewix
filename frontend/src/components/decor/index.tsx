import React from 'react';

// ─── 1. Leaf (Multiple Shapes: oval, pointed, broad) ────────────
export const LeafDecor: React.FC<{
  variant?: 'oval' | 'pointed' | 'broad';
  className?: string;
  color?: string;
  size?: number;
}> = ({ variant = 'pointed', className = '', color = 'currentColor', size = 32 }) => {
  if (variant === 'oval') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M8 32C8 32 12 12 32 8C32 8 32 28 8 32Z"
          fill={color}
          fillOpacity="0.12"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 32C15 25 24 16 32 8"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === 'broad') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M6 42C10 28 22 10 42 6C36 24 24 38 6 42Z"
          fill={color}
          fillOpacity="0.1"
          stroke={color}
          strokeWidth="1.8"
        />
        <path d="M6 42C18 30 30 18 42 6" stroke={color} strokeWidth="1.2" />
        <path d="M22 26C26 24 30 24 34 22" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
        <path d="M14 34C18 32 22 32 26 30" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    );
  }

  // Pointed (Default)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 30C10 18 18 10 30 6C30 18 22 26 6 30Z"
        fill={color}
        fillOpacity="0.15"
        stroke={color}
        strokeWidth="1.6"
      />
      <path d="M6 30C14 22 22 14 30 6" stroke={color} strokeWidth="1.4" />
    </svg>
  );
};

// ─── 2. LeafCluster ──────────────────────────────────────────────
export const LeafCluster: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#2f8f5b',
}) => (
  <svg
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none ${className}`}
  >
    {/* Central Leaf */}
    <path
      d="M20 140C40 90 85 45 140 20C130 80 80 130 20 140Z"
      fill={color}
      fillOpacity="0.12"
      stroke={color}
      strokeWidth="2"
    />
    <path d="M20 140C60 100 100 60 140 20" stroke={color} strokeWidth="1.5" />
    
    {/* Left Leaflet */}
    <path
      d="M35 115C30 80 50 55 90 40C80 75 60 105 35 115Z"
      fill={color}
      fillOpacity="0.08"
      stroke={color}
      strokeWidth="1.4"
    />
    {/* Right Leaflet */}
    <path
      d="M75 135C75 100 105 75 135 65C125 105 105 125 75 135Z"
      fill={color}
      fillOpacity="0.08"
      stroke={color}
      strokeWidth="1.4"
    />
  </svg>
);

// ─── 3. FernFrond (Arching botanical frond) ─────────────────────
export const FernFrond: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#2f8f5b',
}) => (
  <svg
    viewBox="0 0 200 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none ${className}`}
  >
    {/* Main Spine */}
    <path
      d="M20 290Q100 200 170 30"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.35"
    />
    {/* Frond Pinnae */}
    {[
      { x1: 40, y1: 260, x2: 15, y2: 240 },
      { x1: 55, y1: 235, x2: 95, y2: 220 },
      { x1: 70, y1: 205, x2: 30, y2: 185 },
      { x1: 85, y1: 175, x2: 135, y2: 155 },
      { x1: 105, y1: 140, x2: 55, y2: 125 },
      { x1: 125, y1: 105, x2: 165, y2: 85 },
      { x1: 145, y1: 70, x2: 105, y2: 55 },
      { x1: 160, y1: 45, x2: 180, y2: 30 },
    ].map((p, idx) => (
      <g key={idx} opacity={0.3 + (idx % 3) * 0.1}>
        <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx={p.x2} cy={p.y2} rx="8" ry="4" transform={`rotate(${idx * 15} ${p.x2} ${p.y2})`} fill={color} fillOpacity="0.15" />
      </g>
    ))}
  </svg>
);

// ─── 4. CircuitTrail (Tech + Nature: Lines with Micro-Nodes) ────
export const CircuitTrail: React.FC<{
  className?: string;
  color?: string;
  accentColor?: string;
}> = ({ className = '', color = '#2f8f5b', accentColor = '#f2c94c' }) => (
  <svg
    viewBox="0 0 400 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none ${className}`}
  >
    {/* Trail 1: Upper branching line */}
    <path
      d="M10 20H140L190 70H280L320 110H390"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.3"
    />
    {/* Trail 2: Lower looping circuit */}
    <path
      d="M40 180H160L210 130H300L350 180H390"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.25"
    />
    {/* Branch connection */}
    <path
      d="M190 70V130"
      stroke={color}
      strokeWidth="1.2"
      strokeDasharray="3 3"
      opacity="0.3"
    />
    {/* Nodes */}
    <circle cx="140" cy="20" r="3.5" fill={accentColor} opacity="0.6" />
    <circle cx="190" cy="70" r="4" fill={color} opacity="0.5" />
    <circle cx="280" cy="70" r="3" fill={accentColor} opacity="0.6" />
    <circle cx="210" cy="130" r="4.5" fill={accentColor} opacity="0.7" />
    <circle cx="350" cy="180" r="3.5" fill={color} opacity="0.6" />
    {/* Micro chip rectangle on circuit */}
    <rect x="235" y="64" width="12" height="12" rx="2" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" opacity="0.5" />
  </svg>
);

// ─── 5. Tech + Nature Icons (Chip, Battery, Gear, Wrench, Plug) ─
export const ChipIconDecor: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 28,
  color = '#2f8f5b',
  className = '',
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <rect x="7" y="7" width="18" height="18" rx="3" stroke={color} strokeWidth="1.8" fill={color} fillOpacity="0.1" />
    <circle cx="16" cy="16" r="3" fill={color} fillOpacity="0.3" />
    <path d="M11 2V7M21 2V7M11 25V30M21 25V30M2 11H7M2 21H7M25 11H30M25 21H30" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const BatterySproutDecor: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 32,
  color = '#2f8f5b',
  className = '',
}) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className}>
    {/* Battery body */}
    <rect x="6" y="14" width="22" height="16" rx="3" stroke={color} strokeWidth="1.8" fill={color} fillOpacity="0.1" />
    <path d="M28 19V25" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Sprout growing out of battery */}
    <path d="M17 14V6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M17 9C19 6 24 6 25 8C25 11 20 11 17 9Z" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="1.2" />
    <path d="M17 11C15 8 10 8 9 10C9 13 14 13 17 11Z" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="1.2" />
  </svg>
);

export const GearIconDecor: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 28,
  color = '#2f8f5b',
  className = '',
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <circle cx="16" cy="16" r="5" stroke={color} strokeWidth="1.8" fill={color} fillOpacity="0.1" />
    <path
      d="M16 3V6M16 26V29M3 16H6M26 16H29M6.8 6.8L8.9 8.9M23.1 23.1L25.2 25.2M6.8 25.2L8.9 23.1M23.1 8.9L25.2 6.8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const PlugIconDecor: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 28,
  color = '#2f8f5b',
  className = '',
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <path d="M10 5V12M22 5V12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <rect x="7" y="12" width="18" height="10" rx="3" stroke={color} strokeWidth="1.8" fill={color} fillOpacity="0.1" />
    <path d="M16 22V28" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ─── 6. Fireflies (Drifting Glowing Dots) ───────────────────────
export const Fireflies: React.FC<{ count?: number; className?: string }> = ({
  count = 18,
  className = '',
}) => {
  // Deterministic positions so no SSR hydration mismatch
  const dots = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: (11 * (i + 1) * 7) % 94 + 3, // % 3 to 97
      y: (17 * (i + 1) * 5) % 90 + 5,
      size: (i % 3) + 2.5,
      duration: 5 + (i % 4) * 2,
      delay: (i % 5) * 0.8,
      color: i % 2 === 0 ? '#f2c94c' : '#a7f3d0',
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            backgroundColor: d.color,
            boxShadow: `0 0 10px 2px ${d.color}`,
            opacity: 0.45,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// ─── 7. Bokeh (Soft Blurred Luminous Circles) ───────────────────
export const Bokeh: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#2f8f5b',
}) => (
  <div className={`absolute rounded-full pointer-events-none blur-3xl mix-blend-screen opacity-20 ${className}`} style={{ backgroundColor: color }} />
);

// ─── 8. DotGrid (Subtle Grid Texture) ───────────────────────────
export const DotGrid: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.05,
}) => (
  <svg
    className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity }}
  >
    <defs>
      <pattern id="renewix-dotgrid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.2" fill="#0f3b28" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#renewix-dotgrid)" />
  </svg>
);

// ─── 9. LightShaft (Radiant Sunbeam Effect) ──────────────────────
export const LightShaft: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`absolute pointer-events-none select-none overflow-hidden ${className}`}
    style={{
      background: 'linear-gradient(135deg, rgba(248, 176, 140, 0.18) 0%, rgba(47, 143, 91, 0.08) 50%, transparent 80%)',
      clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0% 100%)',
    }}
  />
);

// ─── 10. Swoosh (Animated Hand-Drawn Underline) ─────────────────
export const SwooshDecor: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#F28B4B',
}) => (
  <div className={`w-64 h-5 relative ${className}`}>
    <svg viewBox="0 0 240 16" fill="none" className="w-full h-full">
      <path
        d="M 5 12 Q 120 -2 235 10"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        className="swoosh-path"
      />
    </svg>
  </div>
);
