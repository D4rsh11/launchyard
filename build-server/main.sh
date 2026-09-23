#!/bin/bash

set -e

echo "Starting Launchyard build server..."

echo "Repository: $GIT_REPOSITORY_URL"
echo "Project ID: $PROJECT_ID"

rm -rf ./output

echo "Cloning repository..."

git clone --depth 1 "$GIT_REPOSITORY_URL" ./output

echo "Repository cloned successfully."

echo "Repository contents:"
ls -la ./output

echo "Starting build process..."

node ./script.js

echo "Build server finished."