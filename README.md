# Time Explorers Game

An interactive time-learning game built with React and Tailwind CSS.

## Features

- Learn to tell time with an interactive clock interface
- Test your knowledge with time-based questions and challenges
- Beautiful UI with Tailwind CSS

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

## Technology Stack

- React
- Tailwind CSS
- JavaScript

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

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

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
