$text = [System.IO.File]::ReadAllText("d:\anti-gv\25. 120pie(new)_2\scratch\diff_franchise.txt", [System.Text.Encoding]::Unicode)
$cp949 = [System.Text.Encoding]::GetEncoding(949)
$bytes = $cp949.GetBytes($text)
$utf8 = [System.Text.Encoding]::UTF8
$recoveredText = $utf8.GetString($bytes)
[System.IO.File]::WriteAllText("d:\anti-gv\25. 120pie(new)_2\scratch\diff_franchise_recovered.txt", $recoveredText, $utf8)
Write-Output "Successfully recovered diff_franchise.txt to diff_franchise_recovered.txt"
