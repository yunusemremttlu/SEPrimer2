import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    video: true,
    videoCompression: false,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 8000,
    supportFile: false,
    setupNodeEvents(on, config) {
      // Node event listeners if needed
      return config;
    },
  },
});
