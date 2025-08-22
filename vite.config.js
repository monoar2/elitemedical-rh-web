import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify';
import {nodePolyfills} from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const allowedHosts = (env.VITE_ALLOWED_HOSTS || '')
    .split(',')
    .map(h => h.trim())
    .filter(Boolean);

  return {
    plugins: [
      vue(),
      vueDevTools(),
      vuetify({
        autoImport: true, // Automatically imports Vuetify components
      }),
      nodePolyfills({
        global: true, // Polyfill the `global` object
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      ...(allowedHosts.length ? { allowedHosts } : {}),
    },
    base: env.VITE_BASE_PATH || '/',
  }
})