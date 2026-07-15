<#
.SYNOPSIS
    Database backup script for Smart Inventory Management System
.DESCRIPTION
    Creates backups of SQL Server 2022 database and Redis cache
.PARAMETER BackupPath
    Directory path to store backups (default: .\backups)
.PARAMETER Compress
    Compress backup files into ZIP archive
.PARAMETER RetentionDays
    Number of days to retain backups (default: 30)
.PARAMETER CloudSync
    Upload backups to cloud storage (Azure Blob, AWS S3)
#>

[CmdletBinding()]
param(
    [string]$BackupPath = ".\backups",
    [switch]$Compress,
    [int]$RetentionDays = 30,
    [switch]$CloudSync
)

$ErrorActionPreference = "Stop"

# Ensure backup directory exists
if (-not (Test-Path $BackupPath)) {
    New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
    Write-Host "Created backup directory: $BackupPath" -ForegroundColor Green
}

# Generate timestamped backup names
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$sqlBackupFile = Join-Path $BackupPath "sqlserver-backup-$timestamp.bak"
$redisBackupFile = Join-Path $BackupPath "redis-$timestamp.rdb"
$logFile = Join-Path $BackupPath "backup-$timestamp.log"

function Write-Log {
    param([string]$Message)
    $logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - $Message"
    Add-Content -Path $logFile -Value $logEntry
    Write-Host $Message -ForegroundColor Cyan
}

try {
    Write-Log "Starting backup process..."
    Write-Log "Backup path: $BackupPath"

    # Load environment variables
    if (Test-Path ".env") {
        Get-Content ".env" | ForEach-Object {
            if ($_ -match "^(.*?)=(.*)$") {
                [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
            }
        }
    }

    # SQL Server Backup
    Write-Log "Starting SQL Server backup..."
    
    $sqlCommand = @"
BACKUP DATABASE SmartInventory 
TO DISK = N'/var/opt/mssql/data/SmartInventory-backup-$timestamp.bak' 
WITH FORMAT, MEDIANAME = 'SmartInventory-Backup', NAME = 'Full Backup', SKIP, NOREWIND, NOUNLOAD, STATS = 10;
GO
BACKUP LOG SmartInventory 
TO DISK = N'/var/opt/mssql/data/SmartInventory-log-$timestamp.trn' 
WITH FORMAT, MEDIANAME = 'SmartInventory-Log-Backup', NAME = 'Transaction Log Backup', SKIP, NOREWIND, NOUNLOAD, STATS = 10;
GO
"@

    $sqlCommand | docker exec -i smartinventory-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $env:SA_PASSWORD
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "SQL Server backup command executed successfully."
        
        # Copy backup files from container
        docker cp "smartinventory-sqlserver:/var/opt/mssql/data/SmartInventory-backup-$timestamp.bak" $sqlBackupFile
        docker cp "smartinventory-sqlserver:/var/opt/mssql/data/SmartInventory-log-$timestamp.trn" (Join-Path $BackupPath "sqlserver-log-$timestamp.trn")
        
        if (Test-Path $sqlBackupFile) {
            Write-Log "SQL Server backup completed: $sqlBackupFile"
        }
        else {
            throw "SQL Server backup file not found after copy"
        }
    }
    else {
        throw "SQL Server backup failed with exit code: $LASTEXITCODE"
    }

    # Redis Backup
    Write-Log "Starting Redis backup..."
    
    docker exec smartinventory-redis redis-cli -a $env:REDIS_PASSWORD BGSAVE
    Start-Sleep -Seconds 5
    
    docker exec smartinventory-redis redis-cli -a $env:REDIS_PASSWORD LASTSAVE
    
    docker cp "smartinventory-redis:/data/dump.rdb" $redisBackupFile
    
    if (Test-Path $redisBackupFile) {
        Write-Log "Redis backup completed: $redisBackupFile"
    }
    else {
        throw "Redis backup file not found after copy"
    }

    # Compress backups if specified
    if ($Compress) {
        Write-Log "Compressing backups..."
        $zipFile = Join-Path $BackupPath "backup-$timestamp.zip"
        
        if (Test-Path $zipFile) {
            Remove-Item $zipFile -Force
        }
        
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        [System.IO.Compression.ZipFile]::CreateFromDirectory($BackupPath, $zipFile)
        
        # Remove individual files after compression
        Remove-Item $sqlBackupFile -Force
        Remove-Item $redisBackupFile -Force
        Remove-Item (Join-Path $BackupPath "sqlserver-log-$timestamp.trn") -Force
        
        Write-Log "Backups compressed to: $zipFile"
    }

    # Cloud sync if specified
    if ($CloudSync) {
        Write-Log "Syncing to cloud storage..."
        
        if (-not $env:AZURE_STORAGE_CONNECTION_STRING) {
            Write-Warning "Azure Storage connection string not configured. Skipping cloud sync."
        }
        else {
            $backupFiles = Get-ChildItem $BackupPath -Filter "backup-$timestamp.*"
            foreach ($file in $backupFiles) {
                $destination = "backups/smartinventory/$(Split-Path $file -Leaf)"
                az storage blob upload `
                    --connection-string $env:AZURE_STORAGE_CONNECTION_STRING `
                    --container-name backups `
                    --file $file.FullName `
                    --name $destination
                Write-Log "Uploaded: $destination"
            }
        }
    }

    # Clean up old backups
    Write-Log "Cleaning up backups older than $RetentionDays days..."
    $cutoffDate = (Get-Date).AddDays(-$RetentionDays)
    $oldBackups = Get-ChildItem $BackupPath -Recurse | Where-Object { $_.LastWriteTime -lt $cutoffDate }
    
    if ($oldBackups) {
        $oldBackups | Remove-Item -Force
        Write-Log "Removed $($oldBackups.Count) old backup(s)."
    }

    $totalSize = (Get-ChildItem $BackupPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Log "Current backup size: $([math]::Round($totalSize, 2)) MB"
    
    Write-Log "Backup completed successfully!"
    Write-Log "Log file: $logFile"
}
catch {
    Write-Host "Backup failed: $_" -ForegroundColor Red
    Write-Log "ERROR: $_"
    exit 1
}
