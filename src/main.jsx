import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
// Import legacy site styles so React pages use the same design
import '/style.css'
import { startSync } from './contentstackClient'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// Start a background sync on app start. The sync token is persisted in localStorage
// so subsequent runs will perform incremental syncs.
try {
  // Run an initial sync and then poll periodically (every `SYNC_INTERVAL_MS`)
  const SYNC_INTERVAL_MS = 2 * 60 * 1000 // 2 minutes; adjust as needed

  async function doSync() {
    try {
      const res = await startSync();
      window.__cs_sync_result = res
      console.info('Contentstack sync completed:', {
        items: Array.isArray(res.items) ? res.items.length : undefined,
        sync_token: res.sync_token,
      })
    } catch (err) {
      console.warn('Sync error', err)
    }
  }

  // initial run
  doSync();

  // periodic polling
  const _interval = setInterval(doSync, SYNC_INTERVAL_MS);

  // listen for the broadcast event in case the sync helper uses HTTP fallback and dispatches
  window.addEventListener('cs:sync', (ev) => {
    try {
      const data = ev && ev.detail;
      // If there are items or a new sync token, reload to pick up new content.
      if (data && ((Array.isArray(data.items) && data.items.length) || data.sync_token)) {
        console.info('Contentstack: new content available, reloading page to pick up changes.');
        // You can replace this with a softer update (state refresh) if desired.
        window.location.reload();
      }
    } catch (e) {
      console.debug('cs:sync handler error', e);
    }
  });

  // cleanup on unload
  window.addEventListener('beforeunload', () => clearInterval(_interval));
} catch (e) {
  // ignore in non-browser env
}
