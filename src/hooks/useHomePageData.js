// Shared hook for home page data to avoid duplicate fetching
import { useState, useEffect } from 'react'
import { fetchEntries } from '../contentstackClient'

let cachedHomePageData = null
let loadingPromise = null

export function useHomePageData() {
  const [homePageData, setHomePageData] = useState(cachedHomePageData)
  const [loading, setLoading] = useState(!cachedHomePageData)

  useEffect(() => {
    async function loadHomePageData() {
      // If we already have a loading promise, wait for it
      if (loadingPromise) {
        try {
          const data = await loadingPromise
          setHomePageData(data)
          setLoading(false)
          return
        } catch (err) {
          console.warn('Failed to load cached home page data:', err)
        }
      }

      // If we already have cached data, use it
      if (cachedHomePageData) {
        setHomePageData(cachedHomePageData)
        setLoading(false)
        return
      }

      // Create new loading promise
      loadingPromise = fetchHomePageData()
      
      try {
        const data = await loadingPromise
        cachedHomePageData = data
        setHomePageData(data)
      } catch (err) {
        console.warn('Failed to fetch home page data:', err)
        setHomePageData(null)
      } finally {
        setLoading(false)
        loadingPromise = null
      }
    }

    loadHomePageData()

    // Listen for content updates
    const handleContentUpdate = () => {
      // Clear cache and reload
      cachedHomePageData = null
      loadingPromise = null
      setLoading(true)
      loadHomePageData()
    }

    window.addEventListener('cs:data-updated', handleContentUpdate)
    return () => window.removeEventListener('cs:data-updated', handleContentUpdate)
  }, [])

  return { homePageData, loading }
}

async function fetchHomePageData() {
  try {
    const entries = await fetchEntries('home_page')
    
    if (!entries || entries.length === 0) {
      return null
    }

    // Sort by updated_at to get the most recent entry
    const sortedEntries = entries.sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at)
      const dateB = new Date(b.updated_at || b.created_at)
      return dateB - dateA // Most recent first
    })

    // Find the entry with actual content (not empty fields)
    let entryWithContent = sortedEntries.find(entry => {
      // Check if hero fields have content
      const hasHeroContent = (entry.hero_title && entry.hero_title.trim() !== '') ||
                             (entry.hero_subtitle && entry.hero_subtitle.trim() !== '') ||
                             (entry.hero_badge && entry.hero_badge.trim() !== '')
      
      // Check if features array has content
      const hasFeaturesContent = entry.features && Array.isArray(entry.features) && entry.features.length > 0
      
      // Check if statistics object has content
      const hasStatsContent = entry.statistics && 
                              typeof entry.statistics === 'object' && 
                              Object.values(entry.statistics).some(val => val && val.toString().trim() !== '')
      
      // Check if CTA text exists
      const hasCTAContent = (entry.cta_primary_text && entry.cta_primary_text.trim() !== '') ||
                            (entry.cta_secondary_text && entry.cta_secondary_text.trim() !== '')
      
      return hasHeroContent || hasFeaturesContent || hasStatsContent || hasCTAContent
    })

    // If no entry with content found, prefer the one with most recent update
    if (!entryWithContent) {
      console.warn('No home_page entry with content found, using most recent:', sortedEntries[0])
      entryWithContent = sortedEntries[0]
    } else {
      console.log('Found home_page entry with content:', entryWithContent.uid)
    }

    return entryWithContent
  } catch (err) {
    console.error('Error fetching home page data:', err)
    throw err
  }
}
