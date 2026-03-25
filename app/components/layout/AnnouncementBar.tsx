export function AnnouncementBar() {
  return (
    <div className="w-full bg-ink py-2.5 text-center">
      <p className="text-cream text-[11px] uppercase tracking-[3px] font-body font-medium">
        Complimentary shipping on orders over{' '}
        <span className="text-gold">&pound;45</span> /{' '}
        <span className="text-gold">$60 AUD</span> /{' '}
        <span className="text-gold">&euro;50</span> /{' '}
        <span className="text-gold">R750</span> &mdash; Worldwide delivery
      </p>
    </div>
  );
}
