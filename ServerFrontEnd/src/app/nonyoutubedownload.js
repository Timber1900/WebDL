async function non_youtube_download(url, curVid, callback, vid, info, formats) {
  const time = (hrStart) => {
    const hrDiff = process.hrtime(hrStart);
    return hrDiff[0] + hrDiff[1] / 1e9;
  };

  const videoFormat = formats.get(vid.children[2].children[1].children[4].children[1].value);

  video = youtubeDlWrap.execStream([url, '-f', videoFormat.format_id]);

  let title = vid.children[1].innerHTML;
  if (info.thumbnail) {
    document.getElementById('vidprev').src = info.thumbnails[info.thumbnails.length - 1].url;
  } else {
    document.getElementById('vidprev').src =
      'https://piotrkowalski.pw/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png';
  }

  const clips = []
  const outer_span = vid.children[2].children[1].children[1].children[1].children
  if(outer_span.length > 1){
    for(let i = 0; i < outer_span.length - 1; i++){
      const start = parseInt(outer_span[i].children[0].children[0].value * 3600) + parseInt(outer_span[i].children[0].children[2].value * 60) + parseInt(outer_span[i].children[0].children[4].value)
      const end   = parseInt(outer_span[i].children[2].children[0].value * 3600) + parseInt(outer_span[i].children[2].children[2].value * 60) + parseInt(outer_span[i].children[2].children[4].value)
      clips.push([start, end])
    }
  }

  const regex = /["*/:<>?\\|]/g;
  title = title.replace(regex, '');

  document.getElementById('curvid').innerHTML = 'Downloading ' + title;
  video
    .on('progress', (progress) => {
      document.getElementById('prog').value = progress.percent;
      document.getElementById('prg').innerHTML = progress.percent.toString() + '%';
      document.getElementById('vel').innerHTML = progress.currentSpeed;
    })
    .on('close', () => {
      if(!clips.length){
        document.getElementById('curvid').innerHTML = `Done downloading ${title}`;
        document.getElementById('prog').value = 0;
        document.getElementById('prg').innerHTML = '0%';
        document.getElementById('vel').innerHTML = '0 MB/s';
        callback(curVid + 1);
      } else {
        document.getElementById('curvid').innerHTML = 'Cutting video';
        document.getElementById('prog').value = 0;
        document.getElementById('prg').innerHTML = '0%';
        document.getElementById('vel').innerHTML = '0 MB/s';
        document.getElementById('curvid').innerHTML = 'Cutting video ...';
        const promises = []
        let i = 1;
        for(const clip of clips){
          promises.push(cutVid(clip[0], clip[1], path, title, i))
          i++
        }

        Promise.all(promises)
        .then(() => {
          fs.unlinkSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'tempvideo.mkv'));
          document.getElementById('curvid').innerHTML = 'Done downloading ' + title;
          callback(curVid + 1);
        });
      }
    })
    .on('error', (err) => {
      console.error(err);
      vid.classList.remove('show');
      vid.classList.add('error');
      callback(curVid + 1);
    });
  if(!clips.length){
    video.pipe(fs.createWriteStream(join(path, title + '.mkv')));
  } else {
    video.pipe(fs.createWriteStream(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'tempvideo.mkv')));
  }
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
        join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'tempvideo.mkv'),
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
