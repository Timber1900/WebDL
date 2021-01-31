@echo off
"C:\Program Files (x86)\Resource Hacker\ResourceHacker.exe" -open "./dist/src/win64/src.exe" -save "./dist/src/win64/Web-dl.exe" -action addoverwrite -res "../Assets/icon.ico" -mask ICONGROUP,IDR_MAINFRAME,
cd "../Assets/"
copy icon.ico "../ServerFrontEnd/dist/src/win64/"
cd "../ServerFrontEnd/"
cd "./dist/src/win64"
del /f src.exe
cd "../../../"
echo Done!