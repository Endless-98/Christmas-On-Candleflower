import React, { useEffect, useState } from 'react';
import About from './About';
import Contact from './Contact';

function Home({ mapSrc }) {
  return (
    <section style={{marginTop: '1rem'}}>
      <p>
        Join us nightly for a festive display of lights, music, and holiday cheer. Our display runs every evening during December from dusk until 10pm.
      </p>

      <h2>Schedule</h2>
      <ul className="items">
        <li>Daily: Dusk — 10:00 PM</li>
      </ul>

      <h2 id="playlist">Now Playing</h2>
      <div className="now-playing">
        <div className="np-art" aria-hidden>
          🎵
        </div>
        <div className="np-info">
          <div className="np-track">No track playing</div>
          <div className="np-artist muted">Not connected</div>
        </div>
        <div className="np-actions">
          <a className="np-spotify muted" href="#" aria-disabled>Open in Spotify</a>
        </div>
      </div>

      <h2>Location</h2>
      <p className="muted">Candleflower neighborhood — see the embedded map for the exact spot.</p>

      <div className="map-wrapper" aria-hidden={!mapSrc}>
        {mapSrc ? (
          <iframe
            title="Candleflower location"
            src={mapSrc}
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="muted" style={{marginTop: '0.5rem'}}>
            Map is not configured. Set one of VITE_MAP_EMBED_URL, VITE_GOOGLE_MAPS_IFRAME_URL, or VITE_MAP_QUERY in the build environment.
          </div>
        )}
      </div>
    </section>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash || '#/';
    return hash.replace(/^#/, '') || '/';
  });
  const rawQuery = import.meta.env.VITE_MAP_QUERY || '';
  const encodedQuery = rawQuery ? encodeURIComponent(rawQuery) : '';

  // Priority: full embed URL (two supported names) -> API key + Embed API -> public q= fallback
    const rawEmbed = import.meta.env.VITE_MAP_EMBED_URL || import.meta.env.VITE_GOOGLE_MAPS_IFRAME_URL || '';
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    // Normalize embed URL: if a non-absolute value is provided, treat it as a query string and construct a Google Maps embed
    const normalizeEmbed = (val) => {
      if (!val) return '';
      const trimmed = String(val).trim();
      if (/^https?:\/\//i.test(trimmed)) return trimmed; // absolute URL OK
      // Treat as a raw query (address or place) and build a public embed
      return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`;
    };

    let mapSrc = '';
    if (rawEmbed) {
      mapSrc = normalizeEmbed(rawEmbed);
    } else if (apiKey && encodedQuery) {
      mapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedQuery}`;
    } else if (encodedQuery) {
      // Public (no API key) embed using maps?q=...&output=embed — less featured but works without API key
      mapSrc = `https://maps.google.com/maps?q=${encodedQuery}&output=embed`;
    } else {
      mapSrc = '';
    }
    useEffect(() => {
      const onHash = () => {
        const hash = window.location.hash || '#/';
        setRoute(hash.replace(/^#/, '') || '/');
      };
      window.addEventListener('hashchange', onHash);
      return () => window.removeEventListener('hashchange', onHash);
    }, []);

    return (
      <div className="container">
        <header>
          <div>
            <h1 className="site-title">
              <img src={`${import.meta.env.BASE_URL}assets/logo.png`} alt="Christmas On Candleflower" />
            </h1>
          </div>
          <nav aria-label="Primary">
            <a href="#/">Home</a>
            <a href="#/about">About</a>
            <a href="#/contact">Contact Us</a>
          </nav>
        </header>

        {route === '/about' && <About />}
        {route === '/contact' && <Contact />}
        {route === '/' && <Home mapSrc={mapSrc} />}
        {/* default fallback: home */}
        {(route !== '/' && route !== '/about' && route !== '/contact') && <Home mapSrc={mapSrc} />}
      </div>
    );
  }
