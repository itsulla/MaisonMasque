const BADGES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5A55A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    text: '100% Korean',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5A55A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    text: 'Dermatologist Tested',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5A55A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="6" width="22" height="12" rx="2" />
        <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
    text: 'Free shipping over £45',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C5A55A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </svg>
    ),
    text: '30-day returns',
  },
];

export function TrustBar() {
  return (
    <div className="border-y border-sand py-10">
      <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 px-6">
        {BADGES.map((badge) => (
          <div
            key={badge.text}
            className="flex items-center gap-2 text-xs text-walnut"
          >
            {badge.icon}
            <span>{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
