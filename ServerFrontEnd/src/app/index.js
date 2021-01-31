const fs = require('fs');
const { join, format } = require('path');
const OS = require('os');
const ytdl = require('ytdl-core');
const express = require('express');
const cp = require('child_process');
const ffmpeg = require('ffmpeg-static');
let ytpl = require('ytpl');
const { json } = require('express');
const ytsr = require('ytsr')
const YoutubeDlWrap = require('youtube-dl-wrap');
const youtubeDlWrap = new YoutubeDlWrap(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'youtube-dl.exe'));

const queued_videos = new Map();

function selectFolder() {
  fs.writeFileSync(
    join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'path.json'),
    JSON.stringify({ path: document.getElementById('file').value }),
  );
  path = document.getElementById('file').value;
}

async function addToQueue(url) {
  let videos = [];
  try {
    playlist = await ytpl(url, { pages: Infinity });
    videos = playlist.items;
    document.getElementById('curvid').innerHTML = 'Fetching videos';
    let i = 0;
    const promises = [];
    for (const vid of videos) {
      promises.push(test(vid, i));
      i++;
    }

    Promise.all(promises).then((val) => {
      document.getElementById('curvid').innerHTML = 'Sorting videos';
      const filtered = val.filter((e) => e != null);
      const sorted = filtered.sort((a, b) => a.getAttribute('rank') > b.getAttribute('rank'));
      const parent = document.getElementById('playlistSelect');
      for (const div of sorted) {
        parent.appendChild(div);
      }
      document.getElementById('curvid').innerHTML = 'Done fetching';
    });
  } catch {
    test({ url }, 1)
      .then((val) => {
        const parent = document.getElementById('playlistSelect');
        parent.appendChild(val);
      })
      .catch((err) => {
        console.log(err)
        const formats = new Map();
        youtubeDlWrap
          .getVideoInfo(url)
          .then((info) => {
            for (const format of info.formats) {
              if ((format.ext === 'mp4' || format.ext === 'webm') && format.height) {
                if (formats.has(format.height + 'p' + (format.fps ? format.fps : ''))) {
                  const prev_format = formats.get(format.height + 'p' + (format.fps ? format.fps : ''));
                  formats.set(
                    format.height + 'p' + (format.fps ? format.fps : ''),
                    format.tbr > prev_format.tbr ? format : prev_format,
                  );
                } else {
                  formats.set(format.height + 'p' + (format.fps ? format.fps : ''), format);
                }
              }
            }
            const sorted_map = new Map(
              [...formats.entries()].sort(
                (a, b) =>
                  -(a[1].height === b[1].height
                    ? parseInt(a[1].fps) - parseInt(b[1].fps)
                    : parseInt(a[1].height) - parseInt(b[1].height)),
              ),
            );
            if (sorted_map.size == 0 && info.formats.length > 0) {
              let i = 0;
              for (const format of info.formats) {
                sorted_map.set(i.toString(), format);
                i++;
              }
            }
            if (info.thumbnail) {
              addDiv(url, info.thumbnails[info.thumbnails.length - 1].url, info.title, sorted_map, info, 0).then(
                (val) => {
                  const parent = document.getElementById('playlistSelect');
                  val.setAttribute('youtube', false);
                  parent.appendChild(val);
                },
              );
            } else {
              addDiv(
                url,
                'https://piotrkowalski.pw/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png',
                info.title,
                sorted_map,
                info,
                0,
              ).then((val) => {
                const parent = document.getElementById('playlistSelect');
                val.setAttribute('youtube', false);
                parent.appendChild(val);
              });
            }
          })
          .catch((err) => {
            console.error(err);
          });
      });
  }
}

async function test(vid, i) {
  if (vid) {
    let formats = new Map();
    const info = await ytdl.getInfo(vid.url).catch((err) => {
      console.log(`%c ${err}`, 'color: #F87D7A');
      return Promise.reject();
    });
    if (info && info.formats.length > 0) {
      for (const format of info.formats) {
        if ((format.container === 'mp4' || format.container === 'webm') && format.hasVideo && !format.hasAudio) {
          if (formats.has(format.qualityLabel)) {
            formats.set(
              format.qualityLabel,
              format.averageBitrate >= formats.get(format.qualityLabel).averageBitrate
                ? format
                : formats.get(format.qualityLabel),
            );
          } else {
            formats.set(format.qualityLabel, format);
          }
        }
      }
      return addDiv(vid.url, info.videoDetails.thumbnails[0].url, info.videoDetails.title, formats, info, i);
    } else {
      console.log(`%c Failed to fetch video ${vid.url} info`, 'color: #F87D7A');
      return Promise.resolve();
    }
  } else {
    console.log(`%c Failed to fetch video ${vid} info`, 'color: #F87D7A');
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

function addDiv(url, thumbnail, title, formats, info, rank) {
  if (!queued_videos.has(url)) {
    const div = templateDiv.cloneNode(true);
    div.setAttribute('url', url);
    div.setAttribute('rank', rank);
    div.setAttribute('youtube', true);
    queued_videos.set(url, [info, formats]);
    div.addEventListener('click', selectVid.bind(div));
    div.children[0].children[0].src = thumbnail;
    div.children[1].innerHTML = title;
    div.children[1].addEventListener('blur', scrollBack.bind(div.children[1]));
    div.children[2].children[1].children[0].addEventListener('click', renameVideo.bind(div.children[1]));

    div.children[2].children[1].children[1].children[0].setAttribute('onclick', 'openTrimPopup(this)');
    div.children[2].children[1].children[1].children[1].children[0].children[0].setAttribute('onclick', 'openTrimPopup(this.parentNode.parentNode.parentNode.children[0])')

    const fullsec = info.videoDetails.lengthSeconds;
    const fullmin = fullsec / 60;
    const hours = Math.floor(fullmin / 60);
    const min = Math.floor(fullmin - hours * 60);
    const sec = Math.floor(fullsec - min * 60);

    div.children[2].children[1].children[1].children[1].children[0].children[1].setAttribute('onclick', `addClip(this, ${hours}, ${min}, ${sec}, ${fullsec})`)


    div.children[2].children[1].children[2].addEventListener('click', downloadSingleVid.bind(div));
    const qual_span = div.children[2].children[1].children[4];
    const id = ID();
    qual_span.children[0].setAttribute('for', id);
    qual_span.children[1].setAttribute('id', id);

    for (const qual of formats) {
      const option = document.createElement('option');
      option.setAttribute('value', qual[0]);
      option.innerHTML = qual[0];
      qual_span.children[1].appendChild(option);
    }
    return Promise.resolve(div);
  } else {
    console.log(`%c Video ${url} already in queue`, 'color: #6A8A35');
    return Promise.resolve();
  }
}

const selectVid = function (event) {
  const procced = event.path.reduce(
    (acc, cur) => acc && (cur.classList ? !cur.classList.contains('dropdown-content') : true),
    true,
  );
  if (procced) {
    if (this.classList.contains('show')) {
      const queuecheck = document.getElementById('queue-check');
      queuecheck.checked = false;
      this.classList.remove('show');
    } else {
      this.classList.add('show');
    }
  }
};

function getVids() {
  const vids = [];
  const vidsContainer = document.getElementById('playlistSelect');
  for (const child of vidsContainer.children) {
    if (child.classList.contains('show')) {
      vids.push(child);
    }
  }
  return vids;
}

function clearQueue() {
  const vidsContainer = document.getElementById('playlistSelect');
  queued_videos.clear();
  while (vidsContainer.firstChild) {
    vidsContainer.removeChild(vidsContainer.lastChild);
  }
}

const selectAll = () => {
  const vidsContainer = document.getElementById('playlistSelect');
  const queuecheck = document.getElementById('queue-check');

  if (queuecheck.checked) {
    for (const child of vidsContainer.children) {
      if (!child.classList.contains('show')) {
        child.classList.add('show');
      }
    }
  } else {
    for (const child of vidsContainer.children) {
      if (child.classList.contains('show')) {
        child.classList.remove('show');
      }
    }
  }
};

const renameVideo = function () {
  this.setAttribute('contenteditable', true);
  this.focus();
  const label = this;
  function stopRenameEnter(event) {
    if (event.target === label && event.key === 'Enter') {
      label.innerHTML.replace(/\n/g, '');
      label.setAttribute('contenteditable', false);
      document.removeEventListener('keydown', stopRenameEnter);
    }
  }
  function stopRename() {
    label.setAttribute('contenteditable', false);
    label.removeEventListener('focusout', stopRename);
  }
  document.addEventListener('keydown', stopRenameEnter);
  this.addEventListener('focusout', stopRename);
};

const downloadSingleVid = function () {
  const div = this;
  const callback = (a) => {
    const vidsContainer = document.getElementById('playlistSelect');
    if (!div.classList.contains('error')) {
      vidsContainer.removeChild(div);
    }
  };
  const queued_vid = queued_videos.get(this.getAttribute('url'));
  if (this.getAttribute('youtube') == 'false') {
    non_youtube_download(this.getAttribute('url'), 0, callback, this, queued_vid[0], queued_vid[1]);
  } else if (document.getElementById('sel').value == 'mp3') {
    mp3Download(this.getAttribute('url'), 0, callback, this, queued_vid[0]);
  } else {
    mp4Download(this.getAttribute('url'), 0, callback, this, queued_vid[0], queued_vid[1]);
  }
  queued_videos.delete(this.getAttribute('url'));
};

const scrollBack = function () {
  this.scrollLeft = 0;
};

const openTrimPopup = function (e) {
  e.parentNode.children[1].classList.toggle('show')
}

function downloadLatestRealease() {
  YoutubeDlWrap.getGithubReleases(1, 1).then((val) => {
    let cur_ver;
    try {
      cur_ver = require(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'version.json')).version;
    } catch (err) {
      fs.mkdir(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader'), () => {});
    }
    if (
      cur_ver !== val[0].tag_name ||
      !fs.existsSync(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'youtube-dl.exe'))
    ) {
      alert('Downloading latest youtube-dl...');
      fs.writeFileSync(
        join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'version.json'),
        JSON.stringify({ version: val[0].tag_name }),
      );
      YoutubeDlWrap.downloadFromWebsite(
        join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'youtube-dl.exe'),
        'win32',
      ).then(() => {
        alert('Done downloading latest youtube-dl!');
        console.log('%c Done downloading latest version!', 'color: #6A8A35');
      });
    }
  });
}

function GetElementInsideContainer(parent, childName) {
  const children = parent.children
  let elm
  for(const child of children){
    if(child.getAttribute('name') === childName){
      elm = child
      break
    }
  }
  return elm ? elm : null;
}

const addClip = function(e, hh, mm, ss, lentotal) {
  const parent = e.parentNode.parentNode
  parent.appendChild(getTimeInputDiv(hh, mm, ss, lentotal))
  const button = GetElementInsideContainer(parent, 'buttons').cloneNode(true)
  GetElementInsideContainer(parent, 'buttons').remove()
  parent.appendChild(button)
}

const addVid = () => {
  const url = prompt('What\'s the video url?')
  if(url){
    addToQueue(url);
  }
}

const addSearchItem = (title, thumbnail, url) => {
  const search_div = search_div_template.cloneNode(true);
  search_div.setAttribute('url', url)
  search_div.children[0].src = thumbnail;
  search_div.children[1].innerHTML = title;
  search_div.addEventListener('click', selectVidPreview.bind(search_div));
  document.getElementById('search-items').appendChild(search_div);
  
}

const search = () => {
  const search_term = document.getElementById('search_input').value
  ytsr(search_term, {pages: 1})
  .then(val => {
    for(const item of val.items){
      if(item.type === 'video'){
        addSearchItem(item.title, item.bestThumbnail.url, item.id)
      }
    }
  })
  .catch(console.error)
}

const selectVidPreview = function() {
  const url = this.getAttribute('url')
  this.parentNode.parentNode.children[0].children[0].src = `https://www.youtube.com/embed/${url}`
}

const addSearchToQueue = function(e) {
  const id = e.parentNode.parentNode.children[1].children[0].children[0].src.replace('https://www.youtube.com/embed/', '')
  addToQueue(id)
}

window.onload = () => {
  // downloadLatestRealease();
};

