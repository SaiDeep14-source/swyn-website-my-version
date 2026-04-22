import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        careers: resolve(__dirname, 'careers.html'),
        careersAdmin: resolve(__dirname, 'careers-admin.html'),
        clientBrief: resolve(__dirname, 'client-brief.html'),
        expertApply: resolve(__dirname, 'expert-apply.html'),
      },
    },
  },
  server: {
    open: true,
  },
});
