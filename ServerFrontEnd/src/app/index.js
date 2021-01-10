const fs = require('fs');
const { join } = require('path');
const OS = require('os');
const ytdl = require('ytdl-core');
const express = require('express');
const cp = require('child_process');
const ffmpeg = require('ffmpeg-static');
const app = express();
let ytpl = require('ytpl');
const { get } = require('http');

let port;
try {
  port = require(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'port.json')).port;
} catch (err) {
  port = '1234';
  fs.mkdir(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader'), () => {});
  fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'port.json'), JSON.stringify({ port }));
}

console.log(port);

app.listen(Number(port));
app.use(express.json());
let path;
try {
  path = require(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'path.json')).path;
} catch (err) {
  path = join(OS.homedir(), 'Videos', 'Youtube');
  fs.mkdir(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader'), () => {});
  fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'path.json'), JSON.stringify({ path }));
}

app.post('/', (req, res) => {
  const { body } = req;
  res.send('Video received');
  console.log(body);
  download(body.url);
});

function selectFolder() {
  fs.writeFileSync(
    join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'path.json'),
    JSON.stringify({ path: document.getElementById('file').value }),
  );
  path = document.getElementById('file').value;
}

async function download(url) {
  let videos = [];
  try {
    playlist = await ytpl(url, { pages: Infinity });
    videos = playlist.items;
  } catch {
    videos = [{ url }];
  }

  if (document.getElementById('sel').value == 'mp3') {
    const callNewVid = (a) => {
      mp3Download(videos[a], a, callback);
    };
    const callback = (a) => {
      if (a < videos.length) {
        callNewVid(a);
      }
    };
    callNewVid(0);
  } else {
    const callNewVid = (a) => {
      mp4Download(videos[a], a, callback);
    };
    const callback = (a) => {
      if (a < videos.length) {
        callNewVid(a);
      }
    };
    callNewVid(0);
  }
}

async function mp4Download(vid, curVid, callback) {
  const time = (hrStart) => {
    const hrDiff = process.hrtime(hrStart);
    return hrDiff[0] + hrDiff[1] / 1e9;
  };  
  let cont = true;

  const info = await ytdl.getInfo(vid.url);
  if(info.formats.length == 0){
    console.error("No video formats available");
    callback(curVid + 1);
    cont = false
  }
  title = info.videoDetails.title;
  document.getElementById('vidprev').src = info.videoDetails.thumbnails[3].url

  if (document.getElementById('playlist').checked) {
    if (!confirm('Do you want to download - ' + title + '?')) {
      callback(curVid + 1);
      cont = false;
    }
  }
  let startTime = '00:00:00';
  let duration = info.videoDetails.lengthSeconds;
  const getTime = (callback) => {
    const fullsec = info.videoDetails.lengthSeconds;
    const fullmin = fullsec / 60;
    const hours = Math.floor(fullmin / 60);
    const min = Math.floor(fullmin - hours * 60);
    const sec = Math.floor(fullsec - min * 60);
    let isGood = true;

    const start = prompt('Give a start position for the video (hh:mm:ss)', '00:00:00');
    const end = prompt('Give a end position for the video (hh:mm:ss)', `${hours}:${min}:${sec}`);

    const numreg = /^[0-9]+$/;

    const startVals = start.split(':');
    let begin;
    if (numreg.test(startVals[0]) && numreg.test(startVals[1]) && numreg.test(startVals[2])) {
      begin = parseInt(startVals[2]) + parseInt(startVals[1]) * 60 + parseInt(startVals[0]) * 3600;
    } else {
      isGood = false;
    }
    const endVals = end.split(':');
    let stop;
    if (numreg.test(endVals[0]) && numreg.test(endVals[1]) && numreg.test(endVals[2])) {
      stop = parseInt(endVals[2]) + parseInt(endVals[1]) * 60 + parseInt(endVals[0]) * 3600;
    } else {
      isGood = false;
    }

    if (parseInt(begin) >= 0 && parseInt(stop) <= fullsec && parseInt(stop) > parseInt(begin)) {
      return [start, stop - begin];
    } else {
      isGood = false;
    }

    if (!isGood) {
      alert('Invalid start/end times');
      if (confirm('Try again?')) {
        result = callback(callback);
        return result;
      } else {
        return ['00:00:00', fullsec];
      }
    }
  };


  if (document.getElementById('startend').checked) {
    const result = getTime(getTime);
    startTime = result[0];
    duration = result[1];
    console.log(result);
  }
  if (cont) {
    let videoFormat;
    let foundFormat = false;
    for (const f of info.formats) {
      if (f.quality == document.getElementById('qual').value && f.container == 'mp4') {
        videoFormat = f;
        foundFormat = true;
        break;
      }
    }
    if (!foundFormat) {
      alert('Choosen format not found');
      return;
    }
    document.getElementById('curvid').innerHTML = 'Downloading ' + title;

    const regex = /["*/:<>?\\|]/g;
    title = title.replace(regex, '');

    if (document.getElementById('check').checked) {
      title = prompt('Choose a name for the file', title) || title;
    }
    
    let oldDownloaded = 0;
    let hrStart = process.hrtime();
    const audio = ytdl(vid.url, { quality: 'highestaudio' });
    const toMB = (i) => i / 1e6;
    const video = ytdl(vid.url, { format: videoFormat }).on('progress', (_, downloaded, total) => {
      let elapsed = time(hrStart);
      hrStart = process.hrtime();
      const mbData = toMB(downloaded - oldDownloaded);
      oldDownloaded = downloaded;
      const percent = ((downloaded / total) * 100).toFixed(2);
      const vel = mbData / elapsed;
      document.getElementById('prog').value = percent;
      document.getElementById('prg').innerHTML = percent.toString() + '%';
      document.getElementById('vel').innerHTML = vel.toFixed(2) + ' MB/s';
    });
    video.on('error', (err) => {
      console.error(err);
      callback(curVid + 1);
    });
    audio.on('error', (err) => {
      console.error(err);
      callback(curVid + 1);
    });
    // Start the ffmpeg child process
    const ffmpegProcess = cp.spawn(
      ffmpeg,
      [
        '-loglevel',
        '8',
        '-hide_banner',
        '-progress',
        'pipe:3',
        '-i',
        'pipe:4',
        '-i',
        'pipe:5',
        '-map',
        '0:a',
        '-map',
        '1:v',
        '-c:v',
        'copy',
        '-y',
        document.getElementById('startend').checked
          ? join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'tempvideo.mkv')
          : join(path, title + '.mkv'),
      ],
      {
        windowsHide: true,
        stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'pipe', 'pipe'],
      },
    );
    ffmpegProcess.on('close', () => {
      if (document.getElementById('startend').checked) {
        document.getElementById('curvid').innerHTML = 'Cutting video ...';
        const secondffmpegprocess = cp.spawn(
          ffmpeg,
          [
            '-ss',
            startTime,
            '-i',
            join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'tempvideo.mkv'),
            '-to',
            duration,
            '-c',
            'copy',
            join(path, title + '.mkv'),
          ],
          {
            windowsHide: true,
            stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'pipe', 'pipe'],
          },
        );
        secondffmpegprocess.on('close', () => {
          fs.unlinkSync(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'tempvideo.mkv'));
          document.getElementById('curvid').innerHTML = 'Done downloading ' + title;
          callback(curVid + 1);
        });
      } else {
        document.getElementById('curvid').innerHTML = 'Done downloading ' + title;
        callback(curVid + 1);
      }
    });
    audio.pipe(ffmpegProcess.stdio[4]);
    video.pipe(ffmpegProcess.stdio[5]);
  }
}

async function mp3Download(vid, curVid, callback) {
  const time = (hrStart) => {
    const hrDiff = process.hrtime(hrStart);
    return hrDiff[0] + hrDiff[1] / 1e9;
  };

  video = ytdl(vid.url, { quality: 'highestaudio' });
  const info = await ytdl.getInfo(vid.url);
  if(info.formats.length == 0){
    console.error("No video formats available");
    callback(curVid + 1);
  } else {
    let title = info.videoDetails.title;
    document.getElementById('vidprev').src = info.videoDetails.thumbnails[3].url
  
    let cont = true;
  
    if (document.getElementById('playlist').checked) {
      if (!confirm('Do you want to download - ' + title + '?')) {
        callback(curVid + 1);
        cont = false;
      }
    }

    if (cont) {
      const regex = /["*/:<>?\\|]/g;
      title = title.replace(regex, '');
  
      if (document.getElementById('check').checked) {
        title = prompt('Choose a name for the file', title) || title;
      }
  
      document.getElementById('curvid').innerHTML = 'Downloading ' + title;
      video.on('response', (res) => {
        let hrStart = process.hrtime();
        let totalSize = res.headers['content-length'];
        let dataRead = 0;
        res.on('data', function (data) {
          let elapsed = time(hrStart);
          hrStart = process.hrtime();
          dataRead += data.length;
          const mbData = data.length / 1e6;
          const vel = mbData / elapsed;
          let percent = dataRead / totalSize;
          document.getElementById('prog').value = percent * 100;
          document.getElementById('prg').innerHTML = (percent * 100).toFixed(2).toString() + '%';
          document.getElementById('vel').innerHTML = vel.toFixed(0) + ' MB/s';
        });
        res.on('end', () => {
          document.getElementById('curvid').innerHTML = 'Done downloading ' + title;
          document.getElementById('prog').value = 0;
          document.getElementById('prg').innerHTML = '0%';
          document.getElementById('vel').innerHTML = '0 MB/s';
          callback(curVid + 1);
        });
      });
      video.on('error', err => {
        console.error(err);
        callback(curVid + 1);
      })
      video.pipe(fs.createWriteStream(join(path, title + '.mp3')));
    }
  }
}

function selectPort() {
  temp_port = prompt('Select the default port', port);
  if (/[0-9]+/.test(temp_port)) {
    port = temp_port;
  } else {
    alert('Port has to be a whole number');
  }
  fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'port.json'), JSON.stringify({ port }));
  chrome.runtime.reload();
}
