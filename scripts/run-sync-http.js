// Fallback: Use the public Delivery CDN sync API endpoint directly
// Docs: https://www.contentstack.com/docs/developers/apis/content-delivery-api/#sync
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

const tokenFile = path.resolve(__dirname, '..', '.cs_sync_token');
function readToken() {
  try { return fs.readFileSync(tokenFile, 'utf8').trim(); } catch(e) { return null; }
}
function writeToken(t) { try { if(!t) { if(fs.existsSync(tokenFile)) fs.unlinkSync(tokenFile); return; } fs.writeFileSync(tokenFile, t, 'utf8'); } catch(e) { console.error('token write err', e); } }

async function run() {
  const existing = readToken();
  const params = existing ? `sync_token=${encodeURIComponent(existing)}` : 'init=true';
  const pathUrl = `/v3/sync?${params}&environment=${encodeURIComponent(environment)}&locale=en-us`;
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

  console.log('Requesting:', options.hostname + pathUrl);

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json && json.items) console.log('Items:', json.items.length);
        if (json && json.sync_token) {
          console.log('Received sync_token (saved)');
          writeToken(json.sync_token);
        } else console.log('No sync_token in response');
        // Save small sample
        if (json && json.items && json.items.length) {
          const out = json.items.map(i => ({ uid: i.uid, content_type: i.content_type || (i._content_type_uid) }));
          fs.writeFileSync(path.resolve(__dirname, '..', 'cs_sync_items.json'), JSON.stringify(out, null, 2), 'utf8');
          console.log('Saved cs_sync_items.json');
        }
      } catch (e) {
        console.error('Parse error', e);
        console.error('Raw:', data.slice(0, 1000));
      }
    });
  });

  req.on('error', (e) => {
    console.error('Request error', e);
  });
  req.end();
}

run();
