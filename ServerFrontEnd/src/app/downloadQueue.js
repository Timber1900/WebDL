async function downloadQueue() {
  const videos = getVids();

  if (videos.length > 0) {
    document.getElementById('dow-vid').disabled = true;
    document.getElementById('clear-queue').disabled = true;
    const vidsContainer = document.getElementById('playlistSelect');

    if (document.getElementById('sel').value == 'mp3') {
      const callNewVid = (a) => {
        mp3Download(videos[a].getAttribute('url'), a, callback, videos[a]);
      };
      const callback = (a) => {
        if (a < videos.length) {
          if(!videos[a - 1].classList.contains('error')){
            vidsContainer.removeChild(videos[a - 1]);
          }
          callNewVid(a);
        }
        if (a >= videos.length) {
          if(!videos[a - 1].classList.contains('error')){
            vidsContainer.removeChild(videos[a - 1]);
          }          
          document.getElementById('dow-vid').disabled = false;
          document.getElementById('clear-queue').disabled = false;
        }
      };
      callNewVid(0);
    } else {
      const callNewVid = (a) => {
        mp4Download(videos[a].getAttribute('url'), a, callback, videos[a]);
      };
      const callback = (a) => {
        if (a < videos.length) {
          if(!videos[a - 1].classList.contains('error')){
            vidsContainer.removeChild(videos[a - 1]);
          } 
          callNewVid(a);
        }
        if (a >= videos.length) {
          if(!videos[a - 1].classList.contains('error')){
            vidsContainer.removeChild(videos[a - 1]);
          }           
          document.getElementById('dow-vid').disabled = false;
          document.getElementById('clear-queue').disabled = false;
        }
      };
      callNewVid(0);
    }
  } else {
    alert('Queue is empty.');
  }
}
