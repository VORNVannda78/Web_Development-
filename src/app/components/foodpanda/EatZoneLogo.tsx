const PINK = "#D70F64";

interface EatZoneLogoProps {
  size?: number;
  showText?: boolean;
  textSize?: string;
}

export function EatZoneLogoIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill={PINK} />
      {/* Fork */}
      <line x1="13" y1="8" x2="13" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="8" x2="10" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="8" x2="16" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 13 Q13 15 16 13" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="13" y1="16" x2="13" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round" />
      {/* Knife */}
      <path d="M27 8 L27 18 Q30 22 30 32" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="27" y1="18" x2="27" y2="32" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function EatZoneLogo({ size = 32, showText = true, textSize = "text-xl" }: EatZoneLogoProps) {
  return (
    <div className="flex items-center gap-2">
      <EatZoneLogoIcon size={size} />
      {showText && (
        <span className={`font-black tracking-tight ${textSize}`} style={{ color: PINK }}>
          EatZone
        </span>
      )}
    </div>
  );
}
