// Aligned with live Shopify delivery profile tiers.
// SG/JP/AE match gift-tier 1 ($45). SE-Asia & UK: $55. Oceania/NA: $65. EU: $75.
const shippingData = [
  {
    code: 'SG',
    country: 'Singapore & Japan',
    delivery: '5\u20139 days',
    threshold: 'Complimentary over $45',
  },
  {
    code: 'GB',
    country: 'UK & SE Asia',
    delivery: '5\u20139 days',
    threshold: 'Complimentary over $55',
  },
  {
    code: 'AU',
    country: 'Australia & N. America',
    delivery: '8\u201314 days',
    threshold: 'Complimentary over $65',
  },
  {
    code: 'EU',
    country: 'European Union',
    delivery: '6\u201310 days',
    threshold: 'Complimentary over $75',
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
