import ytpl from 'ytpl';
import { youtubeDlWrap } from '../youtube-dl-wrap';
import ytdl from 'ytdl-core';
import { getOtherDiv } from './getOtherInfo';
import { getYoutubeDiv } from './getYoutubeInfo';
import util from 'util';
import { outerContext } from '../../App';
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
  const { curInfo, curQueue, updateInfo, updateQueue } = outerContext;
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

  const promise = Promise.all(divs);

  promise.then((val: any) => {
    if (val) {
      const prevQueue = [...curQueue];
      for (const divs of val) {
        if (divs) {
          for (const div of divs) {
            if (div) {
              if (!prevQueue.find((val) => val.id === div.id)) prevQueue.push(div);
            }
          }
        }
      }
      updateQueue(prevQueue);
    }
    updateInfo('Done fetching');
  });

  const updateTest = async () => {
    if (util.inspect(promise).includes('pending')) {
      if (curInfo) {
        if (curInfo.includes('Fetching videos')) {
          const new_info =
            curInfo.substring(curInfo.length - 3, curInfo.length) === '...'
              ? curInfo.substring(0, curInfo.length - 3)
              : `${curInfo}.`;
          updateInfo(new_info);
        }
        setTimeout(updateTest, 333);
      }
    }
  };

  updateTest();
};
