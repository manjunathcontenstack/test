import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Testimonials from '../components/Testimonials'
import Pricing from '../components/Pricing'
import CTA from '../components/CTA'

export default function Home(){
  return (
    <div>
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <CTA />
    </div>
  )
}
