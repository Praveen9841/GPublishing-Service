@echo off
echo ========================================
echo GPublishing Services Report Converter
echo ========================================
echo.
echo Installing required libraries...
echo.
pip install python-docx beautifulsoup4 lxml
echo.
echo ========================================
echo Converting HTML to Word...
echo ========================================
echo.
python convert_to_word.py
echo.
echo ========================================
echo Press any key to exit...
pause >nul
