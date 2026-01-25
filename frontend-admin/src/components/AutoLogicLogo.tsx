import React from 'react';

interface AutoLogicLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function AutoLogicLogo({ className = '', width = 200, height = 80 }: AutoLogicLogoProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 200 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block' }}
    >
      {/* Dunkelblauer Hintergrund mit abgerundeten Ecken */}
      <rect 
        x="0" 
        y="0" 
        width="200" 
        height="80" 
        rx="8" 
        fill="url(#gradient)" 
      />
      
      {/* Gradient Definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="50%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>
      
      {/* Auto-Umriss (weiß, stilisiert wie im Bild - oben positioniert) */}
      <path 
        d="M40 20 L45 8 L58 4 L74 2 L90 2 L106 4 L120 8 L132 12 L138 15 L138 18 L138 21 L132 24 L120 28 L106 32 L90 32 L74 32 L58 30 L45 26 L40 23 Z" 
        stroke="white" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Schaltkreis-Design (orange) im Auto - Vorderer Kreis */}
      <circle 
        cx="74" 
        cy="16" 
        r="3" 
        fill="#FF6B35" 
        stroke="#FF6B35" 
        strokeWidth="0"
      />
      
      {/* Schaltkreis-Design (orange) im Auto - Hinterer Kreis */}
      <circle 
        cx="118" 
        cy="19" 
        r="3" 
        fill="#FF6B35" 
        stroke="#FF6B35" 
        strokeWidth="0"
      />
      
      {/* Verbindungslinie (orange, gewunden wie Schaltkreis) */}
      <path 
        d="M74 16 Q88 13, 102 16 Q110 18, 118 19" 
        stroke="#FF6B35" 
        strokeWidth="2" 
        fill="none" 
        strokeLinecap="round"
      />
      
      {/* Vorderrad */}
      <circle cx="62" cy="26" r="4" stroke="white" strokeWidth="2" fill="none" />
      <circle cx="62" cy="26" r="2" stroke="white" strokeWidth="1.5" fill="none" />
      
      {/* Hinterrad */}
      <circle cx="126" cy="28" r="4" stroke="white" strokeWidth="2" fill="none" />
      <circle cx="126" cy="28" r="2" stroke="white" strokeWidth="1.5" fill="none" />
      
      {/* Text "AutoLogic" (weiß, größer und klarer - unter dem Auto) */}
      <text 
        x="100" 
        y="60" 
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
        fontSize="20" 
        fontWeight="700" 
        fill="white" 
        textAnchor="middle" 
        letterSpacing="2px"
      >
        AutoLogic
      </text>
    </svg>
  );
}

