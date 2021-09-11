import ytpl from 'ytpl';
import ytdl from 'ytdl-core';
import util from 'util';
import { youtubeDlWrap } from '../youtube-dl-wrap';
import { getOtherDiv } from './getOtherInfo';
import { getYoutubeDiv } from './getYoutubeInfo';
import { outerContext } from '../../App';

type info = {
  ytdl: boolean;
};

async function getQueueDiv(url: string) {
  try {
    const type: info = { ytdl: true };
    let info: any = await ytdl.getInfo(url).catch((err) => {
      console.log(`%c ${err}`, 'color: #7D7AF8');
      type.ytdl = false;
    });
    const divs: any = [];
    if (type.ytdl) {
      divs.push(getYoutubeDiv(info, 1));
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
  const { curQueue, updateInfo, updateQueue, curQueuePrg, updateQueuePrg, curQueueVel, updateQueueVel } = outerContext;
  let currentInfo = 'Fetching videos';
  updateInfo(currentInfo);
  const videos = await ytpl(url, { pages: Infinity }).catch(() => {return;});
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

  const promise = Promise.all(divs);

  const InformUser = async () => {
    if (util.inspect(promise).includes('pending')) {
      if (currentInfo.includes('Fetching videos')) {
        const new_info =
          currentInfo.substring(currentInfo.length - 3, currentInfo.length) === '...'
            ? currentInfo.substring(0, currentInfo.length - 3)
            : `${currentInfo}.`;
        currentInfo = new_info;
        updateInfo(new_info);
      }
      setTimeout(InformUser, 333);
    }
  };

  InformUser();

  promise.then((val: any) => {
    if (val) {
      const prevQueue = [...curQueue];
      for (const divs of val) {
        if (divs) {
          for (const div of divs) {
            if (div) {
              if (!prevQueue.find((val) => val.id === div.id)) prevQueue.push(div);
              curQueuePrg.push({ progress: 0 });
              curQueueVel.push({ vel: '0.0MiB/s' });
            }
          }
        }
      }
      updateQueue(prevQueue);
      updateQueuePrg(curQueuePrg);
      updateQueueVel(curQueueVel);
    }
    updateInfo('Done fetching');
  });
};
