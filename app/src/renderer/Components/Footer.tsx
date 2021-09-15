import * as React from 'react';
import { InfoQueueContext, progressProps, velProps, etaProps } from '../contexts/InfoQueueContext';
import { useContext, useState } from 'react';
import { MdSettings, MdSearch } from 'react-icons/md';
import { CgClose } from 'react-icons/cg';
import { SettingsContext } from '../contexts/SettingsContext';
import { downloadVideo } from '../Functions/youtube-dl-wrap/downloadVideo';
import { downloadAudio } from '../Functions/youtube-dl-wrap/downloadAudio';
import { downloadOther } from '../Functions/youtube-dl-wrap/downloadOther';
import { Props } from './Item';
import { downloadCaptions } from '../Functions/youtube-dl-wrap/downloadCaptions';


const Footer = () => {
  const { curInfo } = useContext(InfoQueueContext);
  const { changeShowSettings, changeShowSearch } = useContext(SettingsContext);
  const { updateQueue, updateQueuePrg, updateQueueVel, updateQueueEta, curConcurrentDownload, curQueue, curCustomExt } = useContext(InfoQueueContext);
  const [disable, setDisable] = useState(false);
  const [stop, setStop] = useState(false);
  const context = useContext(InfoQueueContext);

  const clearQueue = () => {
    updateQueue([]);
    updateQueuePrg([]);
    updateQueueVel([]);
    updateQueueEta([]);
  };

  const downloadQueue = () => {
    setDisable(true);
    const download_queue: (Props | null)[] = [];
    let cur_index = 0;

    while (download_queue.length < curConcurrentDownload) {
      if (cur_index >= curQueue.length) {
        break;
      } else if (curQueue[cur_index].download) {
        curQueue[cur_index].i = cur_index;
        download_queue.push(curQueue[cur_index]);
      }
      cur_index++;
    }

    const callback = (vid_index: number, queue_index: number) => {
      const temp = [...curQueue];
      temp[queue_index].show = false;
      updateQueue(temp);

      const vid = download_queue[queue_index];
      if(vid?.open) vid.open(false)

      let found = false;
      while (!found) {
        if (cur_index >= curQueue.length) {
          download_queue[vid_index] = null;
          break;
        } else if (curQueue[cur_index].download && !download_queue.includes(curQueue[cur_index])) {
          curQueue[cur_index].i = cur_index;
          download_queue[vid_index] = curQueue[cur_index];
          found = true;
        }
        cur_index++;
      }

      if (found && !stop) download(vid_index);
      if (download_queue.reduce((previousValue, currentValue) => previousValue && !currentValue, true)) {
        let temp = [...curQueue];
        temp[queue_index].show = false;
        temp = temp.filter((val) => val.show);
        const tempPrg = new Array<progressProps>(temp.length).fill({ progress: 0 });
        const tempVel = new Array<velProps>(temp.length).fill({ vel: '0.0MiB/s' });
        const tempEta = new Array<etaProps>(temp.length).fill({ eta: '00:00' });
        updateQueue(temp);
        updateQueuePrg(tempPrg);
        updateQueueVel(tempVel);
        updateQueueEta(tempEta);
        setDisable(false);
        setStop(false);
      }
    };

    const download = (vid_index: number): void => {
      const vid = download_queue[vid_index];
      if (!vid) return;

      if(vid.open) vid.open(true)
      const format = vid.quality.get(vid.curQual.toString());

      let type, extension;
      if (vid.ext === 'custom') {
        if (curCustomExt || (curCustomExt ?? '').length > 2) {
          [type, extension] = curCustomExt?.split(' ') ?? ['v', 'mkv'];
        } else {
          alert('You must define a custom extesion type in the navbar to be able to use the \'Other\' tag');
          return;
        }
      } else {
        [type, extension] = vid.ext.split(' ');
      }

      if(vid.captions.length > 0) {
        vid.captions.forEach(({formatName, languageName, translateName}) => downloadCaptions(languageName, translateName, formatName, vid.info.player_response.captions, vid.info.videoDetails.title))
      }

      if (vid.merge) {
        if (type === 'v') {
          downloadVideo(vid.id, vid.title, format, extension, vid.clips, vid.duration, context, vid_index, vid.i).then(
            ({ vid_index, queue_index }) => {
              callback(vid_index, queue_index);
            },
          );
        } else {
          downloadAudio(vid.id, vid.title, extension, vid.clips, vid.duration, context, vid_index, vid.i).then(
            ({ vid_index, queue_index }) => {
              callback(vid_index, queue_index);
            },
          );
        }
      } else {
        downloadOther(vid.id, vid.title, extension, vid.clips, vid.duration, format, context, vid_index, vid.i).then(
          ({ vid_index, queue_index }) => {
            callback(vid_index, queue_index);
          },
        );
      }
    };

    if (download_queue.length === 0) {
      setDisable(false);
      return;
    }

    for (let i = 0; i < download_queue.length; i++) {
      download(i);
    }
  };

  return (
    <footer className="flex flex-row items-center justify-end w-full gap-4 p-2 text-xl font-bold border-t border-gray-200 shadow-md whitespace-nowrap overflow-ellipsis dark:border-gray-700">
      <span className="mx-auto text-center truncate w-[calc(100vw-10rem)]">{curInfo}</span>
      <span className="flex items-center justify-center gap-2 w-[7.5rem] overflow-visible">
        <button aria-label="Clear entire queue" className="w-max h-max dark:after:content-[attr(aria-label)] after:content-[attr(aria-label)] hover:after:content-[attr(aria-label)] relative after:absolute after:text-xl after:bottom-[150%] after:bg-gray-300 dark:after:bg-gray-600 after:shadow-md after:w-max after:h-max after:-inset-x-36 after:mx-auto after:px-2 after:py-1 after:rounded-md after:text-base cursor-default after:opacity-0 after:scale-0 after:transform hover:after:opacity-100 hover:after:scale-100 after:origin-bottom after:transition-all after:delay-[0ms] hover:after:delay-1000 after:z-10 ">
          <CgClose onClick={clearQueue} className="ml-auto text-black transition-all duration-200 transform scale-125 rotate-0 cursor-pointer fill-current hover:scale-150 active:scale-110 hover:rotate-90 hover:text-gray-900 dark:text-white dark:hover:text-gray-200 hover:text-red-500 dark:hover:text-red-500 active:text-red-600 dark:active:text-red-600" />
        </button>
        <button aria-label="Download queue" className="w-max h-max dark:after:content-[attr(aria-label)] after:content-[attr(aria-label)] hover:after:content-[attr(aria-label)] relative after:absolute after:text-xl after:bottom-[150%] after:bg-gray-300 dark:after:bg-gray-600 after:shadow-md after:w-max after:h-max after:-inset-x-36 after:mx-auto after:px-2 after:py-1 after:rounded-md after:text-base cursor-default after:opacity-0 after:scale-0 after:transform hover:after:opacity-100 hover:after:scale-100 after:origin-bottom after:transition-all after:delay-[0ms] hover:after:delay-1000 after:z-10 ">
          <svg viewBox="0 0 13.33 13.33" className="text-black transition-all duration-200 transform scale-125 cursor-pointer fill-current hover:scale-150 active:scale-110 hover:text-gray-900 dark:text-white dark:hover:text-gray-200 group p-[2px]" version="1.1" x="0px" y="0px" width="20px" height="20px" onClick={() => { if (!disable) downloadQueue(); }}>
            <path d="M5.83,0.83C5.83,0.37,6.2,0,6.67,0S7.5,0.37,7.5,0.83V6.8l2.7-2.7l1.18,1.18l-4.72,4.7L1.95,5.27l1.18-1.18l2.7,2.72V0.83z" className="transition-all duration-500 -translate-y-full group-hover:translate-y-0 group-hover:delay-100" />
            <path d="M5.83,0.83C5.83,0.37,6.2,0,6.67,0S7.5,0.37,7.5,0.83V6.8l2.7-2.7l1.18,1.18l-4.72,4.7L1.95,5.27l1.18-1.18l2.7,2.72V0.83z" className="group-hover:translate-y-full translate-y-0 transition-all group-hover:delay-[0] delay-100 duration-500" />
            <path d="M0,8.33h1.67v3.33h10V8.33h1.67v3.33c0,0.92-0.75,1.67-1.67,1.67h-10C0.75,13.33,0,12.58,0,11.67V8.33z" />
          </svg>
        </button>
        <button aria-label="Search YouTube" className="w-max h-max dark:after:content-[attr(aria-label)] after:content-[attr(aria-label)] hover:after:content-[attr(aria-label)] relative after:absolute after:text-xl after:bottom-[150%] after:bg-gray-300 dark:after:bg-gray-600 after:shadow-md after:w-max after:h-max after:-right-9 after:px-2 after:py-1 after:rounded-md after:text-base cursor-default after:opacity-0 after:scale-0 after:transform hover:after:opacity-100 hover:after:scale-100 after:origin-bottom after:transition-all after:delay-[0ms] hover:after:delay-1000 after:z-10 ">
          <MdSearch onClick={changeShowSearch} className="text-black transition-all duration-200 transform scale-125 cursor-pointer fill-current hover:scale-150 active:scale-110 hover:text-gray-900 dark:text-white dark:hover:text-gray-200" />
        </button>
        <button aria-label="Settings" className="w-max h-max dark:after:content-[attr(aria-label)] after:content-[attr(aria-label)] hover:after:content-[attr(aria-label)] relative after:absolute after:text-xl after:bottom-[150%] after:bg-gray-300 dark:after:bg-gray-600 after:shadow-md after:w-max after:h-max after:-right-2 after:px-2 after:py-1 after:rounded-md after:text-base cursor-default after:opacity-0 after:scale-0 after:z-10 after:transform hover:after:opacity-100 hover:after:scale-100 after:origin-bottom after:transition-all after:delay-[0ms] hover:after:delay-1000">
          <MdSettings onClick={changeShowSettings} className="text-black transition-all duration-200 transform scale-125 rotate-0 fill-current hover:scale-150 active:scale-110 hover:rotate-90 hover:text-gray-900 dark:text-white dark:hover:text-gray-200" />
        </button>
      </span>
    </footer>
  );
};

export default Footer;
