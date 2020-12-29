const fs = require('fs');
const { join } = require('path');
const OS = require('os');
const ytdl = require('ytdl-core');
const express = require('express');
const app = express();
let ytpl = require('ytpl');

app.listen(1234);
app.use(express.json());
let path;
try {
  path = require(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'settings.json')).path;
} catch (err) {
  path = join(OS.homedir(), 'Videos', 'Youtube');
  fs.mkdir(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader'), (e) => {})
  fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'settings.json'), JSON.stringify({ path }));
}

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
  fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'settings.json'), JSON.stringify({ path: document.getElementById('file').value }));
  path = document.getElementById('file').value;
  document.getElementById('filepath').innerHTML = path;
}

async function download(url) {
  const time = (hrStart) => {
    const hrDiff = process.hrtime(hrStart);
    return hrDiff[0] > 0 ? hrDiff[0] + hrDiff[1] / 1e9 : hrDiff[1] / 1e9;
  };
  let videos = [];
  try {
    playlist = await ytpl(url);
    videos = playlist.items;
  } catch {
    videos = [{ url }];
  }
  for (const vid of videos) {
    let video;
    if (type == 'MP3') {
      video = ytdl(vid.url, { filter: 'audioonly' });
    } else {
      video = ytdl(vid.url);
    }
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
      });
    });
    console.log(title);
    video.pipe(fs.createWriteStream(join(path, title + (type == 'MP3' ? '.mp3' : '.mp4'))));
  }
}
