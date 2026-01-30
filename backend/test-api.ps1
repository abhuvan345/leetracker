# Test Backend Connection

Write-Host "🧪 Testing Backend API..." -ForegroundColor Cyan
Write-Host ""

# Test health endpoint
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
    Write-Host "✅ Health Check:" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor White
    Write-Host "   Message: $($response.message)" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "❌ Backend server is not running!" -ForegroundColor Red
    Write-Host "   Please start the backend server first: npm run dev" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Test companies endpoint
try {
    $companies = Invoke-RestMethod -Uri "http://localhost:5000/api/questions/companies/all" -Method Get
    Write-Host "✅ Companies Endpoint:" -ForegroundColor Green
    Write-Host "   Total Companies: $($companies.Count)" -ForegroundColor White
    
    if ($companies.Count -gt 0) {
        Write-Host ""
        Write-Host "📊 Companies in Database:" -ForegroundColor Cyan
        foreach ($company in $companies) {
            Write-Host "   • $($company.name): $($company.totalQuestions) questions ($($company.completedQuestions) completed)" -ForegroundColor White
        }
    } else {
        Write-Host "   No companies found. Upload some questions from the Admin page." -ForegroundColor Yellow
    }
    Write-Host ""
} catch {
    Write-Host "❌ Failed to fetch companies" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Yellow
    Write-Host ""
}

# Test questions endpoint
try {
    $questions = Invoke-RestMethod -Uri "http://localhost:5000/api/questions" -Method Get
    Write-Host "✅ Questions Endpoint:" -ForegroundColor Green
    Write-Host "   Total Questions: $($questions.Count)" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "❌ Failed to fetch questions" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "✨ All tests completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure frontend is running: npm run dev (in leetracker folder)" -ForegroundColor White
Write-Host "2. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "3. Check browser console (F12) for any errors" -ForegroundColor White
Write-Host ""
