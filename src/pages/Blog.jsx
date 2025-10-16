import React, { useEffect, useState } from 'react'
import { fetchEntries } from '../contentstackClient'
import { Link } from 'react-router-dom'

export default function Blog(){
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      try {
        const entries = await fetchEntries('blog_post')
        setPosts(entries || [])
      } catch (err) {
        console.warn('Failed to fetch blog posts:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()

    // Listen for content updates
    const handleContentUpdate = () => {
      loadPosts()
    }

    window.addEventListener('cs:data-updated', handleContentUpdate)
    return () => window.removeEventListener('cs:data-updated', handleContentUpdate)
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="container" style={{padding:'2rem 0'}}>
      <h1>Blog</h1>
      {loading && <p>Loading posts...</p>}
      {!loading && posts.length === 0 && <p>No posts found. Check your Contentstack configuration.</p>}
      <div className="posts-grid" style={{display:'grid', gap:20, gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))'}}>
        {posts.map(p => (
          <article key={p.uid} className="card">
            {p.featured_image && p.featured_image.url && (
              <img 
                src={p.featured_image.url} 
                alt={p.featured_image.title || p.title}
                style={{width: '100%', height: '200px', objectFit: 'cover', marginBottom: '1rem'}}
              />
            )}
            <h3>{p.title}</h3>
            <p>{p.summary || p.description || 'No summary available'}</p>
            {p.author && (
              <p style={{fontSize: '0.9em', color: '#666'}}>
                By {p.author} {p.created && `• ${formatDate(p.created)}`}
              </p>
            )}
            {p.category && (
              <span style={{
                display: 'inline-block',
                background: '#f0f0f0',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.8em',
                marginBottom: '1rem'
              }}>
                {p.category}
              </span>
            )}
            <br />
            <Link to={`/blog/${p.uid}`} className="button">Read More</Link>
          </article>
        ))}
      </div>
    </div>
  )
}
