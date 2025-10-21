import React from 'react';

export default function App() {
  const rawQuery = import.meta.env.VITE_MAP_QUERY || '';
  const encodedQuery = rawQuery ? encodeURIComponent(rawQuery) : '';

  // Priority: full embed URL (two supported names) -> API key + Embed API -> public q= fallback
  const embedUrl = import.meta.env.VITE_MAP_EMBED_URL || import.meta.env.VITE_GOOGLE_MAPS_IFRAME_URL;
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  let mapSrc;
  if (embedUrl) {
    mapSrc = embedUrl;
  } else if (apiKey) {
    mapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedQuery}`;
  } else {
    // Public (no API key) embed using maps?q=...&output=embed — less featured but works without API key
    mapSrc = `https://maps.google.com/maps?q=${encodedQuery}&output=embed`;
  }

  return (
    <div className="container">
      <header>
        <h1>Christmas On Candleflower</h1>
        <p className="tag">A neighborhood Christmas light show — welcome!</p>
      </header>

      <section style={{marginTop: '1rem'}}>
        <p>
          Join us nightly for a festive display of lights, music, and holiday cheer. Our display runs every evening during December from dusk until 10pm.
        </p>

        <h2>Schedule</h2>
        <ul className="items">
          <li>Daily: Dusk — 10:00 PM</li>
        </ul>

  <h2>Location</h2>
  <p className="muted">Location: {import.meta.env.VITE_MAP_QUERY}</p>

        <div className="map-wrapper" aria-hidden={false}>
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
        </div>
      </section>
    </div>
  );
}
