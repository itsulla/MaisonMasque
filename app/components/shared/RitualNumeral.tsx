interface RitualNumeralProps {
  numeral: string;
}

/**
 * Circular Roman-numeral badge overlay for products in the Five Rituals
 * collection. Absolutely positioned — the parent must be `position: relative`.
 */
export function RitualNumeral({numeral}: RitualNumeralProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute z-10 flex items-center justify-center pointer-events-none"
      style={{
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '56px',
        height: '56px',
        borderRadius: '9999px',
        border: '1px solid #E8E2D6',
        backgroundColor: 'rgba(250, 248, 243, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <span
        className="font-display"
        style={{
          fontSize: '24px',
          color: '#8A8279',
          lineHeight: 1,
        }}
      >
        {numeral}
      </span>
    </div>
  );
}
