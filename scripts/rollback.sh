#!/bin/bash

# Rollback deployment script
# Usage: ./scripts/rollback.sh [environment] [version]

set -e

ENVIRONMENT=${1:-production}
VERSION=${2:-}
DEPLOYMENT_HISTORY_FILE=".deployment-history.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Rollback Deployment Script${NC}"
echo "=========================="

# Check if version is provided
if [ -z "$VERSION" ]; then
    echo -e "${RED}Error: Version not specified${NC}"
    echo "Usage: $0 [environment] [version]"
    echo "Example: $0 production v1.2.3"
    exit 1
fi

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(production|staging|development)$ ]]; then
    echo -e "${RED}Error: Invalid environment '$ENVIRONMENT'${NC}"
    echo "Valid environments: production, staging, development"
    exit 1
fi

echo -e "Environment: ${GREEN}$ENVIRONMENT${NC}"
echo -e "Rolling back to version: ${GREEN}$VERSION${NC}"

# Create deployment backup
BACKUP_DIR="deployments/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo -e "\n${YELLOW}Creating backup of current deployment...${NC}"
# Add your backup logic here
# Example: cp -r /path/to/current/deployment "$BACKUP_DIR/"

# Checkout the specific version
echo -e "\n${YELLOW}Checking out version $VERSION...${NC}"
git fetch --tags
git checkout "tags/$VERSION" -b "rollback-$VERSION-$(date +%s)"

# Install dependencies for that version
echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm ci

# Build the application
echo -e "\n${YELLOW}Building application...${NC}"
npm run build

# Run tests to ensure the version is stable
echo -e "\n${YELLOW}Running tests...${NC}"
npm test -- --passWithNoTests

# Deploy the specific version
echo -e "\n${YELLOW}Deploying version $VERSION to $ENVIRONMENT...${NC}"
# Add your deployment logic here
# Example: rsync -avz --delete build/ user@server:/path/to/deployment/

# Update deployment history
if [ -f "$DEPLOYMENT_HISTORY_FILE" ]; then
    # Add rollback entry to history
    jq ". += [{\"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"version\": \"$VERSION\", \"environment\": \"$ENVIRONMENT\", \"type\": \"rollback\", \"status\": \"success\"}]" "$DEPLOYMENT_HISTORY_FILE" > tmp.json && mv tmp.json "$DEPLOYMENT_HISTORY_FILE"
else
    # Create new history file
    echo "[{\"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"version\": \"$VERSION\", \"environment\": \"$ENVIRONMENT\", \"type\": \"rollback\", \"status\": \"success\"}]" > "$DEPLOYMENT_HISTORY_FILE"
fi

# Health check
echo -e "\n${YELLOW}Performing health check...${NC}"
# Add your health check logic here
# Example: curl -f https://your-app.com/health || exit 1

echo -e "\n${GREEN}Rollback completed successfully!${NC}"
echo -e "Version ${GREEN}$VERSION${NC} is now live on ${GREEN}$ENVIRONMENT${NC}"

# Send notification
# Add notification logic here (Slack, email, etc.)

# Cleanup
git checkout main
git branch -D "rollback-$VERSION-$(date +%s)" 2>/dev/null || true

exit 0