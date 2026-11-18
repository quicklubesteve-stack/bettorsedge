$wsh = New-Object -ComObject WScript.Shell
$sc = $wsh.CreateShortcut("C:\Users\steve\OneDrive\Desktop\SportsEdge AI - Safe Bets.lnk")
Write-Host "Target: $($sc.TargetPath)"
Write-Host "Icon: $($sc.IconLocation)"
Write-Host "WorkDir: $($sc.WorkingDirectory)"
