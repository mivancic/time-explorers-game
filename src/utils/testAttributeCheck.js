/**
 * Utility script to check if data-test attributes are properly applied in the DOM
 */

// This function will be run in the browser console to check for data-test attributes
export const checkDataTestAttributes = () => {
  console.log('Checking for data-test attributes in the DOM...');
  
  // Find all elements with a data-test attribute (rendered from dataTest in React)
  const elementsWithTestId = document.querySelectorAll('[data-test]');
  
  console.log(`Found ${elementsWithTestId.length} elements with data-test attributes.`);
  
  // Log each element with its data-test value
  elementsWithTestId.forEach((element, index) => {
    console.log(`${index + 1}. Element: ${element.tagName}, data-test: ${element.getAttribute('data-test')}`);
  });

  // Additional check for any incorrectly rendered attributes
  console.log('Checking for any incorrectly rendered dataTest attributes (should be kebab-case in DOM)...');
  const elementsWithCamelCase = document.querySelectorAll('[dataTest]');
  
  if (elementsWithCamelCase.length > 0) {
    console.warn(`Warning: Found ${elementsWithCamelCase.length} elements with dataTest attributes. 
      React should convert these to data-test (kebab-case) in the DOM.
      This indicates a possible issue with your React configuration.`);
    
    elementsWithCamelCase.forEach((element, index) => {
      console.warn(`${index + 1}. Element: ${element.tagName}, dataTest: ${element.getAttribute('dataTest')}`);
    });
  } else {
    console.log('No incorrectly rendered dataTest attributes found. This is good!');
  }

  return {
    correctAttributes: elementsWithTestId.length,
    incorrectAttributes: elementsWithCamelCase.length
  };
};

// Export a message to show on app startup
export const showTestAttributeMessage = () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('--------------------------------------------------------------------------');
    console.log('| DATA-TEST ATTRIBUTES CHECK:                                           |');
    console.log('| To check if data-test attributes are properly applied, run:           |');
    console.log('| import { checkDataTestAttributes } from "./utils/testAttributeCheck"; |');
    console.log('| checkDataTestAttributes();                                            |');
    console.log('|                                                                        |');
    console.log('| React converts dataTest={val} -> data-test={val} in the DOM.          |');
    console.log('| If tests fail, make sure you\'re using:                                |');
    console.log('|   1. dataTest="value" in JSX                                          |');
    console.log('--------------------------------------------------------------------------');
  }
}; 