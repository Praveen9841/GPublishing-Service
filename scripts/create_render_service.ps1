<#
Create a Render Web Service for this repository using the Render API.

Usage (interactive):
  1. Open PowerShell.
  2. Run: `.	ools\create_render_service.ps1` (adjust path if needed)
  3. Enter your Render API key when prompted.

Notes:
- This script creates a new Web Service that points to the current GitHub repository.
- After creation you will still need to add SMTP credentials (`SMTP_USER`, `SMTP_PASS`) in the Render dashboard.
#>

Param()

function Read-Secret([string]$prompt) {
    Write-Host -NoNewline "$prompt: " -ForegroundColor Yellow
    return Read-Host -AsSecureString | ConvertFrom-SecureString
}

# Interactive prompts
$apiKeyPlain = Read-Host "Enter your Render API key (create at https://dashboard.render.com/account/api-keys)"
if (-not $apiKeyPlain) { Write-Error "API key is required"; exit 1 }

$defaultRepo = "Praveen9841/GPublishing-Service"
$repo = Read-Host "Repository (owner/repo)" -Default $defaultRepo
$name = Read-Host "Service name" -Default "gpublishing-service"
$branch = Read-Host "Branch" -Default "main"
$startCommand = Read-Host "Start command" -Default "node server.js"

Write-Host "Creating Render service '$name' for repo '$repo' (branch: $branch)..." -ForegroundColor Cyan

$body = @{
    name = $name
    repo = "https://github.com/$repo"
    branch = $branch
    type = "web"
    env = "node"
    plan = "free"
    startCommand = $startCommand
    buildCommand = ""
} | ConvertTo-Json -Depth 6

$headers = @{ Authorization = "Bearer $apiKeyPlain"; "Content-Type" = "application/json" }

try {
    $response = Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Method Post -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "Service created successfully." -ForegroundColor Green
    Write-Host "Service ID: $($response.id)"
    Write-Host "Service Dashboard URL: https://dashboard.render.com/services/$($response.id)"
    Write-Host "\nNext steps:" -ForegroundColor Cyan
    Write-Host "1) Open the service URL above and add environment variables: SMTP_USER and SMTP_PASS (and PORT if desired)."
    Write-Host "2) In GitHub, add repository secrets (Settings → Secrets) if you plan to use the GitHub Actions workflow:`RENDER_API_KEY` (your API key) and `RENDER_SERVICE_ID` (the Service ID printed above)."
    Write-Host "3) Push to the 'main' branch; the GitHub Actions workflow will trigger a Render deploy." 
    
    # Ask the user if they want to create environment variables now
    $addEnv = Read-Host "Do you want to add environment variables to this service now? (y/N)"
    if ($addEnv -and $addEnv.ToLower().StartsWith('y')) {
        Write-Host "Enter key/value pairs. Leave key blank to finish." -ForegroundColor Cyan
        while ($true) {
            $key = Read-Host "Env var key (e.g. SMTP_USER)"
            if (-not $key) { break }
            $value = Read-Host "Env var value for $key (will be stored as plain text)"

            $envBody = @{ key = $key; value = $value } | ConvertTo-Json
            try {
                $envResp = Invoke-RestMethod -Uri "https://api.render.com/v1/services/$($response.id)/env-vars" -Method Post -Headers $headers -Body $envBody -ErrorAction Stop
                Write-Host "Added env var: $key" -ForegroundColor Green
            } catch {
                Write-Error "Failed to add env var $key: $($_.Exception.Message)"
            }
        }
        Write-Host "Environment variable creation finished." -ForegroundColor Cyan
    }
} catch {
    Write-Error "Failed to create service: $($_.Exception.Message)"
    if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message }
    exit 1
}
