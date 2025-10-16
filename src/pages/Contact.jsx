import React, { useEffect, useState } from 'react'
import { fetchEntries } from '../contentstackClient'

export default function Contact() {
  const [contactData, setContactData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadContactData() {
      try {
        const entries = await fetchEntries('contact_page')
        if (entries && entries.length > 0) {
          // Sort by updated_at to get the most recent
          const sortedEntries = entries.sort((a, b) => {
            const dateA = new Date(a.updated_at || a.created_at)
            const dateB = new Date(b.updated_at || b.created_at)
            return dateB - dateA
          })
          setContactData(sortedEntries[0])
        }
      } catch (err) {
        console.warn('Failed to fetch contact data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadContactData()

    const handleContentUpdate = () => {
      loadContactData()
    }

    window.addEventListener('cs:data-updated', handleContentUpdate)
    return () => window.removeEventListener('cs:data-updated', handleContentUpdate)
  }, [])

  // Fallback data
  const fallbackData = {
    hero_title: "Let's Start a Conversation",
    hero_subtitle: "Whether you have questions about features, pricing, or need technical support, we're here to help.",
    hero_badge: "Get in Touch",
    office_title: "Our Office",
    office_address: "123 Innovation Drive, Suite 500\nSan Francisco, CA 94107\nUnited States",
    office_phone: "+1 (415) 555-1234",
    office_hours: "Monday - Friday: 9:00 AM - 6:00 PM PST\nSaturday - Sunday: Closed",
    contact_options: [
      {
        title: "Email Us",
        description: "For general inquiries and support",
        link_text: "support@contentstack.com",
        link_url: "mailto:support@contentstack.com"
      },
      {
        title: "Sales Inquiries",
        description: "Interested in our platform?",
        link_text: "sales@contentstack.com", 
        link_url: "mailto:sales@contentstack.com"
      },
      {
        title: "Support",
        description: "Need technical assistance?",
        link_text: "Visit Help Center",
        link_url: "#"
      }
    ],
    faqs: [
      {
        question: "How quickly can I get started?",
        answer: "You can sign up for a free trial and start using Contentstack immediately. Our onboarding process takes just a few minutes."
      },
      {
        question: "Do you offer custom pricing?",
        answer: "Yes, we offer customized enterprise plans based on your specific needs. Contact our sales team for a personalized quote."
      },
      {
        question: "What kind of support do you provide?",
        answer: "We offer 24/7 email support, dedicated account managers for enterprise clients, and extensive documentation and tutorials."
      },
      {
        question: "Can I migrate from my current CMS?",
        answer: "Absolutely! We provide migration tools and services to help you seamlessly transition from your existing CMS to Contentstack."
      }
    ]
  }

  const data = contactData || fallbackData

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero-section contact-hero">
        <div className="hero-background">
          <div className="hero-gradient" />
          <div className="hero-pattern" />
        </div>
        <div className="hero-content">
          <span className="hero-badge">{data.hero_badge}</span>
          <h1 className="hero-title">{data.hero_title}</h1>
          <p className="hero-subtitle">{data.hero_subtitle}</p>
        </div>
      </section>

      {/* Contact Options */}
      {data.contact_options && data.contact_options.length > 0 && (
        <section className="contact-options-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Get in Touch</h2>
            </div>
            <div className="contact-options-grid">
              {data.contact_options.map((option, index) => (
                <div key={option._metadata?.uid || index} className="contact-option-card">
                  <div className="contact-option-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                  <a href={option.link_url} className="contact-link">
                    {option.link_text}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Office Information */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-details">
              <h2>{data.office_title}</h2>
              <div className="contact-detail-item">
                <h3>📍 Address</h3>
                <p style={{whiteSpace: 'pre-line'}}>{data.office_address}</p>
              </div>
              <div className="contact-detail-item">
                <h3>📞 Phone</h3>
                <p>
                  <a href={`tel:${data.office_phone}`} className="contact-link">
                    {data.office_phone}
                  </a>
                </p>
              </div>
              <div className="contact-detail-item">
                <h3>🕒 Hours</h3>
                <p style={{whiteSpace: 'pre-line'}}>{data.office_hours}</p>
              </div>
              <div className="map-placeholder">
                <svg width="100%" height="200" viewBox="0 0 400 200">
                  <rect width="400" height="200" fill="var(--gray-100)"/>
                  <text x="200" y="100" textAnchor="middle" fill="var(--gray-500)">Interactive Map</text>
                </svg>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="contact-form-container">
              <h2>Send us a Message</h2>
              <p className="form-description">We'd love to hear from you. Drop us a line and we'll get back to you as soon as possible.</p>
              <form>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" placeholder="Your Name" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input type="text" placeholder="How can we help?" />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea rows="5" placeholder="Tell us more about your project..."></textarea>
                </div>
                <div className="form-checkbox">
                  <input type="checkbox" id="newsletter" />
                  <label htmlFor="newsletter">I'd like to receive updates about new features and content.</label>
                </div>
                <button type="submit" className="cta-button primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      {data.faqs && data.faqs.length > 0 && (
        <section className="faq-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Frequently Asked Questions</h2>
            </div>
            <div className="faq-grid">
              {data.faqs.map((faq, index) => (
                <div key={faq._metadata?.uid || index} className="faq-item">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {loading && (
        <div className="loading-indicator" style={{textAlign: 'center', padding: '2rem'}}>
          Loading contact information...
        </div>
      )}
    </div>
  )
}

