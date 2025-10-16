// Quick test script to verify Contentstack credentials and fetch `home_page` entries.
require('dotenv').config();
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

async function test() {
  try {
    const Query = Stack.ContentType('home_page').Query();
    const res = await Query.toJSON().find();
    console.log('Raw response keys:', Object.keys(res));
    if (res && res[0] && res[0].entries) {
      console.log('Found entries:', res[0].entries.length);
      console.log('Sample title:', res[0].entries[0].title || '(no title)');
    } else if (res && res.entries) {
      console.log('Found entries (entries):', res.entries.length);
      console.log('Sample title:', res.entries[0].title || '(no title)');
    } else {
      console.log('Unexpected response shape:', JSON.stringify(res).slice(0, 400));
    }
  } catch (err) {
    console.error('Fetch error:', err && err.message ? err.message : err);
    process.exitCode = 2;
  }
}

test();
