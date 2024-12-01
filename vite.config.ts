import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    open: true,
    // Add this to help diagnose MIME type issues
    strictPort: true,
  },
  resolve: {
    alias: {
      // Optional: add path aliases if you're using them
      '@': '/src',
    },
  },
});