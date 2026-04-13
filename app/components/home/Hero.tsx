import {SectionLabel} from '~/components/shared/SectionLabel';
import {Button} from '~/components/shared/Button';

const H1_WORDS = [
  {text: 'The', italic: false},
  {text: 'Five', italic: false},
  {text: 'Rituals', italic: true},
];

export function Hero() {
  return (
    <div className="silk-hero-bg">
      <section id="hero" className="hero-reveal pt-[100px] pb-20 text-center max-w-3xl mx-auto px-6">
        {/* Decorative vertical line — draws down over 0.8s */}
        <div className="hero-line-draw w-px mx-auto mb-8 bg-sand" />

        {/* Overline — fades in at 0.6s */}
        <div className="hero-overline">
          <SectionLabel>Collection I</SectionLabel>
        </div>

        {/* Heading — word-by-word clip reveal starting at 0.9s */}
        <h1 className="silk-hero-title font-display mt-4 flex justify-center gap-[0.25em]">
          {H1_WORDS.map((word, i) => (
            <span key={word.text} className="hero-word-clip inline-block overflow-hidden">
              <span
                className={`hero-word inline-block${word.italic ? ' italic text-gold' : ''}`}
                style={{animationDelay: `${0.9 + i * 0.3}s`}}
              >
                {word.text}
              </span>
            </span>
          ))}
        </h1>

        {/* Animated gold line — grows from center at 1.6s */}
        <div className="hero-gold-line h-px w-[60px] bg-gold mx-auto mt-6 mb-8" />

        {/* Subtext — fades in at 2.2s */}
        <p className="hero-subtitle text-base text-stone max-w-xl mx-auto leading-relaxed">
          Five masks. Five intentions. Each chosen from Korea&apos;s most revered
          houses and delivered to your door. This is skincare as ceremony.
        </p>

        {/* CTAs — fade in together at 2.8s */}
        <div className="hero-ctas flex gap-4 justify-center mt-10 flex-wrap">
          <Button variant="dark" href="#rituals">
            Explore the collection
          </Button>
          <Button variant="outline" href="/quiz">
            Take the skin ritual quiz
          </Button>
        </div>
      </section>
    </div>
  );
}
