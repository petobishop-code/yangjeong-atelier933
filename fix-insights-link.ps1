$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$files = Get-ChildItem -Path $root -Filter *.html -File -Recurse
$changed = @()

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $newContent = $content.Replace('href="insights.html"', 'href="index.html#insights"')

    if ($newContent -ne $content) {
        [System.IO.File]::WriteAllText(
            $file.FullName,
            $newContent,
            (New-Object System.Text.UTF8Encoding($false))
        )
        $changed += $file.FullName
    }
}

Write-Host ""
Write-Host "INSIGHTS 링크 수정 완료" -ForegroundColor Green
Write-Host ('수정된 HTML 파일 수: ' + $changed.Count)
Write-Host ""

foreach ($item in $changed) {
    Write-Host ('- ' + (Split-Path $item -Leaf))
}

Write-Host ""
Write-Host '변경 내용: href="insights.html" -> href="index.html#insights"'
Write-Host "이 창을 닫기 전에 위 수정 파일 수를 확인하세요."
Read-Host "엔터를 누르면 종료"
