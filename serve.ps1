$root = "C:\Users\JACK\Desktop\Gad Aguko"
$prefix = "http://127.0.0.1:8765/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Output "Serving $root at $prefix"
$mimes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".pdf"  = "application/pdf"
  ".ico"  = "image/x-icon"
}
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart("/"))
  if ([string]::IsNullOrWhiteSpace($rel)) { $rel = "index.html" }
  $path = [IO.Path]::GetFullPath((Join-Path $root $rel))
  if (-not $path.StartsWith([IO.Path]::GetFullPath($root))) {
    $ctx.Response.StatusCode = 403
    $ctx.Response.Close()
    continue
  }
  if (Test-Path $path -PathType Container) { $path = Join-Path $path "index.html" }
  if (-not (Test-Path $path -PathType Leaf)) {
    $ctx.Response.StatusCode = 404
    $bytes = [Text.Encoding]::UTF8.GetBytes("Not found")
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $ctx.Response.Close()
    continue
  }
  $ext = [IO.Path]::GetExtension($path).ToLowerInvariant()
  $ctx.Response.ContentType = $(if ($mimes.ContainsKey($ext)) { $mimes[$ext] } else { "application/octet-stream" })
  $bytes = [IO.File]::ReadAllBytes($path)
  $ctx.Response.ContentLength64 = $bytes.Length
  $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $ctx.Response.Close()
}
