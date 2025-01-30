import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 10_000,
    environment: 'jsdom',
    setupFiles: ['./setupTests.js'],
  },
});
