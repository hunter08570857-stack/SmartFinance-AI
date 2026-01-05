
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 重要：確保 GitHub Pages 子目錄路徑正確
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.FIREBASE_CONFIG': JSON.stringify(process.env.FIREBASE_CONFIG || '')
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // 保留 console 方便在 GitHub Pages 上除錯
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'recharts', 'lucide-react'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          ai: ['@google/genai']
        }
      }
    }
  }
});
