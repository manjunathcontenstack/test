import React from 'react'

export default function CTA(){
  return (
    <section className="cta-section" id="demo">
      <div className="container">
        <div className="cta-content">
          <h2>Ready to Transform Your Digital Experience?</h2>
          <p>Join thousands of brands that trust Contentstack to power their digital presence.</p>
          <div className="cta-buttons">
            <a href="/contact" className="cta-button primary">Get Started Free</a>
            <a href="/contact" className="cta-button secondary">Talk to Sales</a>
          </div>
          <p className="cta-note">No credit card required • 14-day free trial</p>
        </div>
      </div>
    </section>
  )
}
