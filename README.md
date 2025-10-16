# Contentstack React Application

A React application with integrated Contentstack CMS for dynamic content management and real-time synchronization.

## 🚀 Features

- **Dynamic Content Loading**: Fetch content from Contentstack with fallback to cached data
- **Real-time Sync**: Automatic content synchronization every 5 minutes 
- **Offline Support**: Cache fallback when Contentstack is unavailable
- **Live Updates**: Components automatically refresh when content is updated
- **Multi-content Type Support**: Home page, blog posts, about, services, and contact pages

## 🛠 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Contentstack Credentials

Create a `.env` file in the project root with your Contentstack credentials:

```env
# Contentstack Configuration
VITE_CS_API_KEY=your_api_key_here
VITE_CS_DELIVERY_TOKEN=your_delivery_token_here
VITE_CS_ENV=development
VITE_CS_DEBUG=true
```

**To get your credentials:**
1. Log in to your [Contentstack account](https://app.contentstack.com/)
2. Go to Settings → Stack Settings
3. Copy the **API Key** and **Delivery Token**
4. Set your environment (usually `development` or `production`)

### 3. Content Types Setup

Ensure your Contentstack stack has these content types configured:

- **home_page**: Hero content, features, statistics
- **blog_post**: Blog articles with title, summary, author, featured_image
- **about_page**: About us content
- **services_page**: Services and features
- **contact_page**: Contact information

### 4. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 🔄 Content Synchronization

### How Sync Works
- **Automatic Sync**: Content syncs every 5 minutes (2 minutes in development)
- **Real-time Updates**: Components refresh automatically when content changes
- **Sync Status**: Visual indicator shows when sync is in progress
- **Error Handling**: Falls back to cached content if sync fails

### Manual Sync Operations
```bash
# Test Contentstack connectivity
node scripts/test-contentstack.js

# Fetch and cache all content manually  
node scripts/fetch-and-cache.js

# Run sync with token management
node scripts/run-sync-now.js
```

## 🔧 Files Fixed & Updated

### ✅ Issues Resolved:
1. **Duplicate function definitions** in `src/contentstackClient.js` - Fixed
2. **Missing environment configuration** - Added `.env` support and example config
3. **Static content in components** - Updated to use dynamic Contentstack data
4. **No sync integration** - Implemented automatic sync manager
5. **Placeholder sync files** - Added real sync functionality

### 📁 Key Files Modified:
- `src/contentstackClient.js` - Enhanced with proper sync handling
- `src/components/Hero.jsx` - Now uses dynamic home_page content
- `src/components/Features.jsx` - Loads features from Contentstack
- `src/pages/Blog.jsx` - Improved error handling and data fetching
- `contentstack-sync.js` - Complete sync manager implementation
- `sync-config.js` - Real configuration settings
- `src/App.jsx` - Added sync initialization and status indicators

## 🐛 Troubleshooting

### Content Not Loading?
1. **Check `.env` file**: Ensure you have the correct API key and delivery token
2. **Verify credentials**: Test with `node scripts/test-contentstack.js`
3. **Check console**: Look for authentication or network errors
4. **Content types**: Ensure your Contentstack has `home_page`, `blog_post`, etc.

### Sync Not Working?
1. **Check sync status**: Look for sync indicator in top-right corner
2. **Manual sync**: Try running `node scripts/run-sync-now.js`
3. **Clear cache**: Delete `cs_cache.json` and restart
4. **Environment**: Verify `VITE_CS_ENV` matches your Contentstack environment

### Common Error Messages:
- `"Missing VITE_CS_API_KEY"` → Add credentials to `.env` file
- `"Failed to fetch"` → Check network connection and CORS settings
- `"No posts found"` → Verify content is published in Contentstack
- `"Sync failed"` → Check delivery token permissions

## 📝 Next Steps

1. **Create `.env` file** with your Contentstack credentials
2. **Verify content types** exist in your Contentstack stack
3. **Test the connection** with `node scripts/test-contentstack.js`
4. **Run the app** with `npm run dev`
5. **Check sync status** - you should see content loading and sync indicators

Your Contentstack data should now sync properly and update your React components automatically! 🎉
