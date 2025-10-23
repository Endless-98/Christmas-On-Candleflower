import React from 'react';

export default function Contact() {
  return (
    <section style={{marginTop: '1rem'}}>
      <h2>Contact Us</h2>
      <p>
        For questions about the show or to request a song, please email us at
        {' '}
        <a href="mailto:contact@example.com">contact@example.com</a>.
      </p>
      <p className="muted">Please be respectful of show hours and our neighbors.</p>
    </section>
  );
}
