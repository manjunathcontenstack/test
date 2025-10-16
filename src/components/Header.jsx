import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function Header(){
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header>
      <div className="header-container">
        <div className="logo-container">
          <div className="logo-img">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="url(#gradient)"/>
              <path d="M12 10h16c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2z" fill="white"/>
              <path d="M12 22h16c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2z" fill="white"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6C2DD7"/>
                  <stop offset="100%" stopColor="#4A18A3"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="logo">Contentstack</div>
        </div>
        
        <nav className="main-nav">
          <ul className={`nav-links ${isMobileMenuOpen ? 'mobile' : ''}`}>
            <li><NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink></li>
            <li><NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''}>About</NavLink></li>
            <li><NavLink to="/services" className={({isActive}) => isActive ? 'active' : ''}>Services</NavLink></li>
            <li><NavLink to="/blog" className={({isActive}) => isActive ? 'active' : ''}>Blog</NavLink></li>
            <li><NavLink to="/contact" className={({isActive}) => isActive ? 'active' : ''}>Contact</NavLink></li>
            <li><NavLink to="/login" className={({isActive}) => isActive ? 'active' : ''}>Sign In</NavLink></li>
            <li><a href="/#demo" className="nav-cta">Get Started</a></li>
          </ul>
        </nav>
        
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}
