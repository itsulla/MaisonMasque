const shippingData = [
  {
    code: 'AU',
    country: 'Australia',
    delivery: '5\u20138 days',
    threshold: 'Complimentary over $60',
  },
  {
    code: 'GB',
    country: 'United Kingdom',
    delivery: '7\u201312 days',
    threshold: 'Complimentary over \u00A345',
  },
  {
    code: 'EU',
    country: 'European Union',
    delivery: '8\u201314 days',
    threshold: 'Complimentary over \u20AC50',
  },
  {
    code: 'ZA',
    country: 'South Africa',
    delivery: '10\u201316 days',
    threshold: 'Complimentary over R750',
  },
];

function FlagIcon({code}: {code: string}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className="w-7 h-7 mx-auto mb-2"
      aria-hidden="true"
    >
      <rect
        width="32"
        height="32"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-sand"
      />
      <text
        x="16"
        y="18"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-stone"
        fontSize="9"
        fontFamily="var(--font-body)"
        fontWeight="600"
        letterSpacing="0.5"
      >
        {code}
      </text>
    </svg>
  );
}

export function ShippingBar() {
  return (
    <div className="border-y border-sand py-8 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {shippingData.map((item, index) => (
          <div
            key={item.code}
            className={`px-6 text-center ${
              index < shippingData.length - 1 ? 'md:border-r border-sand' : ''
            } ${index < 2 ? 'mb-6 md:mb-0' : ''}`}
          >
            <FlagIcon code={item.code} />
            <h4 className="font-display text-base text-ink">{item.country}</h4>
            <p className="text-xs text-stone mt-1">{item.delivery}</p>
            <p className="text-xs text-stone mt-0.5">{item.threshold}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
