// Enhanced Contentstack sync functionality for browser environment
import { startSync, performFullSync, startAutoSync, stopAutoSync } from './src/contentstackClient.js'

// Sync manager class to handle sync operations
class ContentstackSyncManager {
  constructor() {
    this.isInitialized = false
    this.lastSyncTime = null
    this.syncInProgress = false
  }

  // Initialize sync manager and start auto-sync
  async initialize() {
    if (this.isInitialized) return

    try {
      console.log('Initializing Contentstack sync manager...')
      
      // Perform initial sync
      await this.performInitialSync()
      
      // Start auto-sync every 5 minutes
      startAutoSync(5)
      
      this.isInitialized = true
      console.log('Contentstack sync manager initialized successfully')
      
      return true
    } catch (err) {
      console.error('Failed to initialize sync manager:', err)
      return false
    }
  }

  // Perform initial sync when app starts
  async performInitialSync() {
    try {
      this.syncInProgress = true
      const result = await performFullSync()
      this.lastSyncTime = new Date()
      
      console.log('Initial sync completed:', {
        itemsUpdated: result?.items?.length || 0,
        timestamp: this.lastSyncTime.toISOString()
      })
      
      return result
    } catch (err) {
      console.warn('Initial sync failed, falling back to cache:', err.message)
      return null
    } finally {
      this.syncInProgress = false
    }
  }

  // Manual sync trigger
  async triggerSync() {
    if (this.syncInProgress) {
      console.log('Sync already in progress, skipping...')
      return
    }

    try {
      this.syncInProgress = true
      const result = await performFullSync()
      this.lastSyncTime = new Date()
      
      console.log('Manual sync completed:', {
        itemsUpdated: result?.items?.length || 0,
        timestamp: this.lastSyncTime.toISOString()
      })
      
      return result
    } catch (err) {
      console.error('Manual sync failed:', err)
      throw err
    } finally {
      this.syncInProgress = false
    }
  }

  // Get sync status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      lastSyncTime: this.lastSyncTime,
      syncInProgress: this.syncInProgress
    }
  }

  // Stop all sync operations
  shutdown() {
    stopAutoSync()
    this.isInitialized = false
    console.log('Contentstack sync manager shut down')
  }
}

// Create global sync manager instance
const syncManager = new ContentstackSyncManager()

// Auto-initialize when module loads (in browser environment)
if (typeof window !== 'undefined') {
  // Wait a moment for app to be ready, then initialize
  setTimeout(() => {
    syncManager.initialize().catch(err => {
      console.warn('Auto-initialization of sync manager failed:', err.message)
    })
  }, 1000)
}

// Export sync manager for manual control
export default syncManager
export { ContentstackSyncManager }
