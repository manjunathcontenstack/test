// Fetch published entries for configured content types and write a local cache (cs_cache.json)
require('dotenv').config();
const https = require('https');
const fs = require('fs');
const path = require('path');

const apiKey = process.env.VITE_CS_API_KEY;
const deliveryToken = process.env.VITE_CS_DELIVERY_TOKEN;
const environment = process.env.VITE_CS_ENV || 'development';

if (!apiKey || !deliveryToken) {
  console.error('Missing VITE_CS_API_KEY or VITE_CS_DELIVERY_TOKEN in .env');
  process.exit(1);
}

const types = ['home_page','blog_post','about_page','services_page','contact_page'];

console.log('Fetching content for types:', types);
console.log('Using environment:', environment);
console.log('API Key:', apiKey ? `${apiKey.substr(0,8)}...` : 'NOT SET');
console.log('Delivery Token:', deliveryToken ? `${deliveryToken.substr(0,8)}...` : 'NOT SET');

function fetchEntriesFor(contentType) {
  return new Promise((resolve) => {
    const pathUrl = `/v3/content_types/${encodeURIComponent(contentType)}/entries?environment=${encodeURIComponent(environment)}&locale=en-us&include_global_field_schema=true&include_count=false&limit=100`;
    const options = {
      hostname: 'cdn.contentstack.io',
      port: 443,
      path: pathUrl,
      method: 'GET',
      headers: {
        api_key: apiKey,
        access_token: deliveryToken,
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ contentType, entries: json.entries || [] });
        } catch (e) {
          resolve({ contentType, error: e.message, raw: data.slice(0,500) });
        }
      });
    });
    req.on('error', (e) => resolve({ contentType, error: e.message }));
    req.end();
  });
}

(async function(){
  const out = {};
  for (const t of types) {
    const res = await fetchEntriesFor(t);
    if (res.error) {
      console.error(`${t}: error fetching -`, res.error);
      out[t] = [];
    } else {
      console.log(`${t}: ${res.entries.length} entries fetched`);
      out[t] = res.entries;
    }
  }
  const outPath = path.resolve(__dirname, '..', 'cs_cache.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote cache to', outPath);
})();
