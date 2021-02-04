import { outQueue, updateQueue } from '../../components/Queue';
import { updateInfo } from '../../components/InfoLabel';
import ytpl from 'ytpl';
import { youtubeDlWrap } from '../youtube-dl-wrap';
import ytdl from 'ytdl-core';
import { getOtherDiv } from './getOtherInfo';
import { getYoutubeDiv } from './getYoutubeInfo';

type info = {
  ytdl: boolean;
};

async function getQueueDiv(url: string) {
  try {
    const type: info = { ytdl: true };
    let info: any = await ytdl.getInfo(url).catch((err) => {
      console.log(`%c ${err}`, 'color: #F87D7A');
      type.ytdl = false;
    });
    const divs: any = [];
    if (type.ytdl) {
      divs.push(getYoutubeDiv(info, 1, url));
    } else {
      info = await youtubeDlWrap.getVideoInfo(url).catch(console.error);
      const infos = [].concat(info);
      let i = 0;
      for (const inf of infos) {
        divs.push(getOtherDiv(inf, i, url));
        i++;
      }
    }
    return Promise.all(divs);
  } catch (err) {
    console.log(`%c ${err}`, 'color: #F87D7A');
    console.log(`%c Video ${url} is not available`, 'color: #F87D7A');
    return Promise.resolve(null);
  }
}

export const addToQueue = async (url: string) => {
  updateInfo('Fetching videos');
  const videos = await ytpl(url, { pages: Infinity }).catch(() => {});
  const urls = [];
  if (videos) {
    for (const vid of videos.items) {
      urls.push(vid.shortUrl);
    }
  } else {
    urls.push(url);
  }
  const divs = [];
  for (const URL of urls) {
    divs.push(getQueueDiv(URL));
  }

  Promise.all(divs).then((val: any) => {
    if (val) {
      const prevQueue = [...outQueue];
      for (const divs of val) {
        if (divs) {
          for (const div of divs) {
            if (div) {
              if (!prevQueue.find((val) => val.id === div.id)) prevQueue.push(div);
            }
          }
        }
      }
      console.log(prevQueue);
      updateQueue(prevQueue);
    }
    updateInfo('Done fetching');
  });
};
