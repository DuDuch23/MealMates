@echo off
start "MealMates - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
start "MealMates - Backend" cmd /k "cd /d %~dp0backend && symfony server:start"
