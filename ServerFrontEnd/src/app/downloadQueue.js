async function downloadQueue() {
  const videos = getVids();

  if (videos.length > 0) {
    document.getElementById('dow-vid').disabled = true;
    document.getElementById('clear-queue').disabled = true;
    const vidsContainer = document.getElementById('playlistSelect');

    switch (document.getElementById('sel').value) {
      case 'mp3':
        const callNewMp3Vid = (a) => {
          const url = videos[a].getAttribute('url');
          const queued_vid = queued_videos.get(url);
          if (videos[a].getAttribute('youtube') == 'true') {
            mp3Download(url, a, callback, videos[a], queued_vid[0]);
          } else {
            non_youtube_download(url, a, callback, videos[a], queued_vid[0], queued_vid[1]);
          }
          queued_videos.delete(url);
        };
        const callback = (a) => {
          if (a < videos.length) {
            if (!videos[a - 1].classList.contains('error')) {
              vidsContainer.removeChild(videos[a - 1]);
            }
            callNewMp3Vid(a);
          }
          if (a >= videos.length) {
            if (!videos[a - 1].classList.contains('error')) {
              vidsContainer.removeChild(videos[a - 1]);
            }
            document.getElementById('dow-vid').disabled = false;
            document.getElementById('clear-queue').disabled = false;
          }
        };
        callNewMp3Vid(0);
        break;
    
      case 'mp4':
        const callNewMp4Vid = (a) => {
          const url = videos[a].getAttribute('url');
          const queued_vid = queued_videos.get(url);
          mp4Download(url, a, callbackMp4, videos[a], queued_vid[0], queued_vid[1]);
          queued_videos.delete(url);
        };
        const callbackMp4 = (a) => {
          if (a < videos.length) {
            if (!videos[a - 1].classList.contains('error')) {
              vidsContainer.removeChild(videos[a - 1]);
            }
            callNewMp4Vid(a);
          }
          if (a >= videos.length) {
            document.getElementById('dow-vid').disabled = false;
            document.getElementById('clear-queue').disabled = false;
          }
        };
        callNewMp4Vid(0);
        break;
    }
  } else {
    alert('No videos selected');
  }
}

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