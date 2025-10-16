// Try multiple sync query variants against CDN sync endpoint to see which returns items/sync_token
require('dotenv').config();
const https = require('https');

const apiKey = process.env.VITE_CS_API_KEY;
const deliveryToken = process.env.VITE_CS_DELIVERY_TOKEN;
const environment = process.env.VITE_CS_ENV || 'development';

if (!apiKey || !deliveryToken) {
  console.error('Missing VITE_CS_API_KEY or VITE_CS_DELIVERY_TOKEN in .env');
  process.exit(1);
}

const variants = [];
variants.push({ name: 'init_all', qs: 'init=true' });
variants.push({ name: 'init_entries_published', qs: 'init=true&type=entry_published' });
variants.push({ name: 'init_assets_published', qs: 'init=true&type=asset_published' });
const contentTypes = ['home_page','blog_post','about_page','services_page','contact_page'];
for (const ct of contentTypes) {
  variants.push({ name: `init_ct_${ct}`, qs: `init=true&content_type=${encodeURIComponent(ct)}` });
  variants.push({ name: `init_ct_${ct}_entry_published`, qs: `init=true&content_type=${encodeURIComponent(ct)}&type=entry_published` });
}

function runVariant(v) {
  return new Promise((resolve) => {
    const pathUrl = `/v3/sync?${v.qs}&environment=${encodeURIComponent(environment)}&locale=en-us`;
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
          resolve({ variant: v.name, statusCode: res.statusCode, items: json.items ? json.items.length : 0, hasToken: !!json.sync_token, raw: json });
        } catch (e) {
          resolve({ variant: v.name, statusCode: res.statusCode, error: e.message, raw: data.slice(0,1000) });
        }
      });
    });
    req.on('error', (e) => resolve({ variant: v.name, error: e.message }));
    req.end();
  });
}

(async function(){
  for (const v of variants) {
    console.log('Running variant:', v.name, v.qs);
    const res = await runVariant(v);
    if (res.error) console.log('-> ERROR', res.error, 'status', res.statusCode);
    else console.log('->', res.variant, 'status', res.statusCode, 'items', res.items, 'hasToken', res.hasToken);
  }
})();
