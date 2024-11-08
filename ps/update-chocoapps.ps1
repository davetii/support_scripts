# Requires -RunAsAdministrator

# Script configuration
$logPath = "C:\Logs\ChocoUpdates"
$logFile = Join-Path $logPath "choco_updates.log"
$date = Get-Date -Format "yyyyMMdd_HHmmss"

# Create log directory if it doesn't exist
if (-not (Test-Path $logPath)) {
    New-Item -ItemType Directory -Path $logPath | Out-Null
}

# Function to write to log file
function Write-Log {
    param($Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $Message" | Tee-Object -FilePath $logFile -Append
}

# Archive old log file if it exists
if (Test-Path $logFile) {
    $archiveName = "choco_updates_$date.zip"
    $archivePath = Join-Path $logPath $archiveName
    
    Write-Log "Archiving previous log file to $archiveName"
    Compress-Archive -Path $logFile -DestinationPath $archivePath -Force
    Remove-Item $logFile -Force
}

# Start new log file
Write-Log "=== Chocolatey Update Script Started ==="
Write-Log "Checking for outdated packages..."

try {
    # Get outdated packages
    $outdatedApps = choco outdated -r --ignore-pinned | Select-Object -First 5
    
    if ($outdatedApps) {
        Write-Log "Found the following outdated packages:"
        $outdatedApps | ForEach-Object {
            $packageInfo = $_ -split '\|'
            Write-Log ("Package: {0} Current: {1} Available: {2}" -f $packageInfo[0], $packageInfo[1], $packageInfo[2])
        }

        # Update each package
        $outdatedApps | ForEach-Object {
            $packageName = ($_ -split '\|')[0]
            Write-Log ("Starting update for package [{0}]" -f $packageName)
            
            try {
                $updateOutput = & choco upgrade $packageName -y | Out-String
                Write-Log ("Update output for package [{0}]" -f $packageName)
                Write-Log $updateOutput
            }
            catch {
                Write-Log ("Error updating package [{0}]: {1}" -f $packageName, $_)
            }
        }
    }
    else {
        Write-Log "No outdated packages found."
    }
}
catch {
    Write-Log ("Error during script execution: {0}" -f $_)
}

Write-Log "=== Chocolatey Update Script Completed ==="