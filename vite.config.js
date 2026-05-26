import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config — Roots Tabacaria
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
