import React from 'react'

export default function Pricing(){
  return (
    <section className="pricing-section">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Pricing Plans</span>
          <h2 className="section-title">Choose Your Perfect Plan</h2>
          <p className="section-subtitle">Start free and scale as you grow. No hidden fees, no surprises.</p>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-header"><h3>Starter</h3><div className="pricing-price">Free<span>/month</span></div><p className="pricing-description">Perfect for personal projects and small teams getting started.</p></div>
            <ul className="pricing-features"><li>Up to 3 content types</li><li>100 API requests/month</li><li>2 team members</li><li>Community support</li><li>Basic workflows</li></ul>
            <a href="#demo" className="pricing-cta">Get Started Free</a>
          </div>

          <div className="pricing-card featured">
            <div className="pricing-header"><h3>Professional</h3><div className="pricing-price">$99<span>/month</span></div><p className="pricing-description">For growing businesses that need advanced features and better support.</p></div>
            <ul className="pricing-features"><li>Unlimited content types</li><li>1M API requests/month</li><li>10 team members</li><li>Priority support</li><li>Advanced workflows</li></ul>
            <a href="#demo" className="pricing-cta">Start Trial</a>
          </div>

          <div className="pricing-card">
            <div className="pricing-header"><h3>Enterprise</h3><div className="pricing-price">Custom<span>/month</span></div><p className="pricing-description">For large organizations with complex requirements and high-volume needs.</p></div>
            <ul className="pricing-features"><li>Unlimited everything</li><li>Unlimited API requests</li><li>Unlimited team members</li><li>24/7 dedicated support</li><li>Custom integrations</li></ul>
            <a href="/contact" className="pricing-cta">Contact Sales</a>
          </div>
        </div>
      </div>
    </section>
  )
}
