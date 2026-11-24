import React from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  baseDelayMs?: number;
  highlightText?: string;
  highlightClassName?: string;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  baseDelayMs = 150,
  highlightText,
  highlightClassName = 'font-editorial italic font-bold text-[#F28B4B]',
}) => {
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, idx) => {
        const isHighlight =
          highlightText &&
          highlightText.toLowerCase().includes(word.toLowerCase().replace(/[^a-z]/g, ''));

        return (
          <span key={idx} className={`split-word-wrap ${isHighlight ? 'pr-[0.18em] -mr-[0.04em] pb-[0.08em]' : ''}`}>
            <span
              className={`split-word ${isHighlight ? `${highlightClassName} pr-[0.18em] -mr-[0.18em] pb-[0.08em]` : ''}`}
              style={
                {
                  '--base': `${baseDelayMs}ms`,
                  '--d': idx,
                } as React.CSSProperties
              }
            >
              {word}
            </span>
          </span>
        );
      })}
    </span>
  );
};

export default SplitText;
