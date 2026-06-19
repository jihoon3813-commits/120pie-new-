$files = Get-ChildItem "d:\anti-gv\25. 120pie(new)_2\scratch" -Filter "*.txt"
$cp949 = [System.Text.Encoding]::GetEncoding(949)
$utf8 = [System.Text.Encoding]::UTF8

foreach ($f in $files) {
    $filepath = $f.FullName
    $targetPath = Join-Path "d:\anti-gv\25. 120pie(new)_2\scratch" ($f.BaseName + "_utf8" + $f.Extension)
    try {
        # Read raw bytes to avoid automatic .NET string conversion issues
        $bytes = [System.IO.File]::ReadAllBytes($filepath)
        # Check if the bytes look like UTF-16
        if ($bytes.Length -ge 2 -and $bytes[0] -eq 0xff -and $bytes[1] -eq 0xfe) {
            # UTF-16LE, let's read as Unicode and then encode as CP949 to get raw bytes
            $text = [System.IO.File]::ReadAllText($filepath, [System.Text.Encoding]::Unicode)
            $rawBytes = $cp949.GetBytes($text)
            $decoded = $utf8.GetString($rawBytes)
        } else {
            # Let's assume it's CP949 bytes
            $decoded = $cp949.GetString($bytes)
        }
        [System.IO.File]::WriteAllText($targetPath, $decoded, $utf8)
        Write-Output "Recovered: $($f.Name) -> $($f.BaseName)_utf8.txt"
    } catch {
        Write-Output "Failed to recover $($f.Name): $_"
    }
}
