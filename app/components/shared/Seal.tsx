interface SealProps {
  className?: string;
}

export function Seal({className = ''}: SealProps) {
  return (
    <div
      className={`relative flex items-center justify-center w-48 h-48 ${className}`.trim()}
    >
      {/* Outer circle — pulses first */}
      <div className="seal-circle-outer absolute inset-0 rounded-full border border-gold/30" />

      {/* Middle circle — pulses at 0.8s delay */}
      <div className="seal-circle-middle absolute w-40 h-40 rounded-full border border-gold/20" />

      {/* Inner circle — pulses at 1.6s delay */}
      <div className="seal-circle-inner absolute w-32 h-32 rounded-full border border-gold/40" />

      {/* Center content — never pulses */}
      <div className="relative flex flex-col items-center justify-center text-center">
        <span className="font-display text-4xl text-gold">MM</span>
        <span className="text-[9px] uppercase tracking-[3px] text-gold/60 mt-1">
          Est. MMXXVI
        </span>
        <span className="font-display italic text-xs text-gold/50 mt-0.5">
          The House of Masks
        </span>
      </div>
    </div>
  );
}
