// Contentstack Configuration Example
// Copy this file to contentstack-config.js and update with your actual credentials
// or create a .env file with the following variables:

export default {
  // Your Contentstack Stack API Key
  apiKey: process.env.VITE_CS_API_KEY || 'your_api_key_here',
  
  // Your Contentstack Delivery Token  
  deliveryToken: process.env.VITE_CS_DELIVERY_TOKEN || 'your_delivery_token_here',
  
  // Your Contentstack Environment
  environment: process.env.VITE_CS_ENV || 'development',
  
  // Debug mode
  debug: process.env.VITE_CS_DEBUG === 'true' || false,
  
  // Content types to sync
  contentTypes: ['home_page', 'blog_post', 'about_page', 'services_page', 'contact_page']
};

/*
To get your Contentstack credentials:
1. Log in to your Contentstack account
2. Go to Settings > Stack Settings
3. Copy the API Key and Delivery Token
4. Make sure your environment is set correctly (usually 'development' or 'production')

Create a .env file in your project root with:
VITE_CS_API_KEY=your_actual_api_key
VITE_CS_DELIVERY_TOKEN=your_actual_delivery_token
VITE_CS_ENV=development
*/

