import React, { useEffect, useState } from 'react'
import { fetchEntries } from '../contentstackClient'

export default function Services() {
  const [servicesData, setServicesData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadServicesData() {
      try {
        const entries = await fetchEntries('services_page')
        if (entries && entries.length > 0) {
          // Choose the entry with the richest content (then most recent)
          const score = (e) => {
            let s = 0
            if (e && typeof e === 'object') {
              if (e.hero_title) s += 1
              if (Array.isArray(e.main_features)) s += e.main_features.length * 10
              if (Array.isArray(e.additional_services)) s += e.additional_services.length * 5
              if (Array.isArray(e.integrations)) s += e.integrations.length
            }
            const date = new Date(e && (e.updated_at || e.created_at) || 0).getTime()
            return s * 100000 + date // prioritize richness, then recency
          }
          const best = [...entries].sort((a, b) => score(b) - score(a))[0]
          setServicesData(best)
        }
      } catch (err) {
        console.warn('Failed to fetch services data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadServicesData()

    const handleContentUpdate = () => {
      loadServicesData()
    }

    window.addEventListener('cs:data-updated', handleContentUpdate)
    return () => window.removeEventListener('cs:data-updated', handleContentUpdate)
  }, [])

  // Fallback data
  const fallbackData = {
    hero_title: "Platform Features",
    hero_subtitle: "From content creation to delivery, our comprehensive platform provides all the tools you need.",
    hero_badge: "Everything You Need in One Platform",
    main_features: [
      {
        title: "Headless CMS",
        description: "True API-first content management that gives you the freedom to build with any technology stack.",
        features: "RESTful & GraphQL APIs\nSDK support for all major frameworks\nFlexible content modeling"
      },
      {
        title: "Multi-Site Management",
        description: "Manage multiple websites, apps, and digital properties from a single platform.",
        features: "Centralized content hub\nSite-specific permissions\nCross-site content sharing"
      },
      {
        title: "Content Modeling",
        description: "Create rich, structured content with our flexible content modeling tools.",
        features: "Drag-and-drop content builder\nModular blocks & components\nCustom field types"
      }
    ],
    additional_services: [
      {
        title: "Global CDN",
        description: "Deliver content at lightning speed with our globally distributed CDN infrastructure."
      },
      {
        title: "Workflow Engine",
        description: "Create custom approval workflows with multi-stage reviews and notifications."
      },
      {
        title: "Personalization",
        description: "Deliver personalized content experiences based on user behavior and preferences."
      }
    ],
    integrations: [
      { name: "React" },
      { name: "Vue.js" },
      { name: "Angular" },
      { name: "Next.js" },
      { name: "Gatsby" },
      { name: "AWS" }
    ]
  }

  const data = servicesData || fallbackData

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="hero-section services-hero">
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

      {/* Main Features */}
      {data.main_features && data.main_features.length > 0 && (
        <section className="features-detail-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Core Features</h2>
            </div>
            <div className="features-advanced-grid">
              {data.main_features.map((feature, index) => (
                <div key={feature._metadata?.uid || index} className="feature-advanced-card">
                  <div className="feature-card-header">
                    <div className="feature-index-badge">{String(index + 1).padStart(2, '0')}</div>
                    <h3>{feature.title}</h3>
                  </div>
                  <p className="feature-description">{feature.description}</p>
                  {feature.features && (
                    <ul className="feature-list check">
                      {feature.features.split('\n').map((feat, i) => (
                        <li key={i}>{feat.replace(/^\\n|\\n$/g, '')}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Additional Services */}
      {data.additional_services && data.additional_services.length > 0 && (
        <section className="services-grid-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Additional Services</h2>
            </div>
            <div className="services-grid">
              {data.additional_services.map((service, index) => (
                <div key={service._metadata?.uid || index} className="service-card">
                  <div className="service-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      {index === 0 ? (
                        // Global CDN - Globe/Network icon
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      ) : index === 1 ? (
                        // Workflow Engine - Settings/Gear icon
                        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                      ) : (
                        // Personalization - User/Person icon
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      )}
                    </svg>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Integrations */}
      {data.integrations && data.integrations.length > 0 && (
        <section className="integrations-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Integrations</h2>
            </div>
            <div className="integrations-grid">
              {data.integrations.map((integration, index) => (
                <div key={integration._metadata?.uid || index} className="integration-logo">
                  {integration.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {loading && (
        <div className="loading-indicator" style={{textAlign: 'center', padding: '2rem'}}>
          Loading services content...
        </div>
      )}
    </div>
  )
}

