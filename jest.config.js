module.exports = {
  // The root directory that Jest should scan for tests and modules
  rootDir: '.',
  
  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/src'],
  
  // The test environment that will be used for testing
  testEnvironment: 'jsdom',
  
  // Jest transformations - this is where you tell Jest how to process different file types
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  
  // Sets the test match patterns
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  
  // Module file extensions for importing
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  
  // Setup files that run before each test file
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
  // Module name mapper for handling static assets
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js'
  },
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/serviceWorkerRegistration.js'
  ],
  coverageReporters: ['text', 'lcov'],
  
  // Ignore transformations for node_modules except testing library
  transformIgnorePatterns: [
    '/node_modules/(?!(@testing-library)/)'
  ]
}; 