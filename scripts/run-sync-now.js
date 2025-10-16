// Run a Contentstack sync from Node and persist sync_token to .cs_sync_token
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Contentstack = require('contentstack');

const apiKey = process.env.VITE_CS_API_KEY;
const deliveryToken = process.env.VITE_CS_DELIVERY_TOKEN;
const environment = process.env.VITE_CS_ENV || 'development';

if (!apiKey || !deliveryToken) {
  console.error('Missing VITE_CS_API_KEY or VITE_CS_DELIVERY_TOKEN in .env');
  process.exit(1);
}

const Stack = Contentstack.Stack({
  api_key: apiKey,
  delivery_token: deliveryToken,
  environment,
});

const tokenFile = path.resolve(__dirname, '..', '.cs_sync_token');

function readToken() {
  try {
    return fs.readFileSync(tokenFile, 'utf8').trim();
  } catch (e) {
    return null;
  }
}

function writeToken(token) {
  try {
    if (!token) {
      if (fs.existsSync(tokenFile)) fs.unlinkSync(tokenFile);
      return;
    }
    fs.writeFileSync(tokenFile, token, 'utf8');
  } catch (e) {
    console.error('Failed to write token file', e);
  }
}

async function run() {
  const existing = readToken();
  const query = existing ? { sync_token: existing } : { init: true };
  console.log('Starting sync with query:', query);
  try {
    const res = await Stack.sync().query(query).find();
    console.log('Sync response keys:', Object.keys(res || {}));
    if (res && res.items) console.log('Items returned:', res.items.length);
    if (res && res.sync_token) console.log('New sync_token:', res.sync_token.slice(0, 20) + '...');
    if (res && res.sync_token) writeToken(res.sync_token);
    else console.log('No sync_token in response');
    // Optional: write a small JSON file listing item UIDs and content_type
    if (res && res.items && res.items.length) {
      const out = res.items.map(i => ({ uid: i.uid, content_type: i.content_type || i.sys && i.sys.content_type_uid }));
      fs.writeFileSync(path.resolve(__dirname, '..', 'cs_sync_items.json'), JSON.stringify(out, null, 2), 'utf8');
      console.log('Saved cs_sync_items.json with', out.length, 'items');
    }
  } catch (err) {
    console.error('Sync error:', err && err.message ? err.message : err);
    process.exitCode = 2;
  }
}

run();
