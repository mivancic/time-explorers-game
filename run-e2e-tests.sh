#!/bin/bash

# Script to run Playwright e2e tests with helpful error handling

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Time Explorers Game E2E Tests ===${NC}"

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f2)
NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d '.' -f1)

if [ $NODE_MAJOR_VERSION -lt 18 ]; then
  echo -e "${YELLOW}Warning: Playwright recommends Node.js v18 or newer (detected v${NODE_VERSION})${NC}"
  echo -e "Tests may still run but with compatibility warnings."
  echo ""
fi

# Check if @playwright/test is installed
if ! npm list --depth=0 | grep -q "@playwright/test"; then
  echo -e "${RED}Error: @playwright/test is not installed${NC}"
  echo -e "Installing @playwright/test..."
  npm install --save-dev @playwright/test
  echo ""
fi

# Check if browsers are installed
if [ ! -d "$HOME/Library/Caches/ms-playwright" ] && [ ! -d "$HOME/.cache/ms-playwright" ]; then
  echo -e "${YELLOW}Warning: Playwright browsers may not be installed${NC}"
  echo -e "Installing Chromium browser..."
  npx playwright install chromium
  echo ""
fi

# Create screenshots directory if it doesn't exist
if [ ! -d "playwright-screenshots" ]; then
  echo -e "${BLUE}Creating playwright-screenshots directory...${NC}"
  mkdir -p playwright-screenshots
fi

# Clean up old screenshots to avoid confusion
echo -e "${BLUE}Cleaning up old screenshots...${NC}"
rm -f *.png  # Remove any screenshot files in the root directory
rm -f playwright-screenshots/*.png  # Clean up the screenshots directory for fresh run

# Parse command line arguments
RUN_FILE=""

for arg in "$@"
do
    case $arg in
        --file=*)
        RUN_FILE="${arg#*=}"
        shift
        ;;
    esac
done

# Run application tests
echo -e "${BLUE}Running application tests...${NC}"

# If a specific file is provided, run only that file
if [ -n "$RUN_FILE" ]; then
  npx playwright test "$RUN_FILE" --reporter=dot
else
  # Run all tests
  npx playwright test --reporter=dot
fi

APP_EXIT_CODE=$?

if [ $APP_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}✓ Application tests passed successfully${NC}"
  echo -e "${BLUE}Screenshots saved to:${NC} playwright-screenshots/"
else
  echo -e "${RED}✗ Application tests failed${NC}"
  echo -e "${YELLOW}You can find screenshots for debugging in:${NC} playwright-screenshots/"
  echo -e "${YELLOW}Test results are in:${NC} test-results/"
fi

exit $APP_EXIT_CODE 