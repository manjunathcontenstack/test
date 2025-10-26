
import Contentstack from 'contentstack'

// Uses Vite env variables: VITE_CS_API_KEY, VITE_CS_DELIVERY_TOKEN, VITE_CS_ENV
const apiKey = import.meta.env.VITE_CS_API_KEY || ''
const deliveryToken = import.meta.env.VITE_CS_DELIVERY_TOKEN || ''
const environment = import.meta.env.VITE_CS_ENV || 'development'
const useCacheFallback = ((import.meta.env.VITE_USE_CACHE_FALLBACK || '') + '').toLowerCase() === 'true'

if (!apiKey || !deliveryToken) {
  console.warn('Warning: Contentstack API key or delivery token not provided. Set VITE_CS_API_KEY and VITE_CS_DELIVERY_TOKEN in .env file for dynamic content.');
}

const Stack = Contentstack.Stack({
  api_key: apiKey,
  delivery_token: deliveryToken,
  environment: environment,
})

/**
 * Generic helpers to fetch entries from the configured stack.
 * These helpers normalize common SDK response shapes into a simple array
 * of entries or a single entry object. They also fallback to a local
 * `cs_cache.json` (served at the project root) when CDN returns empty.
 */

async function fetchEntries(contentType, { limit = 100 } = {}) {
  console.debug(`Fetching entries for content type: ${contentType} (limit: ${limit})`);
  
  // Try using the SDK first (browser runtime)
  try {
    const Query = Stack.ContentType(contentType).Query();
    if (limit) Query.limit(limit);
    const res = await Query.toJSON().find();
    console.debug(`SDK response for ${contentType}:`, res);
    
    // SDK shapes vary; try common extraction patterns
    let entries = [];
    if (Array.isArray(res) && res.length && res[0].entries) entries = res[0].entries;
    else if (res && res.entries) entries = res.entries;
    else if (Array.isArray(res)) entries = res;
    
    if (entries && entries.length) {
      console.debug(`Found ${entries.length} entries for ${contentType} via SDK`);
      return entries;
    }
  } catch (err) {
    // SDK may error in some envs; fall through to HTTP CDN fetch
    console.debug('SDK fetchEntries failed, will try CDN/fallback:', err && err.message);
  }

  // Fallback: try the CDN entries endpoint directly (no-store + cache-bust)
  try {
    const ts = Date.now();
    const url = `https://cdn.contentstack.io/v3/content_types/${encodeURIComponent(contentType)}/entries?environment=${encodeURIComponent(environment)}&locale=en-us&limit=${encodeURIComponent(limit)}&ts=${ts}`;
    console.debug(`Trying CDN URL for ${contentType}:`, url);
    
    const resp = await fetch(url, {
      cache: 'no-store',
      headers: {
        api_key: apiKey,
        access_token: deliveryToken,
        'x-request-id': `req-${ts}`,
      },
    });
    
    if (resp.ok) {
      const json = await resp.json();
      console.debug(`CDN response for ${contentType}:`, json);
      
      if (json && Array.isArray(json.entries) && json.entries.length) {
        console.debug(`Found ${json.entries.length} entries for ${contentType} via CDN`);
        const pruned = pruneToVisibleContent(contentType, json.entries);
        return pruned.length ? pruned : json.entries;
      }
    } else {
      console.warn(`CDN request failed for ${contentType}:`, resp.status, resp.statusText);
    }
  } catch (err) {
    console.debug('CDN fetch failed for', contentType, err && err.message);
  }

  // Final fallback: try local cache file served from project root: /cs_cache.json
  if (useCacheFallback) {
    try {
      if (typeof window !== 'undefined' && window.location) {
        console.debug(`Trying cache fallback for ${contentType}`);
        const r = await fetch('/cs_cache.json', { cache: 'no-store' });
        if (r && r.ok) {
          const cache = await r.json();
          console.debug(`Cache content for ${contentType}:`, cache[contentType]);
          
          if (cache && Array.isArray(cache[contentType]) && cache[contentType].length) {
            console.debug(`Found ${cache[contentType].length} entries for ${contentType} in cache`);
            const pruned = pruneToVisibleContent(contentType, cache[contentType]);
            return pruned.length ? pruned : cache[contentType];
          }
        }
      }
    } catch (err) {
      console.debug('Local cache fetch failed', err && err.message);
    }
  }

  // Return empty array if nothing found
  return [];
}

async function fetchEntryByUID(contentType, uid) {
  try {
    const entry = await Stack.ContentType(contentType).Entry(uid).fetch();
    if (entry && typeof entry.toJSON === 'function') return entry.toJSON();
    return entry;
  } catch (err) {
    // Try CDN single-entry endpoint
    try {
      const ts = Date.now();
      const url = `https://cdn.contentstack.io/v3/content_types/${encodeURIComponent(contentType)}/entries/${encodeURIComponent(uid)}?environment=${encodeURIComponent(environment)}&locale=en-us&ts=${ts}`;
      const resp = await fetch(url, { cache: 'no-store', headers: { api_key: apiKey, access_token: deliveryToken, 'x-request-id': `req-${ts}` } });
      if (resp.ok) {
        const json = await resp.json();
        if (json && json.entry) return json.entry;
      }
    } catch (e) {
      console.debug('CDN entry fetch failed', e && e.message);
    }
    // Final fallback: try local cache file served from project root: /cs_cache.json
    if (useCacheFallback) {
      try {
        if (typeof window !== 'undefined' && window.location) {
          const r = await fetch('/cs_cache.json', { cache: 'no-store' });
          if (r && r.ok) {
            const cache = await r.json();
            const list = cache && cache[contentType];
            if (Array.isArray(list)) {
              const found = list.find((e) => e && e.uid === uid);
              if (found) return found;
            }
          }
        }
      } catch (e) {
        console.debug('Local cache entry fetch failed', e && e.message);
      }
    }
    throw err;
  }
}

// Utility: prefer entries with actual visible content instead of blank scaffolds
function pruneToVisibleContent(contentType, entries) {
  try {
    return (entries || []).filter((e) => hasVisibleContent(contentType, e));
  } catch {
    return entries || [];
  }
}

function nonEmptyString(v) {
  return typeof v === 'string' && v.trim() !== ''
}

function hasVisibleContent(contentType, e) {
  if (!e || typeof e !== 'object') return false
  // Generic signals
  if (nonEmptyString(e.title)) return true
  if (Array.isArray(e.features) && e.features.length) return true

  switch (contentType) {
    case 'blog_post': {
      if (nonEmptyString(e.summary) || nonEmptyString(e.description)) return true
      const b = e.body
      if (typeof b === 'string' && nonEmptyString(b)) return true
      if (b && typeof b === 'object') {
        if (nonEmptyString(b.html)) return true
        const nodes = Array.isArray(b.children) ? b.children : (Array.isArray(b.content) ? b.content : [])
        return Array.isArray(nodes) && nodes.some(n => (n && (n.text && nonEmptyString(n.text))))
      }
      return false
    }
    case 'about_page': {
      return nonEmptyString(e.hero_title) || (Array.isArray(e.values) && e.values.length) || (e.stats && (nonEmptyString(e.stats.customers) || nonEmptyString(e.stats.uptime)))
    }
    case 'services_page': {
      return (Array.isArray(e.main_features) && e.main_features.length) || (Array.isArray(e.additional_services) && e.additional_services.length)
    }
    case 'contact_page': {
      return nonEmptyString(e.hero_title) || (Array.isArray(e.contact_options) && e.contact_options.length)
    }
    default:
      return true
  }
}


/**
 * Sync helpers
 * - Tries the SDK sync() on browser runtime.
 * - Falls back to calling the CDN sync HTTP endpoint.
 * - Persists the `sync_token` in localStorage under `cs_sync_token`.
 */

function getStoredSyncToken() {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem('cs_sync_token');
  } catch (e) {
    return null;
  }
}

function setStoredSyncToken(token) {
  try {
    if (typeof localStorage === 'undefined') return;
    if (!token) return localStorage.removeItem('cs_sync_token');
    localStorage.setItem('cs_sync_token', token);
  } catch (e) {
    // ignore localStorage errors
  }
}

async function startSync({ onProgress } = {}) {
  // Prefer SDK sync in browser
  try {
    if (typeof window !== 'undefined' && typeof Stack.sync === 'function') {
      const token = getStoredSyncToken();
      const syncQuery = token ? { sync_token: token } : { init: true };
      const res = await Stack.sync().query(syncQuery).find();
      if (res && res.sync_token) setStoredSyncToken(res.sync_token);
      if (typeof onProgress === 'function') onProgress(res);
      return res;
    }
  } catch (err) {
    console.debug('SDK startSync failed, falling back to CDN HTTP sync', err && err.message);
  }

  // Fallback to CDN HTTP sync endpoint
  try {
    const token = getStoredSyncToken();
    const params = token ? `sync_token=${encodeURIComponent(token)}` : 'init=true';
    const url = `https://cdn.contentstack.io/v3/sync?${params}&environment=${encodeURIComponent(environment)}&locale=en-us`;
    const resp = await fetch(url, { headers: { api_key: apiKey, access_token: deliveryToken } });
    const data = await resp.json();
    if (data && data.sync_token) setStoredSyncToken(data.sync_token);
    if (typeof onProgress === 'function') onProgress(data);
    // Emit a global browser event so the app can react to syncs
    try {
      if (typeof window !== 'undefined' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('cs:sync', { detail: data }));
      }
    } catch (e) {
      // ignore
    }
    return data;
  } catch (err) {
    console.error('Contentstack sync (HTTP fallback) failed', err && err.message);
    throw err;
  }
}

// Lightweight helper to fetch the local cache file (if present)
async function fetchCache() {
  try {
    if (typeof window === 'undefined') return null;
    const r = await fetch('/cs_cache.json');
    if (!r.ok) return null;
    return await r.json();
  } catch (e) {
    return null;
  }
}

// Enhanced sync functionality with better error handling and caching integration
async function performFullSync() {
  try {
    const syncResult = await startSync();
    
    // Update cache after successful sync
    if (syncResult && syncResult.items && syncResult.items.length > 0) {
      // Emit global event for components to refetch data
      if (typeof window !== 'undefined' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('cs:data-updated', { 
          detail: { 
            updatedItems: syncResult.items.length,
            sync_token: syncResult.sync_token 
          } 
        }));
      }
    }
    
    return syncResult;
  } catch (err) {
    console.error('Full sync failed:', err);
    throw err;
  }
}

// Auto-sync functionality - checks for updates every 5 minutes
let autoSyncInterval = null;

function startAutoSync(intervalMinutes = 5) {
  if (autoSyncInterval) clearInterval(autoSyncInterval);
  
  autoSyncInterval = setInterval(async () => {
    try {
      await performFullSync();
    } catch (err) {
      console.debug('Auto-sync failed:', err.message);
    }
  }, intervalMinutes * 60 * 1000);
}

function stopAutoSync() {
  if (autoSyncInterval) {
    clearInterval(autoSyncInterval);
    autoSyncInterval = null;
  }
}

export {
  Stack,
  fetchEntries,
  fetchEntryByUID,
  fetchCache,
  startSync,
  performFullSync,
  startAutoSync,
  stopAutoSync,
}

export default Stack
