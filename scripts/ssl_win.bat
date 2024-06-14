@ECHO OFF
SETLOCAL

SET HOSTNAME=localhost

SET ENVFILE=..\.env.test
SET ENVLOCAL_FILE=..\.env.local

SET DEVDIR=.\.dev
SET SSLDIR=%DEVDIR%\ssl

REM Check mkcert
CALL :EXECUTE_FUNCTION "winget ls -q FiloSottile.mkcert -e --disable-interactivity | FINDSTR /i mkcert" && (
	winget install mkcert -h
	CALL ssl_win.bat
	EXIT -1
)
CALL mkcert -install

REM Check folders
IF NOT EXIST .%DEVDIR% (
	MD .%DEVDIR%
)
IF NOT EXIST .%SSLDIR% (
	MD .%SSLDIR%
)

REM Create SSL server certificate
CALL mkcert %HOSTNAME%

REM Move files
MOVE "%HOSTNAME%.pem" ".%SSLDIR%\%HOSTNAME%.crt"
MOVE "%HOSTNAME%-key.pem" ".%SSLDIR%\%HOSTNAME%.key"

REM Copy `.env.local` if not exists
IF NOT EXIST %ENVFILE% (
	COPY %ENVFILE% %ENVLOCAL_FILE%
)

REM Write SSL files
ECHO SERVER_SSLCERT=%SSLDIR%\%HOSTNAME%.crt> %ENVLOCAL_FILE%
ECHO SERVER_SSLKEY=%SSLDIR%\%HOSTNAME%.key> %ENVLOCAL_FILE%

EXIT /b

:EXECUTE_FUNCTION
	CMD /c %* > NUL
	if %ERRORLEVEL% NEQ 0 (
		EXIT /b 0
	)
	EXIT /b 1
