import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Compass, Handshake, Leaf } from 'lucide-react';
import { HomeCollection, HomeFeatured } from '@/components/property/home-featured';
import { HomeMetrics } from '@/components/property/home-metrics';
import { HomeSearch } from '@/components/property/home-search';
import { AffordabilityCalculator } from '@/components/property/affordability-calculator';

export const metadata: Metadata = {
  title: 'EstatePro | Reliable homes for stable investments',
  description:
    'Explore thoughtfully selected homes for sale and rent in Lagos, Abuja, and across Nigeria with EstatePro.',
};

export default function HomePage() {
  return (
    <main>
      <section className="intro-section" id="home">
        <div className="intro-top">
          <div className="headline-block">
            <p className="eyebrow">
              <span className="eyebrow-rule" /> A MORE CONSIDERED WAY HOME
            </p>
            <h1>
              Reliable homes
              <br />
              for stable <em>investments</em>
            </h1>
          </div>
          <div className="intro-note">
            <p>
              Our homes are more than square metres. They are places to build a life, and a thoughtful
              foundation for what comes next.
            </p>
            <p>We bring local knowledge and careful guidance to every move.</p>
          </div>
        </div>
        <HomeMetrics />
        <HomeFeatured />
      </section>

      <section className="opportunities-section" id="homes">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-rule" /> A HOME FOR EVERY NEXT CHAPTER
            </p>
            <h2>Find a place to call yours.</h2>
          </div>
          <Link className="view-all" href="/listings">
            Explore all homes <ArrowUpRight size={15} />
          </Link>
        </div>
        <HomeSearch />
        <p className="search-foot">
          <span>Thoughtful homes for every kind of next.</span>
          <a href="#our-approach">
            SCROLL TO EXPLORE <ArrowDown size={13} />
          </a>
        </p>
        <div className="mt-8">
          <HomeCollection />
        </div>
      </section>

      <section className="approach-section" id="our-approach">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-rule" /> GUIDANCE THAT FEELS PERSONAL
          </p>
          <h2>
            Good homes make
            <br />
            room for <em>what matters.</em>
          </h2>
        </div>
        <div className="approach-copy">
          <p>
            From the first conversation to the keys in your hand, our advisors make each decision feel clear.
            We bring a local point of view, careful research, and genuine attention to every home we share.
          </p>
          <Link className="view-all" href="/about">
            Get to know our approach <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="value-grid">
          <article>
            <span>
              <Compass size={18} />
            </span>
            <h3>Local knowledge</h3>
            <p>Clear insight into the neighbourhoods and details that shape everyday life.</p>
          </article>
          <article>
            <span>
              <Handshake size={18} />
            </span>
            <h3>Personal guidance</h3>
            <p>A dedicated advisor who listens first and helps you move with confidence.</p>
          </article>
          <article>
            <span>
              <Leaf size={18} />
            </span>
            <h3>Considered choices</h3>
            <p>A carefully selected collection, chosen with your next chapter in mind.</p>
          </article>
        </div>
      </section>

      <section className="calculator-section" id="affordability">
        <AffordabilityCalculator />
      </section>
    </main>
  );
}
