// Query Contentstack CDN entries for specific content types to verify published entries
require('dotenv').config();
const https = require('https');

const apiKey = process.env.VITE_CS_API_KEY;
const deliveryToken = process.env.VITE_CS_DELIVERY_TOKEN;
const environment = process.env.VITE_CS_ENV || 'development';

if (!apiKey || !deliveryToken) {
  console.error('Missing VITE_CS_API_KEY or VITE_CS_DELIVERY_TOKEN in .env');
  process.exit(1);
}

const types = ['home_page','blog_post','about_page','services_page','contact_page'];

function fetchCount(contentType) {
  return new Promise((resolve) => {
    const path = `/v3/content_types/${encodeURIComponent(contentType)}/entries?environment=${encodeURIComponent(environment)}&include_count=true&locale=en-us`;
    const options = {
      hostname: 'cdn.contentstack.io',
      port: 443,
      path,
      method: 'GET',
      headers: {
        api_key: apiKey,
        access_token: deliveryToken,
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ contentType, count: json.count || 0, raw: json });
        } catch (e) {
          resolve({ contentType, error: e.message, raw: data.slice(0, 500) });
        }
      });
    });
    req.on('error', (e) => resolve({ contentType, error: e.message }));
    req.end();
  });
}

(async function(){
  for (const t of types) {
    const res = await fetchCount(t);
    if (res.error) console.error(`${t}: error -`, res.error);
    else console.log(`${t}: ${res.count} entries`);
  }
})();
