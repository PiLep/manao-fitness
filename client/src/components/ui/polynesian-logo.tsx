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
      {/* Statue base */}
      <path
        d="M6 20h12v2H6z"
        fill="currentColor"
        opacity="0.6"
      />
      
      {/* Statue body */}
      <path
        d="M8 14v6h8v-6c0-2.2-1.8-4-4-4s-4 1.8-4 4z"
        fill="currentColor"
        opacity="0.8"
      />
      
      {/* Statue head */}
      <circle
        cx="12"
        cy="7"
        r="3"
        fill="currentColor"
      />
      
      {/* Traditional headpiece/crown */}
      <path
        d="M9 4.5c0-1 1-2 3-2s3 1 3 2c0 0.5-0.5 1-1 1h-4c-0.5 0-1-0.5-1-1z"
        fill="currentColor"
        opacity="0.9"
      />
      
      {/* Arms in ceremonial position */}
      <path
        d="M7 12c-1 0-2 1-2 2v2c0 0.5 0.5 1 1 1s1-0.5 1-1v-3c0-0.5 0.5-1 1-1z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M17 12c1 0 2 1 2 2v2c0 0.5-0.5 1-1 1s-1-0.5-1-1v-3c0-0.5-0.5-1-1-1z"
        fill="currentColor"
        opacity="0.7"
      />
      
      {/* Traditional necklace/lei */}
      <circle cx="10" cy="11" r="0.5" fill="currentColor" opacity="0.4" />
      <circle cx="12" cy="10.5" r="0.5" fill="currentColor" opacity="0.4" />
      <circle cx="14" cy="11" r="0.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}