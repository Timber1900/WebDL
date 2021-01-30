async function mp4Download(url, curVid, callback, vid, info, formats) {
  const time = (hrStart) => {
    const hrDiff = process.hrtime(hrStart);
    return hrDiff[0] + hrDiff[1] / 1e9;
  };
  let cont = true;
  title = vid.children[1].innerHTML;
  document.getElementById('vidprev').src = info.videoDetails.thumbnails[3].url;

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
    const videoFormat = formats.get(vid.children[2].children[1].children[4].children[1].value);

    document.getElementById('curvid').innerHTML = 'Downloading ' + title;

    const regex = /["*/:<>?\\|]/g;
    title = title.replace(regex, '');

    let oldDownloaded = 0;
    let hrStart = process.hrtime();
    const audio = ytdl(url, { quality: 'highestaudio' });
    const toMB = (i) => i / 1e6;
    const video = ytdl(url, { format: videoFormat }).on('progress', (_, downloaded, total) => {
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
      vid.classList.remove('show');
      vid.classList.add('error');
      callback(curVid + 1);
    });
    audio.on('error', (err) => {
      console.error(err);
      vid.classList.remove('show');
      vid.classList.add('error');
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
