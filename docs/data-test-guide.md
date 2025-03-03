# Guide for Adding Data-Test Attributes to Components

This guide explains how to properly add data-test attributes to components in the Time Explorers Game.

## Why Use Data-Test Attributes?

- **Stability**: Data-test attributes provide stable selectors for tests that don't change when styles or text content changes
- **Clarity**: They make test intent clear by explicitly marking elements for testing
- **Performance**: Selectors based on data-test attributes are generally faster than text-based selectors
- **Isolation**: They isolate tests from implementation details of the UI

## Naming Convention

We use a consistent pattern for all data-test attributes:

```
data-test="[component]-[element-type]-[function]"
```

For example:

- `data-test="char-select-button-marko"` - Character selection button for Marko
- `data-test="name-input-field"` - Input field in the name input screen

## Implementation Methods

Based on testing, here's the recommended way to add data-test attributes to React components:

### 1. Direct Attribute Method (Recommended)

```jsx
<div data-test="component-container">
  <button data-test="component-button-submit">Submit</button>
</div>
```

React 19 and newer versions allow you to directly use hyphenated attributes like `data-test`. This approach is the most reliable.

### 2. Using camelCase dataTest (Alternative)

```jsx
// Alternative approach - React converts this to data-test in the DOM
<div dataTest="component-container">
  <button dataTest="component-button-submit">Submit</button>
</div>
```

## Important: Using the Right Components

A common issue is adding data-test attributes to components that aren't actually used in the app:

1. **Check Component Usage**: Make sure you're adding attributes to the component that's actually rendered in the app. For example:
   - Components in `/src/components/` might be older versions not in use
   - Components in `/src/screens/` might be the ones actually rendered in the app
2. **Verify Rendered Component Path**: Check your main app file (e.g., `App.jsx` or `TimeExplorers.jsx`) to see which components are imported and used:

   ```jsx
   import { CharacterSelectScreen } from "./screens"; // <-- This is what's used!

   // NOT: import CharacterSelect from './components/CharacterSelect';
   ```

3. **Use React DevTools**: Browser's React DevTools can help identify which components are actually rendered in the DOM.

## Special React Behavior for Data Attributes

React handles data attributes in special ways:

1. In older React versions, you needed to use camelCase in JSX (`dataTest`) which React would convert to kebab-case in the DOM (`data-test`).

2. In React 19 and newer versions, you can use `data-test` directly, which is more intuitive and reliable.

## Webpack Considerations

Webpack may strip custom attributes in production builds. To prevent this:

1. **Always run in development mode during testing:**

   ```
   export NODE_ENV=development && npm start
   ```

## Troubleshooting Data-Test Attributes

If your tests are failing because data-test attributes aren't being found:

1. **Verify component usage**: Make sure you've added data-test attributes to the correct component that's actually being rendered, not an unused copy.

2. **Check environment:** Make sure you are running in development mode:

   ```
   echo $NODE_ENV
   ```

   If not set or not 'development', run:

   ```
   export NODE_ENV=development
   ```

3. In your browser console, run:

   ```js
   document.querySelectorAll("[data-test]").length;
   ```

   This will show how many elements have the data-test attribute. If the count is 0, there's a problem with your attribute implementation.

4. You can also use our utility function to check for data-test attributes:

   ```js
   import { checkDataTestAttributes } from "./utils/testAttributeCheck";
   checkDataTestAttributes();
   ```

## Common Component Prefixes

- `char-select` - Character selection screen
- `name` - Name input screen
- `game` - Game screen
- `settings` - Settings screen
- `scoreboard` - Scoreboard screen
- `nav` - Navigation elements
- `success` - Success screen

## Element Types

- `button` - Button elements
- `input` - Input fields
- `text` - Text display elements
- `display` - Display containers for data
- `container` - Container elements
- `item` - Individual items in a list
- `radio` - Radio button inputs
