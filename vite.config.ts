/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: './src/setupTests.js',
    environment: 'jsdom',
    maxWorkers: 8,
    minWorkers: 2,
  },
  envDir: './',
});
