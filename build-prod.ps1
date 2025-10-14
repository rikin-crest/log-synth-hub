# Build production version without Docker
Write-Host "Building Log Synth Hub for production..." -ForegroundColor Green

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Build the project
Write-Host "Building project..." -ForegroundColor Cyan
npm run build

Write-Host "Build completed! Files are in the 'dist' folder." -ForegroundColor Green
Write-Host "To serve locally, run: npm run preview" -ForegroundColor Cyan
Write-Host "Or install a static server: npm install -g serve && serve -s dist" -ForegroundColor Cyan
