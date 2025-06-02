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
      {/* Base circulaire caractéristique */}
      <ellipse cx="12" cy="21" rx="6" ry="1.5" fill="white" opacity="0.4" />
      
      {/* Corps principal du moai - forme rectangulaire massive */}
      <path
        d="M8 21V8c0-2 1.5-4 4-4s4 2 4 4v13"
        fill="white"
        opacity="0.9"
      />
      
      {/* Tête caractéristique avec front large */}
      <path
        d="M9 8c0-1.5 0.5-3 1.5-4C11 3.5 11.5 3 12 3s1 0.5 1.5 1c1 1 1.5 2.5 1.5 4v6c0 1-0.5 2-1.5 2.5-0.5 0.3-1 0.5-1.5 0.5s-1-0.2-1.5-0.5C9.5 16 9 15 9 14V8z"
        fill="white"
        opacity="0.95"
      />
      
      {/* Chapeau/coiffe caractéristique */}
      <ellipse cx="12" cy="3.5" rx="2.5" ry="1" fill="white" opacity="0.6" />
      
      {/* Nez proéminent très allongé */}
      <path
        d="M11.2 8.5c0-0.3 0.3-0.5 0.8-0.5s0.8 0.2 0.8 0.5v4c0 0.8-0.3 1.5-0.8 1.5s-0.8-0.7-0.8-1.5V8.5z"
        fill="white"
        opacity="0.8"
      />
      
      {/* Orbites oculaires profondes et caractéristiques */}
      <ellipse cx="10.5" cy="7.5" rx="1" ry="0.8" fill="rgba(0,0,0,0.4)" />
      <ellipse cx="13.5" cy="7.5" rx="1" ry="0.8" fill="rgba(0,0,0,0.4)" />
      
      {/* Bouche stylisée en double trait */}
      <path d="M10.5 15.5h3" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" strokeLinecap="round" />
      <path d="M11 16.5h2" stroke="rgba(0,0,0,0.2)" strokeWidth="0.4" strokeLinecap="round" />
      
      {/* Oreilles rectangulaires typiques */}
      <rect x="7.5" y="9" width="1" height="3" rx="0.2" fill="white" opacity="0.7" />
      <rect x="15.5" y="9" width="1" height="3" rx="0.2" fill="white" opacity="0.7" />
    </svg>
  );
}