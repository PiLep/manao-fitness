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
      {/* Cercle principal */}
      <circle cx="12" cy="12" r="10" fill="white" opacity="0.15" />
      
      {/* Lettre M stylisée pour Manao */}
      <path
        d="M7 16V8l3 5 2-5v8M16 8v8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.9"
      />
      
      {/* Accent polynésien - vague stylisée */}
      <path
        d="M8 19c2-1 4-1 6 0s4 1 6 0"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      
      {/* Points décoratifs polynésiens */}
      <circle cx="6" cy="6" r="1" fill="white" opacity="0.4" />
      <circle cx="18" cy="6" r="1" fill="white" opacity="0.4" />
      <circle cx="6" cy="18" r="0.8" fill="white" opacity="0.3" />
      <circle cx="18" cy="18" r="0.8" fill="white" opacity="0.3" />
    </svg>
  );
}