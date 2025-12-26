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
        mode: 'cors',
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
    <section style={{marginTop: '1rem'}}>
      <h2>💌 Get in Touch</h2>
      <p style={{fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6'}}>
        Questions, song requests, or feedback? We'd love to hear from you!
      </p>
      
      {submitStatus === 'success' && (
        <div className="alert-success">
          <div className="alert-icon">✨</div>
          <div className="alert-content">
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for reaching out! We'll get back to you soon if you provided an email address.</p>
          </div>
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="alert-error">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <h3>Oops! Something went wrong</h3>
            <p>We couldn't send your message. Please try again later or contact us directly.</p>
          </div>
        </div>
      )}

      <div className="contact-layout">
        <div className="contact-form-section">
          <form onSubmit={handleSubmit} className="modern-contact-form">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">
                  Name <span className="label-hint">(optional)</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your name"
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="email">
                  Email <span className="label-hint">(optional for replies)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div className="form-field">
              <label htmlFor="message">
                Message <span className="label-required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="form-textarea"
                placeholder="Share your experience, request a song, ask questions, or let us know how we can improve the show!"
                rows="7"
              ></textarea>
            </div>
            
            <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="btn-spinner"></span>
                  Sending...
                </>
              ) : (
                <>🎄 Send Message</>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
