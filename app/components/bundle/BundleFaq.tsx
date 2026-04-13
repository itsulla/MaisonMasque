interface FaqItem {
  q: string;
  a: string;
}

interface BundleFaqProps {
  items: FaqItem[];
}

export function BundleFaq({items}: BundleFaqProps) {
  return (
    <section className="py-20 px-6 max-w-3xl mx-auto" aria-label="Frequently asked questions">
      <div className="text-center mb-12">
        <p className="text-gold text-[11px] uppercase tracking-[4px] font-semibold font-body">
          Questions
        </p>
        <h2 className="font-display text-[clamp(28px,3vw,36px)] mt-3">
          Before you begin
        </h2>
        <div className="w-[60px] h-px bg-gold mx-auto mt-4" />
      </div>

      <div className="divide-y divide-sand border-y border-sand">
        {items.map((item, i) => (
          <details key={i} className="group py-5 px-2">
            <summary className="flex items-baseline justify-between cursor-pointer list-none select-none">
              <span className="font-display text-[17px] text-ink pr-6">{item.q}</span>
              <span
                className="text-gold font-display text-xl flex-shrink-0 transition-transform duration-300 group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="text-[14px] text-walnut leading-relaxed mt-4 pr-8">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
