$text = [System.IO.File]::ReadAllText("d:\anti-gv\25. 120pie(new)_2\scratch\franchise_staged.tsx", [System.Text.Encoding]::Unicode)
$cp949 = [System.Text.Encoding]::GetEncoding(949)
$bytes = $cp949.GetBytes($text)
$utf8 = [System.Text.Encoding]::UTF8
$recoveredText = $utf8.GetString($bytes)
[System.IO.File]::WriteAllText("d:\anti-gv\25. 120pie(new)_2\scratch\franchise_recovered.tsx", $recoveredText, $utf8)
Write-Output "Successfully recovered franchise page to franchise_recovered.tsx"
