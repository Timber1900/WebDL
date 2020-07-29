## YoutubeDl Video Downloader

[Release](https://github.com/Timber1900/YoutubeVideoDownloader/releases/tag/2.0)


`Dependencies:`
    Ffmpeg,

`Instalation Guide:`
 
~~~
Download FFMPEG,
Extract the zip to root,
Add FFMPEG/bin to path,
Execute 'Youtube Downloader.exe'
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

`Links:` <br />Ffmpeg: https://ffmpeg.zeranoe.com/builds/ <br />




`Main contributers:` <br />Timber1900:   https://github.com/Timber1900, <br />Almeida: https://github.com/Almeidx

`Other information:` <br />When active the server will run on port 1234, changing this is possible *but* you will have to change the server.js file on "Server ytdl" and  look for 'http://localhost:1234' inside the bundle.js file 'on Chrome Extension'.

`Some other stuff we used:`<br />Browserify: "https://www.npmjs.com/package/browserify" <br />Express: "https://www.npmjs.com/package/express" <br />PyInstaller: "https://pypi.org/project/PyInstaller/" <br /> Install Creator: "https://www.clickteam.com/install-creator-2"

`Extra Info` <br /> You can chose between mp4 and mp4 by right clicking a page in the browser and going to "Youtube Downloader" <br /> Output folder is "Videos/Youtube", might add custom folders in the future <br /> If you want to remove the warning of developer mode extensions use "https://github.com/Ceiridge/Chrome-Developer-Mode-Extension-Warning-Patcher"
