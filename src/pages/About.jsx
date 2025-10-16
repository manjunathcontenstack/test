import React, { useEffect, useState } from 'react'
import { fetchEntries } from '../contentstackClient'

export default function About() {
  const [aboutData, setAboutData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAboutData() {
      try {
        const entries = await fetchEntries('about_page')
        if (entries && entries.length > 0) {
          // Sort by updated_at to get the most recent
          const sortedEntries = entries.sort((a, b) => {
            const dateA = new Date(a.updated_at || a.created_at)
            const dateB = new Date(b.updated_at || b.created_at)
            return dateB - dateA
          })
          setAboutData(sortedEntries[0])
        }
      } catch (err) {
        console.warn('Failed to fetch about data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAboutData()

    const handleContentUpdate = () => {
      loadAboutData()
    }

    window.addEventListener('cs:data-updated', handleContentUpdate)
    return () => window.removeEventListener('cs:data-updated', handleContentUpdate)
  }, [])

  // Fallback data
  const fallbackData = {
    hero_title: "Building the Future of Content",
    hero_subtitle: "We're on a mission to help businesses create, manage, and deliver exceptional digital experiences through innovative content technology.",
    hero_badge: "Our Story",
    mission_section: {
      mission_title: "Empowering Digital Innovation",
      mission_description: "At Contentstack, we believe that content is the foundation of every digital experience.",
      mission_extended: "We're building more than just a CMS – we're creating a composable digital experience platform."
    },
    values: [
      {
        title: "Innovation First",
        description: "We constantly push boundaries to deliver cutting-edge solutions."
      },
      {
        title: "Customer Success", 
        description: "Your success is our success. We're committed to providing exceptional support."
      },
      {
        title: "Collaboration",
        description: "Great things happen when teams work together."
      }
    ],
    stats: {
      customers: "500+",
      customers_label: "Enterprise Customers",
      countries: "150+", 
      countries_label: "Countries Served",
      uptime: "99.9%",
      uptime_label: "Platform Uptime"
    }
  }

  const data = aboutData || fallbackData

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section about-hero">
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

      {/* Mission Section */}
      {data.mission_section && (
        <section className="mission-section" style={{paddingBottom: 'var(--space-xl)'}}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{data.mission_section.mission_title}</h2>
              <p className="section-subtitle">{data.mission_section.mission_description}</p>
              <div style={{marginTop: 'var(--space-xl)'}}>
                <p className="section-subtitle-text">{data.mission_section.mission_extended}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {data.stats && (
        <section className="page-section" style={{paddingTop: 'var(--space-xl)'}}>
          <div className="container">
            <div className="mission-stats">
              <div className="stat-card">
                <h3>{data.stats.customers}</h3>
                <p>{data.stats.customers_label}</p>
              </div>
              <div className="stat-card">
                <h3>{data.stats.countries}</h3>
                <p>{data.stats.countries_label}</p>
              </div>
              <div className="stat-card">
                <h3>{data.stats.uptime}</h3>
                <p>{data.stats.uptime_label}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      {data.values && data.values.length > 0 && (
        <section className="values-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Values</h2>
            </div>
            <div className="values-grid">
              {data.values.map((value, index) => (
                <div key={value._metadata?.uid || index} className="value-card">
                  <div className="value-icon">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                      {index === 0 ? (
                        // Innovation First - Lightbulb icon
                        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
                      ) : index === 1 ? (
                        // Customer Success - Heart icon
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      ) : (
                        // Collaboration - Simple people/team icon
                        <path d="M12 12.75c1.63 0 3.07.39 4.24.9c1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73C8.93 13.14 10.37 12.75 12 12.75zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2S2.9 13 4 13zM5.13 14.1C4.76 14.04 4.39 14 4 14c-.99 0-1.93.21-2.78.58C.48 14.9 0 15.62 0 16.43V18h4.5v-1.61C4.5 15.56 4.73 14.78 5.13 14.1zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2S18.9 13 20 13zM24 16.43c0-.81-.48-1.53-1.22-1.85C21.93 14.21 20.99 14 20 14c-.39 0-.76.04-1.13.1c.4.68.63 1.46.63 2.29V18H24V16.43zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3S10.34 6 12 6z"/>
                      )}
                    </svg>
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {data.team_members && data.team_members.length > 0 && (
        <section className="team-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Team</h2>
            </div>
            <div className="team-grid">
              {data.team_members.map((member, index) => (
                <div key={member._metadata?.uid || index} className="team-card">
                  <div className="team-image">
                    <div className="avatar-placeholder" style={{background: `linear-gradient(135deg, var(--primary-purple) 0%, var(--secondary-purple) 100%)`}}>
                      {member.name?.split(' ').map(n => n[0]).join('') || 'TM'}
                    </div>
                  </div>
                  <h3>{member.name}</h3>
                  <div className="team-role">{member.role}</div>
                  <p className="team-bio">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {loading && (
        <div className="loading-indicator" style={{textAlign: 'center', padding: '2rem'}}>
          Loading about content...
        </div>
      )}
    </div>
  )
}

