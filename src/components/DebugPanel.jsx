import React, { useState, useEffect } from 'react'
import { fetchEntries, fetchCache } from '../contentstackClient'

export default function DebugPanel({ isOpen, onClose }) {
  const [debugData, setDebugData] = useState({})
  const [loading, setLoading] = useState(false)

  const loadDebugInfo = async () => {
    setLoading(true)
    try {
      const contentTypes = ['home_page', 'blog_post', 'about_page', 'services_page', 'contact_page']
      const results = {}
      
      for (const type of contentTypes) {
        try {
          const entries = await fetchEntries(type)
          results[type] = {
            success: true,
            count: entries?.length || 0,
            entries: entries?.map(e => ({
              uid: e.uid,
              title: e.title || 'No title',
              updated_at: e.updated_at,
              hasContent: checkHasContent(type, e)
            }))
          }
        } catch (err) {
          results[type] = {
            success: false,
            error: err.message
          }
        }
      }
      
      // Also try cache
      try {
        const cache = await fetchCache()
        results.cache_info = {
          available: !!cache,
          content_types: cache ? Object.keys(cache) : []
        }
      } catch (err) {
        results.cache_info = {
          available: false,
          error: err.message
        }
      }
      
      setDebugData(results)
    } catch (err) {
      console.error('Debug info failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkHasContent = (type, entry) => {
    if (type === 'home_page') {
      return !!(
        (entry.hero_title && entry.hero_title.trim()) ||
        (entry.features && entry.features.length > 0) ||
        (entry.statistics && Object.values(entry.statistics).some(v => v && v.trim()))
      )
    }
    if (type === 'blog_post') {
      return !!(entry.title && entry.title.trim())
    }
    if (type === 'about_page') {
      return !!(entry.hero_title && entry.hero_title.trim())
    }
    if (type === 'services_page') {
      return !!(entry.hero_title && entry.hero_title.trim())
    }
    if (type === 'contact_page') {
      return !!(entry.hero_title && entry.hero_title.trim())
    }
    return false
  }

  useEffect(() => {
    if (isOpen) {
      loadDebugInfo()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      zIndex: 2000,
      padding: '2rem',
      overflow: 'auto'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <h2>Contentstack Debug Panel</h2>
          <button onClick={onClose} style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Close
          </button>
        </div>
        
        <button onClick={loadDebugInfo} disabled={loading} style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? 'Loading...' : 'Refresh Debug Info'}
        </button>

        {Object.keys(debugData).length > 0 && (
          <div>
            <h3>Content Types Status:</h3>
            {Object.entries(debugData).map(([type, info]) => (
              <div key={type} style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}>
                <h4 style={{
                  color: info.success ? '#28a745' : '#dc3545',
                  margin: '0 0 0.5rem 0'
                }}>
                  {type} {info.success ? '✓' : '✗'}
                </h4>
                
                {info.success ? (
                  <div>
                    <p><strong>Count:</strong> {info.count} entries</p>
                    {info.entries && info.entries.length > 0 && (
                      <div>
                        <strong>Entries:</strong>
                        <ul style={{margin: '0.5rem 0', paddingLeft: '2rem'}}>
                          {info.entries.map(entry => (
                            <li key={entry.uid} style={{
                              marginBottom: '0.5rem',
                              color: entry.hasContent ? '#28a745' : '#ffc107'
                            }}>
                              <strong>UID:</strong> {entry.uid}<br/>
                              <strong>Title:</strong> {entry.title}<br/>
                              <strong>Updated:</strong> {new Date(entry.updated_at).toLocaleDateString()}<br/>
                              <strong>Has Content:</strong> {entry.hasContent ? 'Yes' : 'No'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{color: '#dc3545'}}><strong>Error:</strong> {info.error}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

