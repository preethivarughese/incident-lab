# Quick incident trigger script
# Usage: .\scripts\trigger-incidents.ps1 -Incident cpu|dependency|npe|memory|random|reset

param(
    [ValidateSet("cpu","dependency","npe","memory","random","reset","status")]
    [string]$Incident = "status"
)

$orderUrl     = "http://localhost:8080"
$inventoryUrl = "http://localhost:8081"

function Invoke-Incident($url, $path) {
    try {
        $response = Invoke-RestMethod -Uri "$url/incident/$path" -Method POST -ContentType "application/json"
        Write-Host ($response | ConvertTo-Json) -ForegroundColor Yellow
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

switch ($Incident) {
    "cpu"        { Write-Host "Triggering CPU spike on order-service..."; Invoke-Incident $orderUrl "cpu" }
    "dependency" { Write-Host "Triggering dependency failure on order-service..."; Invoke-Incident $orderUrl "dependency" }
    "npe"        { Write-Host "Triggering NPE on order-service..."; Invoke-Incident $orderUrl "npe" }
    "memory"     { Write-Host "Triggering memory leak on order-service..."; Invoke-Incident $orderUrl "memory" }
    "random"     { Write-Host "Triggering random errors on order-service..."; Invoke-Incident $orderUrl "random" }
    "reset"      {
        Write-Host "Resetting all incidents..."
        Invoke-Incident $orderUrl "reset"
        Invoke-Incident $inventoryUrl "reset"
    }
    "status"     {
        Write-Host "=== Order Service Incident Status ===" -ForegroundColor Cyan
        try { Invoke-RestMethod -Uri "$orderUrl/incident/status" | ConvertTo-Json | Write-Host } catch { Write-Host "order-service unreachable" -ForegroundColor Red }
        Write-Host "=== Inventory Service Incident Status ===" -ForegroundColor Cyan
        try { Invoke-RestMethod -Uri "$inventoryUrl/incident/status" | ConvertTo-Json | Write-Host } catch { Write-Host "inventory-service unreachable" -ForegroundColor Red }
    }
}
