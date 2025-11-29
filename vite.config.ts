
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // On Vercel, process.env.API_KEY might be available directly in the build environment
  // even if loadEnv doesn't pick it up from a file.
  const apiKey = process.env.API_KEY || env.API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // We explicitly define the global variable to be replaced during build
      'process.env.API_KEY': JSON.stringify(apiKey), 
    },
  };
});
