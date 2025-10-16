// Script to check counts for multiple Contentstack content types
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

const types = ['home_page','blog_post','about_page','services_page','contact_page'];

async function check() {
  for (const t of types) {
    try {
      const Query = Stack.ContentType(t).Query();
      const res = await Query.toJSON().find();
      // determine entries count safely
      let count = 0;
      if (Array.isArray(res) && res.length && res[0].entries) count = res[0].entries.length;
      else if (res && res.entries) count = res.entries.length;
      else if (Array.isArray(res)) count = res.length;
      console.log(`${t}: ${count} entries`);
    } catch (err) {
      console.error(`${t}: fetch error -`, err && err.message ? err.message : err);
    }
  }
}

check();
