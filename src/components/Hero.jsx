import React from 'react'
import { useHomePageData } from '../hooks/useHomePageData'

export default function Hero(){
  const { homePageData: heroData, loading } = useHomePageData()

  // Fallback data if no content from Contentstack
  const fallbackData = {
    hero_badge: "Composable Digital Experience Platform",
    hero_title: "Build Digital Experiences That Scale", 
    hero_subtitle: "Power your websites, mobile apps, and digital products with a headless CMS that gives you the flexibility to innovate without limits.",
    statistics: {
      clients: "500+",
      clients_label: "Enterprise Clients", 
      uptime: "99.9%",
      uptime_label: "% Uptime SLA",
      api_calls: "50M+",
      api_calls_label: "API Calls Daily"
    }
  }

  const data = heroData || fallbackData

  return (
    <section className="hero-section modern-hero" id="hero-section">
      <div className="hero-background">
        <div className="hero-gradient" />
        <div className="hero-pattern" />
        <div className="hero-interactive-bg" />
        <div className="particles-container">
          {Array.from({length:9}).map((_,i)=>(<div key={i} className="particle" />))}
        </div>
      </div>
      <div className="hero-content">
        <span className="hero-badge">{data.hero_badge}</span>
        <h1 className="hero-title">{data.hero_title}</h1>
        <p className="hero-subtitle">{data.hero_subtitle}</p>
        <div className="hero-cta-group">
          <a href="#demo" className="hero-cta primary">{data.cta_primary_text || "Start Free Trial"}</a>
          <a href="#features" className="hero-cta secondary">{data.cta_secondary_text || "Explore Features"}</a>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number" data-count={data.statistics?.clients?.replace(/\D/g, '') || "500"}>
              {data.statistics?.clients || "500+"}
            </span>
            <span className="stat-label">{data.statistics?.clients_label || "Enterprise Clients"}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" data-count={data.statistics?.uptime?.replace(/\D/g, '') || "99.9"}>
              {data.statistics?.uptime || "99.9%"}
            </span>
            <span className="stat-label">{data.statistics?.uptime_label || "Uptime SLA"}</span>
          </div>
          <div className="stat-item">
            <span className="stat-number" data-count={data.statistics?.api_calls?.replace(/\D/g, '') || "50"}>
              {data.statistics?.api_calls || "50M+"}
            </span>
            <span className="stat-label">{data.statistics?.api_calls_label || "API Calls Daily"}</span>
          </div>
        </div>
        {loading && <div className="loading-indicator">Loading content...</div>}
      </div>
    </section>
  )
}
