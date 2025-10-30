import React, { useEffect, useState } from 'react';
import About from './About';
import Contact from './Contact';
import Playlist from './Playlist';

function Home({ mapSrc }) {
  return (
    <section style={{marginTop: '0.5rem'}}>
      <p style={{marginBottom: '1rem', fontSize: '0.95rem', lineHeight: '1.4'}}>
        Join us nightly for a festive display of lights, music, and holiday cheer. Our display runs every evening during December from dusk until 10pm.
      </p>

      <div className="home-grid">
        <div className="home-section">
          <h3 style={{marginTop: 0, marginBottom: '0.5rem', fontSize: '1.1rem'}}>🗓️ Schedule</h3>
          <ul className="items-compact">
            <li>Daily: Dusk — 10:00 PM</li>
          </ul>
        </div>

        <div className="home-section">
          <h3 style={{marginTop: 0, marginBottom: '0.5rem', fontSize: '1.1rem'}}>🎵 Now Playing</h3>
          <div className="now-playing-compact">
            <div className="np-art-compact" aria-hidden>
              🎵
            </div>
            <div className="np-info-compact">
              <div className="np-track-compact">No track playing</div>
              <div className="np-artist-compact muted">Not connected</div>
            </div>
            <div className="np-actions-compact">
              <a className="np-spotify-compact muted" href="#" aria-disabled>Spotify</a>
            </div>
          </div>
        </div>
      </div>

      <div className="location-section">
        <h3 style={{marginTop: '1rem', marginBottom: '0.5rem', fontSize: '1.1rem'}}>📍 Location</h3>
        <p className="muted" style={{fontSize: '0.85rem', marginBottom: '0.5rem'}}>{import.meta.env.VITE_MAP_QUERY}</p>

        <div className="map-wrapper-compact" aria-hidden={!mapSrc}>
          {mapSrc ? (
            <iframe
              title="Candleflower location"
              src={mapSrc}
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="muted" style={{marginTop: '0.5rem', fontSize: '0.85rem'}}>
              Map is not configured. Set one of VITE_MAP_EMBED_URL, VITE_GOOGLE_MAPS_IFRAME_URL, or VITE_MAP_QUERY in the build environment.
            </div>
          )}
        </div>
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

    // On mobile browsers (Chrome) the visual viewport can shift when the URL/search
    // chrome shows/hides, causing the page content to move relative to the fixed
    // background. Use the Visual Viewport API (when available) to nudge the
    // background pseudo-element so it stays visually aligned with the page content.
    useEffect(() => {
      const vv = window.visualViewport;
      if (!vv) return undefined;

      const applyOffset = () => {
        // Two ways mobile browsers report UI shifts:
        // 1) offsetTop changes (distance between layout and visual viewport top)
        // 2) pageTop diverges from window.scrollY while the chrome animates
        // We want the background to move in the SAME direction as the content shift.
        // That means applying a POSITIVE translateY equal to the visual viewport's
        // top offset relative to the layout viewport.
        let offsetPx = 0;
        if (typeof vv.offsetTop === 'number' && vv.offsetTop !== 0) {
          offsetPx = vv.offsetTop;
        } else if (typeof vv.pageTop === 'number') {
          offsetPx = vv.pageTop - window.scrollY;
        }
        document.documentElement.style.setProperty('--vv-offset', `${offsetPx || 0}px`);
      };

      applyOffset();
      vv.addEventListener('resize', applyOffset);
      vv.addEventListener('scroll', applyOffset);
      // As a fallback, update on page scroll too
      window.addEventListener('scroll', applyOffset, { passive: true });

      return () => {
        vv.removeEventListener('resize', applyOffset);
        vv.removeEventListener('scroll', applyOffset);
        window.removeEventListener('scroll', applyOffset);
        document.documentElement.style.removeProperty('--vv-offset');
      };
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
            <a href="#/" className={route === '/' ? 'nav-link active' : 'nav-link'}>Home</a>
            <a href="#/about" className={route === '/about' ? 'nav-link active' : 'nav-link'}>About</a>
            <a href="#/playlist" className={route === '/playlist' ? 'nav-link active' : 'nav-link'}>Playlist</a>
            <a href="#/contact" className={route === '/contact' ? 'nav-link active' : 'nav-link'}>Contact Us</a>
          </nav>
        </header>

        {route === '/about' && <About />}
        {route === '/playlist' && <Playlist />}
        {route === '/contact' && <Contact />}
        {route === '/' && <Home mapSrc={mapSrc} />}
        {/* default fallback: home */}
        {(route !== '/' && route !== '/about' && route !== '/playlist' && route !== '/contact') && <Home mapSrc={mapSrc} />}
      </div>
    );
  }
