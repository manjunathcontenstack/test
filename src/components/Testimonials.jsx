import React from 'react'

export default function Testimonials(){
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Customer Success</span>
          <h2 className="section-title">Trusted by Leading Brands</h2>
          <p className="section-subtitle">See how companies around the world are building exceptional digital experiences with Contentstack.</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <blockquote>"Contentstack has transformed how we manage content across our global sites. The API-first approach gives us the flexibility we need."</blockquote>
              <div className="testimonial-author">
                <div className="author-info"><strong>Sarah Chen</strong><span>Head of Digital, TechCorp</span></div>
                <div className="company-logo">TC</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <blockquote>"The workflow engine and collaboration features have increased our content team's productivity by 300%."</blockquote>
              <div className="testimonial-author">
                <div className="author-info"><strong>Michael Rodriguez</strong><span>Content Manager, GlobalBrand</span></div>
                <div className="company-logo">GB</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <blockquote>"Scaling our content operations across 15 countries was seamless with Contentstack's multi-site capabilities."</blockquote>
              <div className="testimonial-author">
                <div className="author-info"><strong>Emma Thompson</strong><span>VP Marketing, InnovateCo</span></div>
                <div className="company-logo">IC</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
