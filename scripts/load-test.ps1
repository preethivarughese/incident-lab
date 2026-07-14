# Load test script - sends repeated POST /orders requests to Order Service
# Usage: .\scripts\load-test.ps1 [-Count 100] [-DelayMs 200]
param(
    [int]$Count = 100,
    [int]$DelayMs = 200
)

$baseUrl = "http://localhost:8080"
$products = @("P001", "P002", "P003", "P004", "P005")
$success = 0
$errors = 0

Write-Host "Starting load test: $Count requests, ${DelayMs}ms delay" -ForegroundColor Cyan

for ($i = 1; $i -le $Count; $i++) {
    $product = $products[(Get-Random -Maximum $products.Count)]
    $qty = Get-Random -Minimum 1 -Maximum 10
    $body = @{
        productId = $product
        quantity  = $qty
        userId    = "load-test-user"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/orders" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -ErrorAction Stop
        $success++
        Write-Host "[$i/$Count] OK   - orderId=$($response.orderId) status=$($response.status)" -ForegroundColor Green
    } catch {
        $errors++
        Write-Host "[$i/$Count] FAIL - $($_.Exception.Message)" -ForegroundColor Red
    }

    if ($DelayMs -gt 0) { Start-Sleep -Milliseconds $DelayMs }
}

Write-Host ""
Write-Host "Load test complete: $success success, $errors errors" -ForegroundColor Cyan
