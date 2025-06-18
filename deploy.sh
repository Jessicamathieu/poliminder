#!/usr/bin/env bash
set -euo pipefail

# Usage: ./deploy.sh [commit message]
# Adds all changes to git, commits, pushes to main, builds the project,
# deploys to Firebase and prints the hosting URL.

COMMIT_MSG=${1:-"Automated deployment $(date '+%Y-%m-%d %H:%M:%S')"}

echo "\nAdding files to git..."
git add -A

echo "Committing with message: $COMMIT_MSG"
git commit -m "$COMMIT_MSG" || echo "Nothing to commit."

echo "Pushing to main..."
git push origin main

echo "\nBuilding Next.js..."
npm run build

echo "\nDeploying to Firebase..."
DEPLOY_OUTPUT=$(npx firebase-tools deploy --only hosting ${FIREBASE_TOKEN:+--token "$FIREBASE_TOKEN"})

echo "$DEPLOY_OUTPUT"
HOSTING_URL=$(echo "$DEPLOY_OUTPUT" | grep -oE 'https://[^ ]+\.web\.app' | tail -n1)
if [ -n "$HOSTING_URL" ]; then
  echo "Firebase site: $HOSTING_URL"
else
  echo "Deployment complete. Check the deploy output above for the hosting URL."
fi
