import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'sockjs-client': path.resolve(__dirname, 'node_modules/sockjs-client/dist/sockjs.js')
    }
  }
});
