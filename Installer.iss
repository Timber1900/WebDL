; Script generated by the Inno Setup Script Wizard.
; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!

#define MyAppName "WebDL"
#define MyAppVersion "v11.1.2"
#define MyAppPublisher "Timber1900"
#define MyAppURL "https://www.hteixeira.me/"
#define MyAppExeName "WebDL.exe"

[Setup]
; NOTE: The value of AppId uniquely identifies this application. Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{03160568-62E9-48FD-B295-7A39C9D2CF98}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DisableProgramGroupPage=yes
LicenseFile=LICENSE
ArchitecturesInstallIn64BitMode=x64
; Uncomment the following line to run in non administrative install mode (install for current user only.)
;PrivilegesRequired=lowest
OutputDir=.
OutputBaseFilename=WebDL
SetupIconFile=assets\webdl.ico
Compression=lzma
SolidCompression=yes
WizardStyle=modern

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "app\out\WebDL-win32-x64\chrome_100_percent.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\chrome_200_percent.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\d3dcompiler_47.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\ffmpeg.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\icudtl.dat"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\libEGL.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\libGLESv2.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\LICENSE"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\LICENSES.chromium.html"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\resources.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\snapshot_blob.bin"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\v8_context_snapshot.bin"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\version"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\vk_swiftshader_icd.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\vk_swiftshader.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\vulkan-1.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\src\renderer\icons\webdl.ico"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\locales\*"; DestDir: "{app}\locales"; Flags: ignoreversion
Source: "app\out\WebDL-win32-x64\resources\app\*"; DestDir: "{app}\resources\app"; Flags: ignoreversion recursesubdirs
Source: "app\out\WebDL-win32-x64\swiftshader\*"; DestDir: "{app}\swiftshader"; Flags: ignoreversion

[Registry]
Root: HKLM; Subkey: "SOFTWARE\WOW6432Node\WebDL"; ValueType: string; ValueName: "Version"; ValueData: "{#MyAppVersion}"

; NOTE: Don't use "Flags: ignoreversion" on any shared system files

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\webdl.ico"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon; IconFilename: "{app}\webdl.ico"


[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

