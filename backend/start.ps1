# Quick Start Script for Backend

Write-Host "🚀 LeetTracker Backend Setup" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from the backend directory" -ForegroundColor Yellow
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "⚠️  .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
    Write-Host ""
    Write-Host "📝 Please edit .env file and add your MongoDB connection string:" -ForegroundColor Cyan
    Write-Host "   1. Open MongoDB Atlas" -ForegroundColor White
    Write-Host "   2. Get your connection string" -ForegroundColor White
    Write-Host "   3. Update MONGODB_URI in .env file" -ForegroundColor White
    Write-Host ""
    $response = Read-Host "Have you configured .env? (y/n)"
    if ($response -ne "y") {
        Write-Host "Please configure .env first, then run this script again" -ForegroundColor Yellow
        exit 0
    }
}

# Start the server
Write-Host ""
Write-Host "🚀 Starting backend server..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

npm run dev
