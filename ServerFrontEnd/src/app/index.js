const fs = require('fs');
const { join } = require('path');
const OS = require('os');
const ytdl = require('ytdl-core');
const express = require('express');
const cp = require('child_process');
const ffmpeg = require('ffmpeg-static');
let ytpl = require('ytpl');

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
  const total = videos.length;

  for (const vid of videos) {
    if (vid) {
      const info = await ytdl.getBasicInfo(vid.url).catch((err) => {console.error(err); return null});
      if (info) {
        addDiv(vid.url, info.videoDetails.thumbnails[0].url, info.videoDetails.title);
      }
      document.getElementById('curvid').innerHTML = `Fetching videos ${i + 1}/${total}`;
      i++;
    }
  }
  document.getElementById('curvid').innerHTML = 'Done fetching';
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

function addDiv(url, thumbnail, title) {
  const div = document.createElement('div');
  div.classList.add('playItem');
  div.classList.add('show');
  div.addEventListener('click', selectVid.bind(div));
  div.setAttribute('url', url);

  const span1 = document.createElement('span');
  const span2 = document.createElement('span');
  span2.classList.add('video-name-container');

  const image = document.createElement('img');
  image.src = thumbnail;
  image.classList.add('image');

  const label = document.createElement('label');
  label.classList.add('video-name');
  label.innerHTML = title;

  span1.appendChild(image);
  span2.appendChild(label);

  div.appendChild(span1);
  div.appendChild(span2);

  document.getElementById('playlistSelect').appendChild(div);
}

const selectVid = function () {
  if (this.classList.contains('show')) {
    const queuecheck = document.getElementById('queue-check');
    queuecheck.checked = false;
    this.classList.remove('show');
  } else {
    this.classList.add('show');
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
