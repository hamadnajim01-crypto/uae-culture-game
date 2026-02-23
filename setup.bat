@echo off
echo ========================================
echo   UAE Culture Learning Kids - Setup
echo ========================================
echo.

:: Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo This needs to run as Administrator!
    echo Right-click this file and select "Run as administrator"
    pause
    exit /b 1
)

:: Add custom hostname to hosts file
findstr /C:"uae-culture-learning-kids" "%SystemRoot%\System32\drivers\etc\hosts" >nul 2>&1
if %errorLevel% neq 0 (
    echo Adding custom name "uae-culture-learning-kids"...
    echo. >> "%SystemRoot%\System32\drivers\etc\hosts"
    echo 127.0.0.1       uae-culture-learning-kids >> "%SystemRoot%\System32\drivers\etc\hosts"
    echo Done! Custom name added.
) else (
    echo Custom name already exists. Skipping.
)

echo.
echo ========================================
echo   Setup complete!
echo   Now run: npm start
echo   Then open: http://uae-culture-learning-kids:3000
echo ========================================
pause
