
@echo off
setlocal EnableDelayedExpansion

title DineFlow - Start All Services

echo.
echo ========================================
echo        Starting DineFlow
echo ========================================
echo.

set "ROOT_DIR=%~dp0"

echo Root: %ROOT_DIR%
echo.

REM ========================================
REM LOAD .ENV
REM ========================================

if not exist "%ROOT_DIR%.env" (
    echo ERROR: .env file not found!
    pause
    exit /b 1
)

echo Loading environment variables...

for /f "usebackq tokens=1,* delims==" %%A in ("%ROOT_DIR%.env") do (
    set "ENV_KEY=%%A"
    set "ENV_VALUE=%%B"

    if not "!ENV_KEY!"=="" (
        if not "!ENV_KEY:~0,1!"=="#" (
            set "ENV_KEY=!ENV_KEY: =!"
            set "!ENV_KEY!=!ENV_VALUE!"
        )
    )
)

echo Environment loaded.
echo.

REM ========================================
REM CHECK ENV
REM ========================================

if not defined JWT_SECRET (
    echo ERROR: JWT_SECRET not loaded.
    pause
    exit /b 1
)

if not defined DB_USERNAME (
    echo ERROR: DB_USERNAME not loaded.
    pause
    exit /b 1
)

if not defined DB_PASSWORD (
    echo ERROR: DB_PASSWORD not loaded.
    pause
    exit /b 1
)

echo JWT_SECRET loaded successfully.
echo Database credentials loaded successfully.
echo.

REM ========================================
REM CHECK SERVICE FOLDERS
REM ========================================

if not exist "%ROOT_DIR%auth_service\gradlew.bat" (
    echo ERROR: auth_service\gradlew.bat not found!
    pause
    exit /b 1
)

if not exist "%ROOT_DIR%menu_service\gradlew.bat" (
    echo ERROR: menu_service\gradlew.bat not found!
    pause
    exit /b 1
)

if not exist "%ROOT_DIR%order_service\gradlew.bat" (
    echo ERROR: order_service\gradlew.bat not found!
    pause
    exit /b 1
)

if not exist "%ROOT_DIR%frontend\package.json" (
    echo ERROR: frontend\package.json not found!
    pause
    exit /b 1
)

echo All project folders found.
echo.

REM ========================================
REM AUTH SERVICE
REM ========================================

echo Starting Auth Service...

start "Auth Service" /D "%ROOT_DIR%auth_service" cmd /k gradlew.bat bootRun

REM ========================================
REM MENU SERVICE
REM ========================================

echo Starting Menu Service...

start "Menu Service" /D "%ROOT_DIR%menu_service" cmd /k gradlew.bat bootRun

REM ========================================
REM ORDER SERVICE
REM ========================================

echo Starting Order Service...

start "Order Service" /D "%ROOT_DIR%order_service" cmd /k gradlew.bat bootRun

REM ========================================
REM FRONTEND
REM ========================================

echo Starting Frontend...

start "Frontend" /D "%ROOT_DIR%frontend" cmd /k npm run dev

echo.
echo ========================================
echo       All Services Started
echo ========================================
echo.
echo Auth Service:  http://localhost:8080
echo Menu Service:  http://localhost:8081
echo Order Service: http://localhost:8082
echo Frontend:      http://localhost:5173
echo.
echo ========================================
echo.

pause

