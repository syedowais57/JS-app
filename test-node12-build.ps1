# Test build with Node.js 18 using Docker
Write-Host "Testing build with Node.js 18..." -ForegroundColor Green

docker run --rm `
  -v "${PWD}:/app" `
  -w /app `
  node:18 `
  sh -c "npm install && npm run build"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Build successful with Node.js 18!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Build failed with Node.js 18" -ForegroundColor Red
    exit 1
}

