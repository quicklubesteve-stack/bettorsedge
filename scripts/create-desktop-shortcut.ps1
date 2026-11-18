$desktopPaths = @(
    [Environment]::GetFolderPath("Desktop"),
    "C:\Users\steve\OneDrive\Desktop"
) | Select-Object -Unique

$targetBat = "C:\Users\steve\OneDrive\Desktop\sports betting\Start-SportsEdge.bat"
$workingDir = "C:\Users\steve\OneDrive\Desktop\sports betting"
$iconPath = "C:\Users\steve\OneDrive\Desktop\sports betting\sportsedge.ico"

$wsh = New-Object -ComObject WScript.Shell

foreach ($desktop in $desktopPaths) {
    if (Test-Path $desktop) {
        $shortcutPath = Join-Path $desktop "SportsEdge AI - Safe Bets.lnk"
        $shortcut = $wsh.CreateShortcut($shortcutPath)
        $shortcut.TargetPath = $targetBat
        $shortcut.WorkingDirectory = $workingDir
        $shortcut.IconLocation = "$iconPath, 0"
        $shortcut.Description = "SportsEdge AI — Safe Bets & Sports Betting Predictions"
        $shortcut.Save()
        Write-Host "Created Desktop Shortcut: $shortcutPath"

        # Also create clean "SportsEdge AI.lnk"
        $mainShortcutPath = Join-Path $desktop "SportsEdge AI.lnk"
        $mainShortcut = $wsh.CreateShortcut($mainShortcutPath)
        $mainShortcut.TargetPath = $targetBat
        $mainShortcut.WorkingDirectory = $workingDir
        $mainShortcut.IconLocation = "$iconPath, 0"
        $mainShortcut.Description = "SportsEdge AI — Sports Betting Intelligence Platform"
        $mainShortcut.Save()
        Write-Host "Created Desktop Shortcut: $mainShortcutPath"
    }
}
