import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Compass, Handshake, Leaf, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our approach | EstatePro',
  description:
    'Learn how EstatePro pairs local knowledge with thoughtful home selection and personal guidance.',
};

const principles = [
  {
    icon: Compass,
    title: 'Local, in every detail',
    body: 'A home is shaped by the streets around it as much as the rooms inside. Our team brings practical, neighbourhood-level knowledge to every conversation.',
  },
  {
    icon: ShieldCheck,
    title: 'Clear from the beginning',
    body: 'We explain the details that matter and keep the next step visible, so your decisions feel informed and your time is respected.',
  },
  {
    icon: Handshake,
    title: 'People before property',
    body: 'Every move has its own reason behind it. We take time to understand yours and make recommendations that fit the way you want to live.',
  },
  {
    icon: Leaf,
    title: 'Chosen with care',
    body: 'Our collection is shaped by real quality, a sense of place, and the lasting value a well-considered home can bring.',
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="about-hero">
        <div className="about-hero-image" />
        <div className="about-hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-rule" /> ABOUT ESTATEPRO
          </p>
          <h1 className="page-title">
            Make room for
            <br />
            what <em>matters.</em>
          </h1>
          <p className="page-lede">
            A real estate experience built around people, local knowledge, and the feeling of finding the
            right place.
          </p>
          <Link href="/contact" className="view-all mt-6">
            Meet your local advisor <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
      <section className="about-story page-container">
        <p className="eyebrow">
          <span className="eyebrow-rule" /> WHY WE ARE HERE
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-[.75fr_1.25fr]">
          <h2 className="font-display text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
            The right home changes the way the next chapter feels.
          </h2>
          <div className="grid gap-4 text-sm leading-7 text-[#68726a]">
            <p>
              EstatePro helps people find their place with less noise and more understanding. We bring
              together carefully selected homes and advisors who know the communities they serve.
            </p>
            <p>
              From the first questions to a final viewing, we make space for honest conversations and useful
              guidance. So finding home can feel like a beginning, not another thing to manage.
            </p>
          </div>
        </div>
      </section>
      <section className="about-principles">
        <div className="page-container">
          <p className="eyebrow">
            <span className="eyebrow-rule" /> OUR PROMISE
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight">
            A more thoughtful way forward.
          </h2>
          <div className="value-grid">
            {principles.map(({ icon: Icon, title, body }) => (
              <article key={title}>
                <span>
                  <Icon size={18} />
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="page-container py-14 text-center">
        <p className="eyebrow justify-center">
          <span className="eyebrow-rule" /> WHEN YOU ARE READY
        </p>
        <h2 className="mt-4 font-display text-3xl font-medium">Let’s find your place.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
          Tell us what you are looking for. We will help you take the next step at your pace.
        </p>
        <Link href="/contact" className="button-dark mt-6 inline-flex">
          Start a conversation <ArrowUpRight size={15} />
        </Link>
      </section>
    </main>
  );
}
