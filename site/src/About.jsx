import React from 'react';

export default function About() {
  return (
    <section style={{marginTop: '1rem'}}>
      <h2>About Christmas on Candleflower</h2>
      <p style={{fontSize: '1.1rem', marginBottom: '2rem'}}>
        A magical neighborhood tradition that brings joy, music, and community together every December.
      </p>
      
      <div className="about-grid">
        <div className="about-card">
          <div className="card-icon">🎄</div>
          <h3>Our Story</h3>
          <p>
            Christmas on Candleflower started as a simple idea to spread holiday cheer in our neighborhood. 
            What began as a few lights has grown into a beloved community tradition that brings families 
            together every December.
          </p>
        </div>
        
        <div className="about-card">
          <div className="card-icon">🎵</div>
          <h3>The Experience</h3>
          <p>
            Our synchronized light display features carefully selected Christmas music that creates 
            a magical atmosphere. Each song is timed perfectly with our lights to create an 
            unforgettable holiday experience.
          </p>
        </div>
        
        <div className="about-card">
          <div className="card-icon">🏘️</div>
          <h3>Community Spirit</h3>
          <p>
            We believe Christmas is about bringing people together. Our show is completely free 
            and designed to create moments of joy for families, couples, and neighbors of all ages.
          </p>
        </div>
        
        <div className="about-card">
          <div className="card-icon">✨</div>
          <h3>Behind the Magic</h3>
          <p>
            Our display is lovingly maintained by volunteers who donate their time to keep the 
            magic alive. From setup to daily maintenance, it's a true labor of love for our community.
          </p>
        </div>
      </div>
      
      <div className="about-footer">
        <div className="footer-card">
          <h3>🕐 Show Times</h3>
          <p>Every evening in December from <strong>dusk until 10:00 PM</strong></p>
          <p className="muted">Weather permitting • Free for all to enjoy</p>
        </div>
        
        <div className="footer-card">
          <h3>📍 Visit Us</h3>
          <p>Located in the beautiful Candleflower neighborhood</p>
          <p className="muted">Check our <a href="#/">home page</a> for the exact location</p>
        </div>
      </div>
    </section>
  );
}
