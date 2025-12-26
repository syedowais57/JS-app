#!/bin/bash
# Test build with Node.js 12 using Docker
echo "Testing build with Node.js 12..."

docker run --rm \
  -v "$(pwd):/app" \
  -w /app \
  node:12 \
  sh -c "npm install && npm run build"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful with Node.js 12!"
else
    echo ""
    echo "❌ Build failed with Node.js 12"
    exit 1
fi

