interface PolynesianLogoProps {
  className?: string;
  size?: number;
}

export function PolynesianLogo({ className = "", size = 24 }: PolynesianLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
    >
      {/* Moai base platform */}
      <rect x="5" y="20" width="14" height="2" rx="1" fill="white" opacity="0.3" />
      
      {/* Main moai body - characteristic elongated shape */}
      <path
        d="M9 20V15c0-1.5 0.5-2.5 1-3V10c0-2.5 1.5-4 2-5V4.5c0-1.5 1-2.5 2-2.5s2 1 2 2.5V5c0.5 1 2 2.5 2 5v2c0.5 0.5 1 1.5 1 3v5"
        fill="white"
        opacity="0.9"
      />
      
      {/* Iconic large moai nose */}
      <path
        d="M11.5 9.5c0-0.3 0.2-0.5 0.5-0.5s0.5 0.2 0.5 0.5v3.5c0 0.5-0.2 1-0.5 1s-0.5-0.5-0.5-1V9.5z"
        fill="white"
        opacity="0.8"
      />
      
      {/* Deep-set eye sockets */}
      <ellipse cx="10.5" cy="8" rx="0.8" ry="0.6" fill="rgba(0,0,0,0.3)" />
      <ellipse cx="13.5" cy="8" rx="0.8" ry="0.6" fill="rgba(0,0,0,0.3)" />
      
      {/* Subtle mouth indication */}
      <path d="M11.5 14h1" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" strokeLinecap="round" />
      
      {/* Stone texture and carved lines */}
      <path 
        d="M10 6.5h4M10 10h4M10 13.5h4"
        stroke="rgba(0,0,0,0.1)" 
        strokeWidth="0.4"
      />
      
      {/* Characteristic moai ear outline */}
      <path
        d="M9 9c-0.5 0-1 0.5-1 1v2c0 0.5 0.5 1 1 1"
        stroke="white"
        strokeWidth="0.8"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M15 9c0.5 0 1 0.5 1 1v2c0 0.5-0.5 1-1 1"
        stroke="white"
        strokeWidth="0.8"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}