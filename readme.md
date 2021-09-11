# WebDL Video Downloader

## Todo:

- [ ] Port app to electron
  - [x] Port design
    - [x] Add tailwind to electron
    - [x] Add react to electron
  - [x] Port functionality
    - [x] Fix ffmpeg
    - [x] Fix openExternal() for video info
    - [ ] Fix setPort

## Table of Contents

- [Overview](#overview)
  - [Supported sites](#supported-sites)
- [Instalation guide](#instalation-guide)
- [Using the extension](#using-the-extension)
- [FAQ](#faq)
- [Other information](#other-information)
  - [Main contributers](#main-contributers)
  - [Stuff we used](#stuff-we-used)

## Overview

Meet **WebDL**! This windows application + companion [chrome extension](https://chrome.google.com/webstore/detail/webpage-downloader/nfkaeignpggbjnhhijmggoeploenicdo) downloads a web video on user request, just press the extension button and do the rest on the app!

### Supported sites

- Youtube
- Twitch
- Twitter
- Imgur
- Gyfcat
- [Many others](https://ytdl-org.github.io/youtube-dl/supportedsites.html)

## Instalation guide

- Download the latest release from [here](https://github.com/Timber1900/YoutubeVideoDownloader/releases/latest)
- Install the companion [chrome extension](https://chrome.google.com/webstore/detail/webpage-downloader/nfkaeignpggbjnhhijmggoeploenicdo)
- Start using the app!

## Using the extension

- Open the windows app
- Change settings to the desired ones, if necessary
- On chrome, with the youtube video page open, click the extension icon
- Make any modifications to the video on the queue (use the three dots menu)
- Press the "Download Videos" button to begin downloading
  - Optionally, you can download a single video of the queue by using the "Download Video" button in the video menu

## FAQ

### My app isn't receiving the videos from the extension...

- There may be several thing that lead this to happen, however here are the steps to troubleshoot the problem
  1. Check if the app port (Set port in settings) and extension port (Set port on the right click context menu) are equal, default is 1234 however I recomend using a more general one like 3000 or 3003
  1. If they are equal try changing the port to some other one as the current one may be being used already
  1. Check if you don't have another process of the app running this would block the other one from receiving videos
  1. If none of this works please launch a [issue](https://github.com/Timber1900/YoutubeVideoDownloader/issues/new?assignees=timber1900&labels=Feature+request&template=feature_request.md&title=) detailing the problem and we'll try to help

### Is there a maximum ammount of videos for downloading a playlist?

- Short answer? No... Long answer? It's complicated, while the app itself doesn't have a limit, downloading a 1000 video playlist, for exaple, will take a long time, since the app as to "fetch" information on the video and can do it only one at a time (for now), so even before starting the download it will take a long time, if you dont mind waiting there should be no problem in downloading large playlists

### Where can I request a feature?

- Feature request may or may not be worked on, however if you have a brilliant idea and want to know if we want to work on it please launch a [issue](https://github.com/Timber1900/YoutubeVideoDownloader/issues/new?assignees=timber1900&labels=question&template=question.md&title=)

### What can I do if I want to help to develop this app?

- Fork the Github repository and implement your changes
- Thoroughly test your changes
- Open a pull request to merge your fork
- After some of our testing, if we deem the changes valid, and usefull we will merge your request and add you to our [contributers](#main-contributers)

## Other information

### Main contributers

- [Timber1900](https://github.com/Timber1900) - Lead developer
- [Almeidx](https://github.com/Almeidx) - Small helping hand

### Stuff we used

- [Browserify](https://www.npmjs.com/package/browserify)
- [Express](https://www.npmjs.com/package/express)
- [nw.js](https://nwjs.io/)
- [Install Creator](https://www.clickteam.com/install-creator-2)
- [ytdl-core](https://www.npmjs.com/package/ytdl-core)
- [ytpl](https://www.npmjs.com/package/ytpl)
