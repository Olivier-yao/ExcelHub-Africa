param(
    [Parameter(Mandatory = $true)]
    [string]$Message
)

git add .

git commit -m $Message

if ($LASTEXITCODE -eq 0) {
    git push
    Write-Host ""
    Write-Host "Projet envoyé sur GitHub."
} else {
    Write-Host ""
    Write-Host "Aucun changement à enregistrer."
}