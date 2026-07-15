param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$GitArgs
)

$projectRoot = $PSScriptRoot
$gitDirectory = Join-Path $projectRoot '.excelhub-git'

& git --git-dir=$gitDirectory --work-tree=$projectRoot @GitArgs
exit $LASTEXITCODE
