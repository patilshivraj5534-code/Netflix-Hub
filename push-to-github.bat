@echo off
echo Initializing Git repository...
git init

echo Adding all files...
git add .

echo Committing changes...
git commit -m "Initial commit with OMDB API integration"

echo Setting main branch...
git branch -M main

echo Adding remote repository...
git remote add origin https://github.com/patilshivraj5534-code/manu.git

echo Pushing to GitHub...
git push -u origin main

echo Done!
pause
