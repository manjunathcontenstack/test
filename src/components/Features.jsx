import React from 'react'
import { useHomePageData } from '../hooks/useHomePageData'

export default function Features(){
  const { homePageData, loading } = useHomePageData()

  // Fallback features data
  const fallbackFeatures = [
    {
      title: "Lightning Fast",
      description: "Deliver content at blazing speeds with our global CDN and optimized API architecture.",
      icon: "lightning"
    },
    {
      title: "Headless Architecture", 
      description: "True API-first approach that lets you build with any framework or technology stack.",
      icon: "layers"
    },
    {
      title: "Multi-Channel Publishing",
      description: "Publish once, distribute everywhere. Web, mobile, IoT, and beyond.", 
      icon: "grid"
    }
  ]

  const features = homePageData?.features?.length > 0 ? homePageData.features : fallbackFeatures
  const featuresTitle = homePageData?.features_title || "Everything You Need for Content Management"
  const featuresSubtitle = homePageData?.features_subtitle || "A complete platform to manage, deliver, and optimize content across every digital touchpoint."

  const getIcon = (feature, index) => {
    // Use feature icon if available, otherwise use fallback icons
    const icons = {
      0: <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
      1: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
      2: <><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M3 9h18M9 3v18" stroke="currentColor" strokeWidth="2"/></>,
      3: <><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><path d="M12 1v6m0 6v6M23 12h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/></>,
      4: <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
      5: <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2"/></>
    }
    return icons[index % 6] || icons[0]
  }

  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Why Contentstack</span>
          <h2 className="section-title">{featuresTitle}</h2>
          <p className="section-subtitle">{featuresSubtitle}</p>
        </div>
        {loading && <div className="loading-indicator">Loading features...</div>}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={feature._metadata?.uid || index} className="feature-card-modern">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {getIcon(feature, index)}
                </svg>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
