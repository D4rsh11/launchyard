#!/bin/bash

set -e

echo "Starting Launchyard build server..."

echo "Repository: $GIT_REPOSITORY_URL"
echo "Project ID: $PROJECT_ID"

rm -rf /home/app/output

echo "Cloning repository..."

git clone --depth 1 "$GIT_REPOSITORY_URL" /home/app/output

echo "Repository cloned successfully."

cd /home/app/output/frontend

echo "Frontend directory:"
pwd

echo "Frontend contents:"
ls -la

echo "Package scripts:"
node -e "console.log(require('./package.json').scripts)"

echo "Installing dependencies..."

pnpm install --frozen-lockfile

echo "Starting build process..."

pnpm build

echo "Build completed successfully."

echo "Build output:"
ls -la out

echo "Build server finished."