import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://eykveoan7cjc745m7twnh2hof40raaok.lambda-url.us-east-1.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Email send failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={{marginTop: '0.5rem'}}>
      <h2 style={{marginBottom: '0.5rem'}}>Get in Touch</h2>
      <p style={{fontSize: '1rem', marginBottom: '1rem', color: 'var(--muted)'}}>
        Questions, song requests, or feedback? We'd love to hear from you!
      </p>
      
      <div className="contact-form-wrapper-compact">
        <form onSubmit={handleSubmit} className="contact-form-compact">
          <div className="form-row">
            <div className="form-group-half">
              <label htmlFor="name">Name <span className="optional">(optional)</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="contact-input-compact"
                placeholder="Your name"
              />
            </div>
            
            <div className="form-group-half">
              <label htmlFor="email">Email <span className="optional">(optional)</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="contact-input-compact"
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          
          <div className="form-group-compact">
            <label htmlFor="message">Message <span className="required">*</span></label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="contact-textarea-compact"
              placeholder="Share your experience, request a song, or ask any questions! We'd love to hear from you!"
              rows="8"
            ></textarea>
          </div>
          
          <button type="submit" className="submit-btn-compact" disabled={isSubmitting}>
            {isSubmitting ? '✨ Sending...' : '🎄 Send Message'}
          </button>
        </form>

        {submitStatus === 'success' && (
          <div className="status-message success compact">
            ✅ Message sent! Thank you for reaching out!
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="status-message error compact">
            ❌ Failed to send. Please try again later.
          </div>
        )}

      </div>
    </section>
  );
}
