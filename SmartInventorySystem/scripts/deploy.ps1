<#
.SYNOPSIS
    PowerShell deployment script for Smart Inventory Management System
.DESCRIPTION
    Deploys the system using Docker Compose with health checks, migrations, and rollback support
.PARAMETER Environment
    Target environment (Production, Staging, Development)
.PARAMETER WhatIf
    Shows what would be deployed without making changes
#>

[CmdletBinding(SupportsShouldProcess=$true)]
param(
    [ValidateSet("Production", "Staging", "Development")]
    [string]$Environment = "Production",
    [switch]$WhatIf
)

$ErrorActionPreference = "Stop"

# Load environment variables
function Load-EnvironmentVariables {
    if (-not (Test-Path ".env")) {
        Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
        Write-Host "Please update .env file with your configuration and run again." -ForegroundColor Red
        exit 1
    }

    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^(.*?)=(.*)$") {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

# Validate prerequisites
function Test-Prerequisites {
    Write-Host "Validating prerequisites..." -ForegroundColor Cyan
    
    $commands = @("docker", "docker-compose", "dotnet", "node")
    foreach ($cmd in $commands) {
        if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
            throw "$cmd is not installed or not in PATH"
        }
    }

    if (-not (Test-Path "docker-compose.yml")) {
        throw "docker-compose.yml not found in current directory"
    }

    Write-Host "All prerequisites satisfied." -ForegroundColor Green
}

# Backup database before deployment
function Invoke-PreDeployBackup {
    Write-Host "Creating pre-deployment backup..." -ForegroundColor Yellow
    & "./scripts/backup.ps1" -BackupPath "./backups/pre-deploy"
}

# Build Docker images
function Build-DockerImages {
    Write-Host "Building Docker images..." -ForegroundColor Yellow
    
    if ($PSCmdlet.ShouldProcess("Docker images")) {
        docker-compose --env-file .env build --no-cache
    }
}

# Run database migrations
function Invoke-DatabaseMigration {
    Write-Host "Running database migrations..." -ForegroundColor Yellow
    
    if ($PSCmdlet.ShouldProcess("Database", "Apply migrations")) {
        docker-compose --env-file .env run --rm -T backend dotnet ef database update --no-build
    }
}

# Deploy services
function Invoke-Deployment {
    Write-Host "Deploying services..." -ForegroundColor Yellow
    
    if ($PSCmdlet.ShouldProcess("Services", "Deploy with Docker Compose")) {
        docker-compose --env-file .env -f "docker-compose.yml" -f "docker-compose.$Environment.yml" up -d --force-recreate --remove-orphans
    }
}

# Wait for services to be healthy
function Wait-ForServicesHealth {
    Write-Host "Waiting for services to be healthy..." -ForegroundColor Yellow
    Start-Sleep -Seconds 45

    $services = @("smartinventory-sqlserver", "smartinventory-redis", "smartinventory-ai", "smartinventory-backend", "smartinventory-nginx")
    foreach ($service in $services) {
        $health = docker inspect --format='{{.State.Health.Status}}' $service 2>$null
        if ($health -ne "healthy") {
            Write-Warning "Service $service is not healthy (status: $health)"
        }
    }
}

# Verify deployment
function Test-DeploymentHealth {
    Write-Host "Verifying deployment..." -ForegroundColor Yellow
    
    $urls = @(
        "http://localhost:8080/health",
        "http://localhost:3000",
        "http://localhost:8000/health"
    )

    foreach ($url in $urls) {
        try {
            $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 5 -UseBasicParsing
            Write-Host "$url is healthy (Status: $($response.StatusCode))" -ForegroundColor Green
        }
        catch {
            Write-Warning "$url is not responding"
        }
    }

    Write-Host "Deployment status:" -ForegroundColor Cyan
    docker-compose --env-file .env ps
}

# Rollback function
function Invoke-Rollback {
    param([string]$PreviousImage)
    
    Write-Host "Rolling back to previous version: $PreviousImage" -ForegroundColor Red
    
    docker-compose --env-file .env down
    docker-compose --env-file .env up -d --force-recreate
    
    Write-Host "Rollback completed." -ForegroundColor Yellow
}

# Main execution
try {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " Smart Inventory System Deployment" -ForegroundColor Cyan
    Write-Host " Environment: $Environment" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    
    if ($WhatIf) {
        Write-Host "Running in WhatIf mode - no changes will be made." -ForegroundColor Yellow
        exit 0
    }

    Load-EnvironmentVariables
    Test-Prerequisites
    Invoke-PreDeployBackup
    Build-DockerImages
    Invoke-DatabaseMigration
    Invoke-Deployment
    Wait-ForServicesHealth
    Test-DeploymentHealth

    Write-Host "========================================" -ForegroundColor Green
    Write-Host " Deployment completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
}
catch {
    Write-Host "Deployment failed: $_" -ForegroundColor Red
    if ($PreviousImage) {
        Invoke-Rollback -PreviousImage $PreviousImage
    }
    exit 1
}
