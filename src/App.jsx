import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Post from './pages/Post'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Login from './pages/Login'
import syncManager from '../contentstack-sync'

export default function App(){
  useEffect(() => {
  
    const initializeSync = async () => {
      try {
        await syncManager.initialize()
      } catch (err) {
        console.warn('Sync initialization failed:', err)
      }
    }

    initializeSync()

    // Listen for sync updates
    const handleSyncUpdate = (event) => {
      console.log('Content updated:', event.detail)
    }

    window.addEventListener('cs:data-updated', handleSyncUpdate)
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('cs:data-updated', handleSyncUpdate)
    }
  }, [])

  return (
    <div className="app-root">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:uid" element={<Post />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
//end