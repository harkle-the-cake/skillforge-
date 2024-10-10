#!/bin/bash
ARTIFACT=skillforge-backend
VERSION=$(jq -r '.version' package.json)
REPO_ADDRESS=192.168.180.223:5000
ARCH=amd64

echo "creating docker with $VERSION..."

# Build the Docker image
if docker build -t $ARTIFACT.$ARCH:$VERSION ./; then
  echo "Docker build successful."
else
  echo "Docker build failed."
  exit 1
fi

# Tag the Docker image
if docker tag $ARTIFACT.$ARCH:$VERSION $REPO_ADDRESS/$ARTIFACT.$ARCH:$VERSION; then
  echo "Docker tag with $VERSION successful."
else
  echo "Docker tag failed."
  exit 1
fi

# Push the Docker image
if docker push $REPO_ADDRESS/$ARTIFACT.$ARCH:$VERSION; then
  echo "Docker push successful."
else
  echo "Docker push failed."
  exit 1
fi