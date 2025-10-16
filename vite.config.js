import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
    },
    define: {
      // Make sure env variables are available in development
      __CS_API_KEY__: JSON.stringify(env.VITE_CS_API_KEY),
      __CS_DELIVERY_TOKEN__: JSON.stringify(env.VITE_CS_DELIVERY_TOKEN),
      __CS_ENV__: JSON.stringify(env.VITE_CS_ENV || 'development'),
    },
  };
});
