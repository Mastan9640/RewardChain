@echo off
cd /d "%~dp0"
echo ========================================
echo RewardChain - Compile and Deploy
 echo ========================================
call npm.cmd run compile
if errorlevel 1 goto :error
call npm.cmd run deploy
if errorlevel 1 goto :error
echo.
echo Deployment completed.
echo Copy the EmployeeRewardRegistry address from above.
echo Update frontend\src\config.js with that address.
pause
exit /b 0
:error
echo.
echo Deployment failed. Check the terminal message above.
pause
exit /b 1
