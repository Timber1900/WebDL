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
      const info = await ytdl.getBasicInfo(vid.url).catch((err) => {
        console.error(err);
        return null;
      });
      if (info) {
        addDiv(vid.url, info.videoDetails.thumbnails[0].url, info.videoDetails.title);
      }
    }
  }

  document.getElementById('curvid').innerHTML = 'Fetching videos';
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
  const div = templateDiv.cloneNode(true);
  div.setAttribute('url', url);
  div.addEventListener('click', selectVid.bind(div));
  div.children[0].children[0].src = thumbnail;
  div.children[1].children[0].innerHTML = title;
  div.children[2].children[1].children[0].addEventListener('click', renameVideo.bind(div.children[1].children[0]));
  div.children[2].children[1].children[2].addEventListener('click', downloadSingleVid.bind(div));

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
  if (document.getElementById('sel').value == 'mp3') {
    mp3Download(this.getAttribute('url'), 0, callback, this);
  } else {
    mp4Download(this.getAttribute('url'), 0, callback, this);
  }
};

window.onload = () => {};
