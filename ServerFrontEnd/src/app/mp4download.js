async function mp4Download(url, curVid, callback, vid, info, formats) {
  const time = (hrStart) => {
    const hrDiff = process.hrtime(hrStart);
    return hrDiff[0] + hrDiff[1] / 1e9;
  };

  title = vid.children[1].innerHTML;
  document.getElementById('vidprev').src = info.videoDetails.thumbnails[3].url;

  const clips = []
  const outer_span = vid.children[2].children[1].children[1].children[1].children
  if(outer_span.length > 1){
    for(let i = 0; i < outer_span.length - 1; i++){
      const start = parseInt(outer_span[i].children[0].children[0].value * 3600) + parseInt(outer_span[i].children[0].children[2].value * 60) + parseInt(outer_span[i].children[0].children[4].value)
      const end   = parseInt(outer_span[i].children[2].children[0].value * 3600) + parseInt(outer_span[i].children[2].children[2].value * 60) + parseInt(outer_span[i].children[2].children[4].value)
      clips.push([start, end])
    }
  }
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
      clips.length
        ? join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'tempvideo.mkv')
        : join(path, title + '.mkv'),
    ],
    {
      windowsHide: true,
      stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'pipe', 'pipe'],
    },
  );
  ffmpegProcess.on('close', () => {
    if (clips.length) {
      console.log('cut')
      document.getElementById('curvid').innerHTML = 'Cutting video ...';
      const promises = []
      let i = 1;
      for(const clip of clips){
        promises.push(cutVid(clip[0], clip[1], path, title, i))
        i++
      }

      Promise.all(promises)
      .then(() => {
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

async function cutVid(start, end, path, title, i){
  return new Promise((resolve, reject) => {
    const duration = end - start;
    const secondffmpegprocess = cp.spawn(
      ffmpeg,
      [
        '-ss',
        start,
        '-i',
        join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'tempvideo.mkv'),
        '-to',
        duration,
        '-c',
        'copy',
        join(path, `${title}-clip-${i}.mkv`),
      ],
      {
        windowsHide: true,
        stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'pipe', 'pipe'],
      },
    );
    secondffmpegprocess.on('close', function() {
      resolve('done')
    });
  })
}