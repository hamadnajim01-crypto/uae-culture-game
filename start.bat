@echo off
echo.
echo   ================================================
echo        UAE Culture Learning Kids
echo        Starting the game server...
echo   ================================================
echo.
cd /d "%~dp0"
start http://uae-culture-learning-kids:3000
node server.js
pause
