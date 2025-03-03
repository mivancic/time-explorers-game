# Time Explorers Game

An interactive time-learning game built with React and Tailwind CSS.

## Features

- Learn to tell time with an interactive clock interface
- Test your knowledge with time-based questions and challenges
- Multiple choice answers with radio buttons
- Progress tracking and level advancement
- Character selection and customizable player names
- Save and resume game functionality
- Beautiful UI with Tailwind CSS

## Project Structure

The application is organized with a component-based architecture:

```
src/
├── components/         # UI components
│   ├── AnalogueClock/        # Clock display component
│   ├── ClockAnimation/       # Animated clock component
├── data/               # Game data
│   ├── config.js             # Game configuration
│   ├── questionManager.js    # Question selection and tracking
│   ├── questions.js          # Question templates and generation
│   └── storage.js            # Game state persistence
├── hooks/              # Custom React hooks
│   └── useGameState.js       # Main game state management
├── screens/            # Application screens
│   ├── CharacterSelectScreen/  # Character selection screen
│   ├── ConfigScreen/           # Game settings page
│   ├── GameScreen/             # Main game play screen
│   ├── NameInputScreen/        # Player name input screen
│   ├── ScoreboardScreen/       # High scores display
│   ├── StartScreen/            # Game start menu
│   └── SuccessScreen/          # Game completion screen
├── services/           # Service modules
│   └── AudioService.js        # Audio management service
├── __tests__/          # Test files
│   ├── components/            # Component tests
│   ├── screens/               # Screen tests
├── TimeExplorers.jsx   # Main app component
└── index.js            # App entry point
```

## Getting Started

### Prerequisites

- Node.js (version 14.x or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd time-explorers-game
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Testing

The Time Explorers Game includes a comprehensive testing suite using Jest for unit/component tests and Playwright for browser-based end-to-end tests.

### Setting Up Tests

All necessary testing dependencies are included in the package.json. The testing configuration is defined in:

- `jest.config.js` - Configuration for Jest unit tests
- `playwright.config.js` - Configuration for Playwright browser tests
- `src/setupTests.js` - Setup file for Jest tests including mocks

#### Playwright Installation Requirements

To use Playwright, you need:

- Node.js version 18 or later
- The @playwright/test package: `npm install --save-dev @playwright/test`
- Browser binaries: `npx playwright install`

```bash
# Install Playwright test runner
npm install --save-dev @playwright/test

# Install browser binaries
npx playwright install
```

### Running Unit Tests with Jest

Unit tests verify individual components and functions work correctly in isolation.

```bash
# Run all unit tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run tests for a specific file
npm test -- src/__tests__/components/AnalogueClock.test.jsx
```

The coverage report can be viewed in your browser by opening `coverage/lcov-report/index.html`.

### Running End-to-End Tests with Playwright

End-to-end tests verify the application works correctly in real browser environments.

```bash
# Run all browser tests
npm run test:e2e

# Run tests with compatibility script (automatically handles dependencies)
npm run test:e2e:compat

# Run only simple HTML tests (to verify Playwright setup)
./run-e2e-tests.sh --simple-only

# Run only application tests (skipping simple tests)
./run-e2e-tests.sh --app-only

# Run a specific test file
./run-e2e-tests.sh --file=e2e/timeExplorers.spec.js

# Run tests in a specific browser
npx playwright test --project=chromium

# Run a specific test file
npx playwright test e2e/timeExplorers.spec.js
```

Playwright tests will automatically start the development server before running tests and shut it down afterward.

### Comprehensive Test Runner

A bash script is included to run all tests with a user-friendly output:

```bash
# Make the script executable (only needed once)
chmod +x run-tests.sh

# Run unit tests only
./run-tests.sh

# Run both unit and end-to-end tests
./run-tests.sh --e2e
```

### Test Structure

- Unit/Component Tests: `src/__tests__/`

  - Components: `src/__tests__/components/`
  - Screens: `src/__tests__/screens/`
  - Services: `src/__tests__/services/`

- End-to-End Tests: `e2e/`

### Writing Tests

#### Unit Tests Example

```javascript
import React from "react";
import { render, screen } from "@testing-library/react";
import { AnalogueClock } from "../../components";

describe("AnalogueClock Component", () => {
  test("renders with default values", () => {
    render(<AnalogueClock hour={3} />);

    // The component should render
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
```

#### End-to-End Tests Example

```javascript
const { test, expect } = require("@playwright/test");

test("User can select a character and enter a name", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // Click on a character
  await page.click("text=Marko");

  // Enter a name
  await page.fill('input[placeholder="Marko"]', "TestPlayer");

  // Click continue
  await page.click("text=Nastavi");

  // Verify navigation to start screen
  await expect(page.locator("text=Započni novu igru")).toBeVisible();
});
```

## Technology Stack

- React (Functional components with hooks)
- Tailwind CSS for styling
- JavaScript (ES6+)
- Jest for unit testing
- Playwright for end-to-end testing

## Development Guidelines

- All React components should be placed in the `src/components` directory
- Components should be documented with JSDoc comments
- Game state should be managed through the `useGameState` hook
- User answers should use radio buttons instead of text input
- Follow consistent styling patterns across components
- Include tests for all components and critical functionality

## Cursor IDE Integration

This project includes custom rules for the Cursor IDE in the `.cursor/rules` directory. These rules help maintain consistent code quality and style.

The `.cursor` directory is excluded from Git to prevent conflicts between different developer environments.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run test:e2e`

Runs end-to-end tests using Playwright across multiple browsers.\
Tests application functionality in real browser environments.

## Mobile App Setup

You can run Time Explorers on mobile devices in several ways:

### Option 1: Access via Mobile Browser

1. Deploy the app to a hosting service like GitHub Pages:

```bash
npm run deploy
```

2. Once deployed, you can access the game via any mobile browser at the published URL.

### Option 2: Install as Progressive Web App (PWA)

1. After deploying the app, visit the URL on your mobile device.
2. On iOS: Tap the "Share" icon, then "Add to Home Screen".
3. On Android: Tap the menu button, then "Add to Home Screen" or "Install App".

### Option 3: Create Native Mobile Apps

1. After installation of dependencies, initialize Capacitor:

```bash
npm run cap:init
```

2. Add platforms:

```bash
npm run cap:add:android  # For Android
npm run cap:add:ios      # For iOS (requires macOS)
```

3. Build the project and sync with Capacitor:

```bash
npm run mobile:build
```

4. Open in native IDE:

```bash
npm run cap:open:android  # Opens in Android Studio
npm run cap:open:ios      # Opens in Xcode (requires macOS)
```

5. Run the app on a connected device or emulator from the native IDE.

## Troubleshooting

### Playwright Testing Issues

#### MODULE_NOT_FOUND Error

If you encounter the error `Cannot find module '@playwright/test'`, this means the Playwright test runner package is missing:

```
Error: Cannot find module '@playwright/test'
```

**Solution:**

1. Install the Playwright test runner:

   ```bash
   npm install --save-dev @playwright/test
   ```

2. If using an older Node.js version (below 18), you may see compatibility warnings. Consider:
   - Upgrading Node.js to version 18 or later (recommended for Playwright)
   - Using a Node.js version manager like nvm to switch between versions
   - Using our compatibility script: `npm run test:e2e:compat` (which handles installation and warnings)

#### Selector Errors in Tests

If you see errors like:

```
Error: strict mode violation: locator('text=Vremenski Istraživači') resolved to 2 elements
```

**Solution:**

1. Use more specific selectors like:

   ```javascript
   // Instead of
   page.locator("text=Vremenski Istraživači");

   // Use
   page.locator('h1:has-text("Vremenski Istraživači")');
   ```

2. Run tests in debug mode to see what's happening:

   ```bash
   DEBUG=pw:api npx playwright test
   ```

3. Try running the simple HTML test first to isolate browser issues:
   ```bash
   ./run-e2e-tests.sh --simple-only
   ```

#### Element Not Found Errors

If you get timeout errors like:

```
Timed out 5000ms waiting for expect(locator).toBeVisible()
```

**Solution:**

1. Check if the navigation is actually working:

   ```bash
   # Run tests with browser visible and slowed down
   npx playwright test --headed --slow
   ```

2. Check the screenshots in the test-results directory to see what state the browser was in when the test failed

3. Try adding additional waiting:
   ```javascript
   await page.waitForLoadState("networkidle");
   await page.waitForTimeout(1000); // Add a short delay
   ```

#### Browser Installation Issues

If Playwright cannot find browser binaries, you may see errors like:

```
browserType.launch: Executable doesn't exist at /path/to/browser
```

**Solution:**
Install the browser binaries:

```bash
npx playwright install
```

### Jest Testing Issues

#### Test Files Not Found

If Jest cannot find your test files, check:

1. The test file naming convention: files should end with `.test.js`, `.test.jsx`, `.spec.js`, or `.spec.jsx`
2. The location of test files: they should be in `src/__tests__/` or next to the components they test

#### Mock Dependencies Issues

If tests fail due to missing mocks, check:

1. The `setupTests.js` file is correctly configured
2. All external dependencies (localStorage, Audio, etc.) are properly mocked
