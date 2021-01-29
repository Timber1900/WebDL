async function non_youtube_download(url, curVid, callback, vid, info, formats) {
  const time = (hrStart) => {
    const hrDiff = process.hrtime(hrStart);
    return hrDiff[0] + hrDiff[1] / 1e9;
  };

  const videoFormat = formats.get(vid.children[2].children[1].children[2].children[1].value);

  video = youtubeDlWrap.execStream([url, '-f', videoFormat.format_id]);

  let title = vid.children[1].innerHTML;
  if(info.thumbnail){
    document.getElementById('vidprev').src = info.thumbnails[info.thumbnails.length - 1].url;
  } else {
    document.getElementById('vidprev').src = "https://piotrkowalski.pw/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png"
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
  .on("close", () => {
    document.getElementById('curvid').innerHTML = 'Done downloading ' + title;
    document.getElementById('prog').value = 0;
    document.getElementById('prg').innerHTML = '0%';
    document.getElementById('vel').innerHTML = '0 MB/s';
    callback(curVid + 1);
  })
  .on('error', (err) => {
    console.error(err);
    vid.classList.remove('show');
    vid.classList.add('error');
    callback(curVid + 1);
  });

  video.pipe(fs.createWriteStream(join(path, title + '.mp4')));
}
