## YoutubeDl Video Downloader

`Dependencies:`
    YoutubeDl Python,
    Ffmpeg,
    Python 3.8,

`Instalation Guide:`
 
~~~
Install Python (Either from website or windows store),
Add Python to path,
Install Pip (See links),
Install YoutubeDL: "pip install youtube_dl"
Extract 'Server YTDL' to some location on your computer,
Edit server.cmd to contain the path to your folder,
Put server.cmd on your root directory (For example C:\),
Open regestry,
Go to "Computer\HKEY_CLASSES_ROOT\Directory\Background\shell",
Create a yey named 'ytdl',
Change default key value to Open YTDL Server,
Create a new string value name 'icon',
Set its value to the location of your 'server.ico',
Create a new key inside 'ytdl' named 'command',
Change its default value to 'cmd.exe /C "C:/server.cmd"',
Close regestry editor,
You should now have a option to open the server when you right click somewhere on your computer (See photo1.png),
Extract 'Chrome Extension' somewhere on your computer,
Add the extension as a developer mode extension to chrome,
Done!!
~~~


`Using the downloader`

~~~
Open the server,
Right click inside chrome and chose filetype (See photo2.png),
Click the button on the extension menu (See photo3.png),
File should start the download (See photo4.png),
Output file will be located at your Videos folder inside "Youtube"
~~~

`Links:` <br />Pip: https://pip.pypa.io/en/stable/reference/pip_install/#pip-install, <br />Ffmpeg: https://ffmpeg.zeranoe.com/builds/ <br />




`Main contributers:` <br />Timber1900:   https://github.com/Timber1900, <br />Almeida: https://github.com/Almeeida

`Other information:` <br />When active the server will run on port 1234, changing this is possible *but* you will have to change the server.js file on "Server ytdl" and  look for 'http://localhost:1234' inside the bundle.js file 'on Chrome Extension'.

`Some other stuff we used:`<br />Browserify: "https://www.npmjs.com/package/browserify" <br />Express: "https://www.npmjs.com/package/express"