// @ts-check

// Enable debug logging
process.env.DEBUG = 'pw:browser';

/**
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
  testDir: './e2e',
  /* Maximum time one test can run for. */
  timeout: 120 * 1000, // Increase timeout to 2 minutes
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     */
    timeout: 15000 // Increase expect timeout to 15 seconds
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Run tests with 4 parallel workers */
  workers: 6,
  
  /* Reporter to use. */
  reporter: 'dot', // Use dot reporter instead of HTML to avoid Intl.Segmenter issues
  
  /* Configure projects for different browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        // Run in headful mode to see what's happening
        headless: false,
        viewport: { width: 1280, height: 720 },
        baseURL: 'http://localhost:3000',
        // Take screenshot on test failure
        screenshot: 'only-on-failure',
        trace: 'on-first-retry',
      },
    },
  ],
  
  /* Configure the web server to start before the tests */
  webServer: {
    command: 'npm start',
    port: 3000,
    timeout: 120000, // 2 minutes
    reuseExistingServer: !process.env.CI,
  },
  
  /* Configure output directories */
  outputDir: './test-results/',
};

module.exports = config; 