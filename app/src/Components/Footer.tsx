import { InfoQueueContext, progressProps, velProps } from '../contexts/InfoQueueContext';
import { useContext, useState } from 'react';
import { MdSettings, MdSearch } from 'react-icons/md';
import { CgSoftwareDownload, CgClose } from 'react-icons/cg'
import { SettingsContext } from '../contexts/SettingsContext';
import { downloadVideo } from '../Functions/youtube-dl-wrap/downloadVideo';
import { downloadAudio } from '../Functions/youtube-dl-wrap/downloadAudio';
import { downloadOther } from '../Functions/youtube-dl-wrap/downloadOther';
import { Props } from './Item';


const Footer = () => {
  const { curInfo } = useContext(InfoQueueContext);
  const { changeShowSettings, changeShowSearch } = useContext(SettingsContext);
  const { updateQueue, updateQueuePrg, updateQueueVel, curConcurrentDownload, curQueue, curCustomExt } = useContext(InfoQueueContext);
  const [disable, setDisable] = useState(false);
  const [stop, setStop] = useState(false);
  const context = useContext(InfoQueueContext);

  const clearQueue = () => {
    updateQueue([])
    updateQueuePrg([])
    updateQueueVel([])
  }

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
        temp = temp.filter((val, i) => val.show);
        const tempPrg = new Array<progressProps>(temp.length).fill({ progress: 0 });
        const tempVel = new Array<velProps>(temp.length).fill({ vel: '0.0MiB/s' });
        updateQueue(temp);
        updateQueuePrg(tempPrg);
        updateQueueVel(tempVel)
        setDisable(false);
        setStop(false);
      }
    };

    const download = (vid_index: number): void => {
      const vid = download_queue[vid_index];
      if(!vid) return;

      const format = vid.quality.get(vid.curQual);

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

  return(
    <footer className="flex flex-row items-center justify-end w-full gap-4 p-2 text-xl font-bold truncate border-t border-gray-200 shadow-md dark:border-gray-700">
      <span className="w-full text-center truncate">{curInfo}</span>
      <CgClose onClick={clearQueue} className="ml-auto text-black transition-all duration-200 transform scale-125 rotate-0 fill-current hover:scale-150 active:scale-110 hover:rotate-90 hover:text-gray-900 dark:text-white dark:hover:text-gray-200 hover:text-red-500 dark:hover:text-red-500 active:text-red-600 dark:active:text-red-600"/>
      <CgSoftwareDownload className="ml-auto text-black transition-all duration-200 transform scale-125 fill-current hover:scale-150 active:scale-110 hover:text-gray-900 dark:text-white dark:hover:text-gray-200" onClick={() => {if(!disable) downloadQueue()}}/>
      <MdSearch onClick={changeShowSearch} className="ml-auto text-black transition-all duration-200 transform scale-125 fill-current hover:scale-150 active:scale-110 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"/>
      <MdSettings onClick={changeShowSettings} className="ml-auto text-black transition-all duration-200 transform scale-125 rotate-0 fill-current hover:scale-150 active:scale-110 hover:rotate-90 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"/>
    </footer>
  )
}

export default Footer
