// Contentstack sync configuration
export const syncConfig = {
  // Auto-sync interval in minutes
  autoSyncInterval: 5,
  
  // Content types to monitor for changes
  contentTypes: [
    'home_page',
    'blog_post', 
    'about_page',
    'services_page',
    'contact_page'
  ],
  
  // Sync options
  options: {
    // Enable debug logging
    debug: process.env.VITE_CS_DEBUG === 'true',
    
    // Max retries for failed syncs
    maxRetries: 3,
    
    // Retry delay in milliseconds
    retryDelay: 2000,
    
    // Enable fallback to cache if sync fails
    useCacheFallback: true,
    
    // Cache refresh interval in minutes
    cacheRefreshInterval: 30
  },
  
  // Environment-specific settings
  environments: {
    development: {
      autoSyncInterval: 2, // More frequent in dev
      debug: true
    },
    production: {
      autoSyncInterval: 10, // Less frequent in prod
      debug: false
    }
  }
}

// Get environment-specific config
export function getConfig(environment = 'development') {
  const baseConfig = { ...syncConfig }
  const envConfig = syncConfig.environments[environment] || {}
  
  return {
    ...baseConfig,
    ...envConfig,
    options: {
      ...baseConfig.options,
      ...envConfig.options
    }
  }
}

export default syncConfig
