const fs = require('fs');
const { join } = require('path');
const OS = require('os');
const ytdl = require('ytdl-core');
const express = require('express');
const cp = require('child_process');
const ffmpeg = require('ffmpeg-static');
let ytpl = require('ytpl');

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
  } catch {
    videos = [{ url }];
  }
  document.getElementById('curvid').innerHTML = 'Fetching videos';

  let i = 0;
  const promises = [];
  for (const vid of videos) {
    promises.push(test(vid, i))
    i++
  }

  Promise.all(promises)
    .then((val) => {
      document.getElementById('curvid').innerHTML = 'Sorting videos';
      const filtered = val.filter(e => e != null)
      const sorted = filtered.sort((a, b) => a.getAttribute('rank') > b.getAttribute('rank'))
      const parent = document.getElementById('playlistSelect')
      for(const div of sorted) {
        parent.appendChild(div)
      }
      document.getElementById('curvid').innerHTML = 'Done fetching';

    })
}

async function test(vid, i){
  if (vid) {
    let formats = new Map();
    const info = await ytdl.getInfo(vid.url).catch((err) => {
      console.log(`%c ${err}`, "color: #F87D7A");
      return Promise.resolve()
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
      console.log(`%c Failed to fetch video ${vid.url} info`, "color: #F87D7A")
      return Promise.resolve()
    }
  } else {
    console.log(`%c Failed to fetch video ${vid} info`, "color: #F87D7A")

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
    queued_videos.set(url, [info, formats]);
    div.addEventListener('click', selectVid.bind(div));
    div.children[0].children[0].src = thumbnail;
    div.children[1].innerHTML = title;
    div.children[1].addEventListener('blur', scrollBack.bind(div.children[1]))
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
    return Promise.resolve(div)
  } else {
    console.log(`%c Video ${url} already in queue`, "color: #6A8A35")
    return Promise.resolve()
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
  queued_videos.clear()
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
  if (document.getElementById('sel').value == 'mp3') {
    mp3Download(this.getAttribute('url'), 0, callback, this, queued_vid[0]);
  } else {
    mp4Download(this.getAttribute('url'), 0, callback, this, queued_vid[0], queued_vid[1]);
  }
  queued_videos.delete(this.getAttribute('url'));

};

const scrollBack = function() {
	this.scrollLeft = 0;
};

window.onload = () => {};
