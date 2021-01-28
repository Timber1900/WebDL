const fs = require('fs');
const { join, format } = require('path');
const OS = require('os');
const ytdl = require('ytdl-core');
const express = require('express');
const cp = require('child_process');
const ffmpeg = require('ffmpeg-static');
let ytpl = require('ytpl');
const { json } = require('express');
const YoutubeDlWrap = require('youtube-dl-wrap');
const { formatWithCursor } = require('prettier');
const youtubeDlWrap = new YoutubeDlWrap(
  join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'youtube-dl.exe')
);

const queued_videos = new Map();

function selectFolder() {
  fs.writeFileSync(
    join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'path.json'),
    JSON.stringify({ path: document.getElementById('file').value }),
  );
  path = document.getElementById('file').value;
}

async function addToQueue(url) {
  document.getElementById('curvid').innerHTML = 'Fetching videos';
  const videos = await ytpl(url).catch(() => {})
  const urls = []
  if(videos){
    for(const vid of videos.items){
      urls.push(vid.shortUrl)
    }
  } else {
    urls.push(url)
  }
  const divs = []
  for(const URL of urls){
    divs.push(getQueueDiv(URL))
  }

  Promise.all(divs)
  .then(val => {
    const parent = document.getElementById('playlistSelect');
    console.log(val)
    for (const divs of val) {
      if(divs){
        for(const div of divs){
          parent.appendChild(div);
        }
      }
    }
    document.getElementById('curvid').innerHTML = 'Done fetching';
  })
}

async function getQueueDiv(url) {
  try {
    const info = await youtubeDlWrap.getVideoInfo(url)
    const infos = Array.isArray(info) ? info : [info]
    const divs = []
    let i = 0;
    for(const inf of infos){
      divs.push(getDivs(inf, i))
      i++
    }
    return Promise.all(divs)
  } catch {
    console.log(`%c Video ${url} is not available`, 'color: #F87D7A');
    return Promise.resolve(null);
  }
}

async function getDivs(info, i){
  if (info && info.formats.length > 0) {
    let formats = new Map();
    for (const format of info.formats) {
      if ((format.ext === 'mp4' || format.ext === 'webm') && (format.vcodec !== 'none') && format.acodec === "none") {
        if (formats.has(format.format_note)) {
          formats.set(
            format.format_note,
            format.tbr >= formats.get(format.format_note).tbr
              ? format
              : formats.get(format.format_note),
          );
        } else {
          formats.set(format.format_note, format);
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
    return addDiv(info.id, info.thumbnails[0].url, info.title, sorted_map, info, i);
  } else {
    return Promise.resolve(null);
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
    div.children[2].children[1].children[1].addEventListener('click', downloadSingleVid.bind(div));
    const qual_span = div.children[2].children[1].children[2];
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
  if(this.getAttribute('youtube') == 'false'){
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

function downloadLatestRealease() {
  
  YoutubeDlWrap.getGithubReleases(1, 1)
  .then(val => {
    let cur_ver
    try {
      cur_ver = require(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'version.json')).version;
    } catch (err) {
      fs.mkdir(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader'), () => {});
    }
    if(cur_ver !== val[0].tag_name || !fs.existsSync(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'youtube-dl.exe'))){
      alert('Downloading latest youtube-dl...')
      fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'version.json'), JSON.stringify({ version: val[0].tag_name }));
      YoutubeDlWrap.downloadFromWebsite(join(OS.homedir(), 'AppData', 'Roaming', '.ytdldownloader', 'youtube-dl.exe'), "win32")
      .then(() => {
        alert('Done downloading latest youtube-dl!')
        console.log("%c Done downloading latest version!", "color: #6A8A35")
      });
    }
  })
}

window.onload = () => {
  downloadLatestRealease()
};
