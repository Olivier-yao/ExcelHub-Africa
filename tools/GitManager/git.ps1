Clear-Host

function Pause {
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour continuer"
}

while ($true) {

    Clear-Host

    Write-Host "==============================================="
    Write-Host "        ExcelHub-Africa Git Manager"
    Write-Host "==============================================="
    Write-Host ""
    Write-Host "Branche actuelle : $(git branch --show-current)"
    Write-Host ""
    Write-Host "1 - Etat du projet"
    Write-Host "2 - Sauvegarder (Commit + Push)"
    Write-Host "3 - Synchroniser (Pull)"
    Write-Host "4 - Changer de branche"
    Write-Host "5 - Creer une branche feature"
    Write-Host "6 - Voir les branches"
    Write-Host "7 - Fusionner une branche"
    Write-Host "8 - Historique des commits"
    Write-Host "9 - Ouvrir GitHub"
    Write-Host "0 - Quitter"
    Write-Host ""

    $choix = Read-Host "Votre choix"

    switch ($choix) {

        "1" {

            git status

            Pause

        }

        "2" {

            $message = Read-Host "Message du commit"

            git add .

            git commit -m "$message"

            if ($LASTEXITCODE -eq 0) {

                git push

                Write-Host ""
                Write-Host "Projet envoye sur GitHub."

            }

            Pause

        }

        "3" {

            git pull

            Pause

        }

        "4" {

            git branch

            $branche = Read-Host "Nom de la branche"

            git checkout $branche

            Pause

        }

        "5" {

            $nom = Read-Host "Nom de la fonctionnalite"

            git checkout develop

            git pull

            git checkout -b feature/$nom

            git push -u origin feature/$nom

            Pause

        }

        "6" {

            git branch -a

            Pause

        }

        "7" {

            $source = Read-Host "Branche a fusionner"

            git merge $source

            Pause

        }

        "8" {

            git log --oneline --graph --decorate --all -20

            Pause

        }

        "9" {

            Start-Process "https://github.com/Olivier-yao/ExcelHub-Africa"

        }

        "0" {

            exit

        }

    }

}