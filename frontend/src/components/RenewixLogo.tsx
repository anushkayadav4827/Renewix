import React from 'react';

interface RenewixLogoProps {
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
  size?: 'sm' | 'md' | 'lg';
}

export const RenewixLogo: React.FC<RenewixLogoProps> = ({
  className = '',
  theme = 'light',
  size = 'md',
}) => {
  const [imgError, setImgError] = React.useState(false);
  const isLightText = theme === 'light'; // Light text for dark green background
  const textColor = isLightText ? '#FFFFFF' : '#103D29';
  const iconStroke = isLightText ? '#F9C49B' : '#174C32';
  const accentColor = isLightText ? '#D9E5C4' : '#E28E5C';

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size];

  const imgHeight = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11',
  }[size];

  if (!imgError && isLightText) {
    return (
      <div className={`inline-flex items-center select-none group ${className}`}>
        <img
          src="/assets/renewix-logo-transparent.png"
          alt="Renewix"
          className={`${imgHeight} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none group ${className}`}>
      {/* Stylized Device & Loop Emblem matching the reference */}
      <div className="relative flex items-center justify-center">
        <svg
          width={size === 'lg' ? '36' : size === 'sm' ? '24' : '30'}
          height={size === 'lg' ? '36' : size === 'sm' ? '24' : '30'}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-500 group-hover:rotate-180"
        >
          {/* Laptop / Screen Base Outline */}
          <rect
            x="7"
            y="9"
            width="22"
            height="14"
            rx="3"
            stroke={iconStroke}
            strokeWidth="2.2"
            fill="none"
          />
          {/* Base Stand */}
          <line
            x1="4"
            y1="25"
            x2="32"
            y2="25"
            stroke={iconStroke}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Circular Reuse Arrow within Screen */}
          <path
            d="M14 14.5C14.8 13.2 16.3 12.5 18 12.5C20.2 12.5 22 14.3 22 16.5C22 18.7 20.2 20.5 18 20.5C16.3 20.5 14.8 19.5 14 18"
            stroke={accentColor}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M13 13L14.2 15L16.2 13.8"
            stroke={accentColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Name Typography matching the reference */}
      <span
        className={`font-editorial font-bold tracking-tight italic ${sizeClasses}`}
        style={{ color: textColor }}
      >
        Renew<span className="font-sans font-extrabold not-italic" style={{ color: isLightText ? '#F9C49B' : '#E28E5C' }}>ix</span>
      </span>
    </div>
  );
};

export default RenewixLogo;
