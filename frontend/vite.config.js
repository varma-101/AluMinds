import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:5001', // Replace this with your backend server URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
