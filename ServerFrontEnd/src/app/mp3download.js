async function mp3Download(url, curVid, callback, vid, info) {
  const time = (hrStart) => {
    const hrDiff = process.hrtime(hrStart);
    return hrDiff[0] + hrDiff[1] / 1e9;
  };

  video = ytdl(url, { quality: 'highestaudio' });
<<<<<<< HEAD
  const info = await ytdl.getInfo(url);
  if (info.formats.length == 0) {
    console.error('No video formats available');
    vid.classList.remove('show');
    vid.classList.add('error');
    callback(curVid + 1);
  } else {
    let title = info.videoDetails.title;
    document.getElementById('vidprev').src = info.videoDetails.thumbnails[3].url;

    let cont = true;
=======
>>>>>>> master

  let title = vid.children[1].innerHTML;
  document.getElementById('vidprev').src = info.videoDetails.thumbnails[3].url;

  const regex = /["*/:<>?\\|]/g;
  title = title.replace(regex, '');

<<<<<<< HEAD
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
      video.on('error', (err) => {
        console.error(err);
        vid.classList.remove('show');
        vid.classList.add('error');
        callback(curVid + 1);
      });
      video.pipe(fs.createWriteStream(join(path, title + '.mp3')));
    }
  }
=======
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
  video.on('error', (err) => {
    console.error(err);
    vid.classList.remove('show');
    vid.classList.add('error');
    callback(curVid + 1);
  });
  video.pipe(fs.createWriteStream(join(path, title + '.mp3')));
>>>>>>> master
}
