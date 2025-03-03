#!/bin/bash

# Run all Jest tests with coverage report
echo "Running Time Explorers Game automated tests..."
npm test -- --coverage

# Display test results summary
echo ""
echo "Testing completed. Check the coverage report for details."
echo "Open coverage/lcov-report/index.html in your browser to view detailed coverage." 