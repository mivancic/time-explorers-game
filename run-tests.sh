#!/bin/bash

# Testing script for Time Explorers Game

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Time Explorers Game Testing Suite ===${NC}"
echo

# Function to run tests and report results
run_test() {
  local test_name=$1
  local test_command=$2
  
  echo -e "${BLUE}Running $test_name tests...${NC}"
  
  if eval $test_command; then
    echo -e "${GREEN}✓ $test_name tests passed successfully${NC}"
    return 0
  else
    echo -e "${RED}✗ $test_name tests failed${NC}"
    return 1
  fi
}

# Track overall success
total_success=0
total_count=0

# Run unit tests
echo -e "${BLUE}=== Unit Tests ===${NC}"
if run_test "Unit" "npm test -- --coverage"; then
  ((total_success++))
fi
((total_count++))

echo

# Run browser tests if the --e2e flag is provided
if [[ "$*" == *"--e2e"* ]]; then
  echo -e "${BLUE}=== Browser Tests ===${NC}"
  if run_test "Browser" "npm run test:e2e"; then
    ((total_success++))
  fi
  ((total_count++))
fi

echo
echo -e "${BLUE}=== Test Summary ===${NC}"
echo -e "Passed: ${total_success}/${total_count} test suites"

# Show coverage report location
echo -e "${BLUE}Coverage report available at:${NC} coverage/lcov-report/index.html"

# Exit with appropriate code
if [ $total_success -eq $total_count ]; then
  echo -e "${GREEN}All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed!${NC}"
  exit 1
fi 