export function TrustBadges() {
  const badges = [
    'Authentic',
    'Ships from HK',
    'Free returns',
  ];

  return (
    <div className="flex gap-6 mt-8 pt-8 border-t border-sand">
      {badges.map((badge) => (
        <div key={badge} className="flex items-center gap-2 text-xs text-stone">
          <span className="text-gold">✓</span>
          <span>{badge}</span>
        </div>
      ))}
    </div>
  );
}
