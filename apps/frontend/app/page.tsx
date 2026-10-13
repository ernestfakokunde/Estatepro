const highlights = [
  { value: "2,400+", label: "Homes to explore" },
  { value: "18", label: "Cities covered" },
  { value: "98%", label: "Happy homeowners" },
];

export default function Home() {
  return (
    <main className="page-shell">
      <nav className="nav container">
        <a className="brand" href="#home" aria-label="EstatePro home"><span className="brand-mark">E</span> estate<span>pro</span></a>
        <div className="nav-links"><a href="#properties">Properties</a><a href="#how-it-works">How it works</a><a href="#about">About us</a></div>
        <a className="nav-cta" href="mailto:hello@estatepro.com">Talk to an agent <span>↗</span></a>
      </nav>

      <section className="hero container" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> FIND A PLACE TO CALL YOURS</div>
          <h1>Make room<br />for <span>what matters.</span></h1>
          <p className="hero-description">Find a home that feels like you. Thoughtfully chosen places, local expertise, and a smoother way to move forward.</p>
          <div className="hero-actions"><a className="button button-dark" href="#properties">Explore homes <span>↗</span></a><a className="text-link" href="#how-it-works">See how it works <span>↓</span></a></div>
          <div className="trust-row"><div className="avatar-stack"><span>JM</span><span>AK</span><span>OL</span><span>+</span></div><div><div className="stars">★★★★★</div><small>Loved by people finding their next chapter</small></div></div>
        </div>
        <div className="hero-visual">
          <div className="photo-frame"><div className="photo-wash" /><div className="image-caption"><span className="caption-dot" /> A slower kind of living <span className="caption-location">LAGOS, NIGERIA</span></div></div>
          <div className="floating-note"><span className="note-icon">⌂</span><div><b>Find your next chapter</b><small>One good place at a time</small></div><span className="note-arrow">↗</span></div>
          <div className="image-index">01 <span /> 04</div>
        </div>
      </section>

      <section className="search-wrap container" id="properties">
        <div className="search-card"><div className="search-field"><label>LOCATION</label><div><span className="field-icon">⌖</span> Where would you like to live?</div></div><div className="search-field"><label>PROPERTY TYPE</label><div>Any property <span className="chevron">⌄</span></div></div><div className="search-field"><label>PRICE RANGE</label><div>Set your budget <span className="chevron">⌄</span></div></div><button className="search-button" aria-label="Search properties">⌕</button></div>
        <div className="search-foot"><span>Thoughtful homes, for every kind of next.</span><span>SCROLL TO EXPLORE <b>↓</b></span></div>
      </section>

      <section className="stats container" id="about">{highlights.map((item) => <div className="stat" key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}<p>Good homes do more than give you a place to stay. They give you space to become.</p></section>
    </main>
  );
}
