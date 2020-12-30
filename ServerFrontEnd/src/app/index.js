const fs = require('fs');
const { join } = require('path');
const OS = require('os');
const ytdl = require('ytdl-core');
const express = require('express');
const cp = require('child_process');
const readline = require('readline');
const ffmpeg = require('ffmpeg-static');
const app = express();
let ytpl = require('ytpl');

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

const menu = new nw.Menu();
menu.append(
  new nw.MenuItem({
    label: 'Set port',
    click: () => {
      temp_port = prompt('Select the default port', port);
      if (/[0-9]+/.test(temp_port)) {
        port = temp_port;
      } else {
        alert('Port has to be a whole number');
      }
      fs.writeFileSync(
        join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'port.json'),
        JSON.stringify({ port }),
      );
      chrome.runtime.reload();
    },
    icon: 'assets/port.png',
  }),
);
menu.append(new nw.MenuItem({ type: 'separator' }));
menu.append(
  new nw.MenuItem({
    label: 'Reload app',
    click: () => {
      chrome.runtime.reload();
    },
  }),
);
menu.append(
  new nw.MenuItem({
    label: 'Inspect background page',
    click: () => {
      nw.Window.get().showDevTools();
    },
    key: 'I',
    modifiers: 'ctrl+shift',
  }),
);

document.body.addEventListener(
  'contextmenu',
  (ev) => {
    ev.preventDefault();
    menu.popup(ev.x, ev.y);
    return false;
  },
  false,
);

window.onload = () => {
  document.getElementById('filepath').innerHTML = path;
};

app.post('/', (req, res) => {
  const { body } = req;
  res.send('Video received');
  console.log(body);
  download(body.url);
});

let type = 'MP4';

function mp4() {
  type = 'MP4';
  document.getElementById('mp4').disabled = true;
  document.getElementById('mp3').disabled = false;
}

function mp3() {
  type = 'MP3';
  document.getElementById('mp4').disabled = false;
  document.getElementById('mp3').disabled = true;
}

function selectFolder() {
  fs.writeFileSync(
    join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'path.json'),
    JSON.stringify({ path: document.getElementById('file').value }),
  );
  path = document.getElementById('file').value;
  document.getElementById('filepath').innerHTML = path;
}

async function download(url) {
  let videos = [];
  try {
    playlist = await ytpl(url);
    videos = playlist.items;
  } catch {
    videos = [{ url }];
  }

  if (type == 'MP3') {
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

  let {
    videoDetails: { title },
  } = await ytdl.getBasicInfo(vid.url);
  document.getElementById('text2').innerHTML = 'Downloading ' + title;

  let oldDownloaded = 0;
  let hrStart = process.hrtime();
  const audio = ytdl(vid.url, { quality: 'highestaudio' })
  const toMB = (i) => (i /1e6);
  const video = ytdl(vid.url, { quality: 'highestvideo' }).on('progress', (_, downloaded, total) => {
    let elapsed = time(hrStart);
    hrStart = process.hrtime();
    const mbData = toMB(downloaded - oldDownloaded);
    oldDownloaded = downloaded
    const percent = ((downloaded / total) * 100).toFixed(2);
    const vel = mbData / elapsed;
    document.getElementById('progress1').value = percent;
    document.getElementById('progress2').innerHTML = percent.toString() + '%';
    document.getElementById('speed').innerHTML = vel.toFixed(2) + ' MB/s';
  });
  video.on('error', console.error)
  audio.on('error', console.error)


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
      join(path, title + '.mkv'),
    ],
    {
      windowsHide: true,
      stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'pipe', 'pipe'],
    },
  );
  ffmpegProcess.on('close', () => {
    document.getElementById('text2').innerHTML = 'Done downloading ' + title;
    clearInterval(progressbarHandle);
    callback(curVid + 1);
  });
  audio.pipe(ffmpegProcess.stdio[4]);
  video.pipe(ffmpegProcess.stdio[5]);
}

async function mp3Download(vid, curVid, callback){
  const time = (hrStart) => {
    const hrDiff = process.hrtime(hrStart);
    return hrDiff[0] + hrDiff[1] / 1e9;
  };

  video = ytdl(vid.url, { quality: 'highestaudio' });
  let {
    videoDetails: { title },
  } = await ytdl.getBasicInfo(vid.url);

  if (document.getElementById('check').checked) {
    title = prompt('Choose a name for the file', title) || title;
  }
  document.getElementById('text2').innerHTML = 'Downloading ' + title;
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
      document.getElementById('progress1').value = percent * 100;
      document.getElementById('progress2').innerHTML = (percent * 100).toFixed(2).toString() + '%';
      document.getElementById('speed').innerHTML = vel.toFixed(0) + ' MB/s';
    });
    res.on('end', () => {
      document.getElementById('text2').innerHTML = 'Done downloading ' + title;
      document.getElementById('progress1').value = 0;
      document.getElementById('progress2').innerHTML = '0%';
      document.getElementById('speed').innerHTML = '0 MB/s';
      callback(curVid + 1)
    });
  });
  video.on('error', console.error)
  console.log(title);
  video.pipe(fs.createWriteStream(join(path, title + '.mp3')));
}