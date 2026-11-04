# Mini serveur local pour prévisualiser AppsJar : powershell -File serve.ps1
param([int]$Port = 5577)
$root = $PSScriptRoot
$l = [System.Net.HttpListener]::new()
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Host "AppsJar sur http://localhost:$Port/"
$types = @{ ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8"; ".js"="application/javascript; charset=utf-8";
            ".png"="image/png"; ".jpg"="image/jpeg"; ".svg"="image/svg+xml"; ".ico"="image/x-icon" }
while ($l.IsListening) {
  $c = $l.GetContext()
  $p = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath.TrimStart('/'))
  if ($p -eq "") { $p = "index.html" }
  $f = Join-Path $root $p
  if ((Test-Path $f -PathType Leaf) -and ([IO.Path]::GetFullPath($f).StartsWith($root))) {
    $b = [IO.File]::ReadAllBytes($f)
    $ext = [IO.Path]::GetExtension($f).ToLower()
    $c.Response.Headers.Add("Cache-Control", "no-store")
    $c.Response.ContentType = $(if ($types[$ext]) { $types[$ext] } else { "application/octet-stream" })
    $c.Response.OutputStream.Write($b, 0, $b.Length)
  } else { $c.Response.StatusCode = 404 }
  $c.Response.Close()
}
