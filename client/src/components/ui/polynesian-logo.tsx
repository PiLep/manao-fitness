interface PolynesianLogoProps {
  className?: string;
  size?: number;
}

export function PolynesianLogo({ className = "", size = 24 }: PolynesianLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      className={className}
    >
      {/* Profil polynésien inspiré du PNG fourni */}
      
      {/* Contour de la tête et front */}
      <path
        d="M25 15C25 10 30 5 40 5C50 5 75 8 75 25C75 35 75 45 75 55"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Nez caractéristique */}
      <path
        d="M60 35C65 35 70 40 70 45C70 50 65 55 60 55"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Bouche */}
      <path
        d="M55 65C60 65 65 68 65 72"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Menton et cou */}
      <path
        d="M75 55C75 65 70 75 60 80C50 85 40 85 35 80"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Épaules */}
      <path
        d="M35 80C30 85 25 90 20 95M35 80C40 85 50 90 60 90C70 90 80 85 85 80"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Détails du profil - oreille */}
      <path
        d="M25 25C20 25 15 30 15 35C15 40 20 45 25 45"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Détails traditionnels sur le front */}
      <path
        d="M35 20C40 18 45 18 50 20"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}