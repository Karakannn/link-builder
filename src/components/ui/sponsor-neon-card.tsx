import React from 'react';
import { cn } from '@/lib/utils';
import { useEditor } from '@/providers/editor/editor-provider';

interface SponsorNeonCardProps {
  children?: React.ReactNode;
  className?: string;
  borderSize?: number;
  borderRadius?: number;
  neonColor?: string;
  animationDelay?: number;
  href?: string;
}

// Helper function to convert hex to RGB
const hexToRgb = (hex: string) => {
  if (typeof hex !== 'string') {
    return '255, 0, 170'; // Default pink color
  }
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

export const SponsorNeonCard: React.FC<SponsorNeonCardProps> = ({
  children,
  className = '',
  borderSize = 2,
  borderRadius = 12,
  neonColor = '#ff00aa',
  animationDelay = 0,
  href,
}) => {
  const rgbColor = hexToRgb(neonColor);
  const { state } = useEditor();

  const commonProps = {
    className: cn(
      "relative flex items-center justify-center text-white overflow-hidden cursor-pointer transition-all duration-300 ease-in-out",
      className
    ),
    style: {
      border: `${borderSize}px solid ${neonColor}`,
      borderRadius: `${borderRadius}px`,
      boxShadow: `inset 0px 0px 16px 1px rgba(${rgbColor}, 0.35), 0px 0px 14px 3px rgba(${rgbColor}, 0.45)`,
      background: 'rgba(28, 28, 28, 0.75)',
      backdropFilter: 'blur(1px)',
      height: '100%',
      animation: `blink 8s infinite alternate, cardShadow 3.5s infinite`,
      animationDelay: `${animationDelay}s`,
      // CSS custom properties for animations
      '--card-color': neonColor,
      '--card-color-rgb': rgbColor,
    } as React.CSSProperties,
  };

  const content = (
    <>
      {/* Keyframes styles */}
      <style jsx>{`
        @keyframes cardShadow {
          70% {
            box-shadow: inset 0px 0px 7px 2px rgba(${rgbColor}, 0.35), 0px 0px 10px 3px rgba(${rgbColor}, 0.45);
          }
          71% {
            box-shadow: inset 0px 0px 16px 1px rgba(${rgbColor}, 0.35), 0px 0px 14px 3px rgba(${rgbColor}, 0.45);
          }
        }
        
        @keyframes blink {
          40% {
            opacity: 1;
          }
          42% {
            opacity: 0.8;
          }
          43% {
            opacity: 1;
          }
          45% {
            opacity: 0.2;
          }
          46% {
            opacity: 1;
          }
        }
      `}</style>
      
      {children}
    </>
  );

  // If in live mode and href is provided, render as anchor tag
  if (state.editor.liveMode && href) {
    return (
      <a
        href={href || '#'}
        target="_blank"
        rel="noopener noreferrer"
        {...commonProps}
      >
        {content}
      </a>
    );
  }

  // Otherwise render as div (for edit mode or when no href)
  return (
    <div {...commonProps}>
      {content}
    </div>
  );
};