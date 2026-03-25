import {SectionLabel} from '~/components/shared/SectionLabel';
import {Button} from '~/components/shared/Button';

export function Hero() {
  return (
    <section className="pt-[100px] pb-20 text-center max-w-3xl mx-auto px-6">
      {/* Decorative vertical line */}
      <div
        className="w-px h-[60px] bg-sand mx-auto mb-8 animate-fade-up"
        style={{animationDelay: '0s'}}
      />

      {/* Overline */}
      <div className="animate-fade-up" style={{animationDelay: '0.1s'}}>
        <SectionLabel>Collection I</SectionLabel>
      </div>

      {/* Heading */}
      <h1
        className="font-display text-[clamp(42px,6vw,80px)] tracking-[-1px] leading-[1.1] mt-4 animate-fade-up"
        style={{animationDelay: '0.2s'}}
      >
        The Five <em className="italic text-gold">Rituals</em>
      </h1>

      {/* Animated gold line */}
      <div
        className="h-px w-[60px] bg-gold mx-auto mt-6 mb-8 animate-line-grow"
        style={{animationDelay: '0.5s'}}
      />

      {/* Subtext */}
      <p
        className="text-base text-stone max-w-xl mx-auto leading-relaxed animate-fade-up"
        style={{animationDelay: '0.3s'}}
      >
        Five masks. Five intentions. Each chosen from Korea&apos;s most revered
        houses and delivered to your door. This is skincare as ceremony.
      </p>

      {/* CTAs */}
      <div
        className="flex gap-4 justify-center mt-10 flex-wrap animate-fade-up"
        style={{animationDelay: '0.4s'}}
      >
        <Button variant="dark" href="#rituals">
          Explore the collection
        </Button>
        <Button variant="outline" href="/quiz">
          Take the skin ritual quiz
        </Button>
      </div>
    </section>
  );
}
