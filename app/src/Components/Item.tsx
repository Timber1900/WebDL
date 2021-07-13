import { useContext, useRef } from 'react';
import { useState } from 'react';
import { CgRename, MdContentCut, CgSoftwareDownload, CgClose } from 'react-icons/all'
import { Storage } from '../Constants';
import { InfoQueueContext, progressProps, velProps } from '../contexts/InfoQueueContext';
import { downloadAudio } from '../Functions/youtube-dl-wrap/downloadAudio';
import { downloadOther } from '../Functions/youtube-dl-wrap/downloadOther';
import { downloadVideo } from '../Functions/youtube-dl-wrap/downloadVideo';
import VerticalProgressBar from './VerticalProgressBar';
import Trim from './Trim';
export interface Props {
  i: number;
  id: string;
  thumbnail: string;
  info: any;
  quality: Map<string, any>;
  curQual: string;
  title: string;
  download: boolean;
  merge: boolean;
  ext: string;
  duration: number;
  clips: InnerProps[];
  animate?: boolean;
  show: boolean;
}

export interface InnerProps {
  h1: string;
  m1: string;
  s1: string;
  h2: string;
  m2: string;
  s2: string;
  i: number;
  start: number;
  end: number;
  id: string;
  index: number;
  change: any;
}

const Item = ({ duration, title, thumbnail, quality, curQual, i, ext, show, id, merge, clips}: Props) => {
  const [qual, setQual] = useState(quality.get(curQual));
  const [trim, setTrim] = useState(false);
  const {curQueue, updateQueue, updateQueuePrg, updateQueueVel, curCustomExt, curConcurrentDownload, curQueuePrg, curQueueVel} = useContext(InfoQueueContext);
  const context = useContext(InfoQueueContext);
  const titleLabel = useRef<HTMLSpanElement>(null);

  const prg = curQueuePrg[i].progress;
  const vel = curQueueVel[i].vel;

  const seconds = duration % 60;
  const minutes = ((duration - seconds) / 60) % 60;
  const hours = (((duration - seconds) / 60) - minutes) / 60;

  const options: any = [];
  quality.forEach((value, key) => {
    options.push(key);
  });

  const dv = () => {
    const format = quality.get(curQual);
    const callback = () => {
      const removedQueue = curQueue.filter((e) => e.id !== id);
      const tempPrg = Array.from({length: removedQueue.length}, ():progressProps => ({progress: 0}));
      const tempVel = Array.from({length: removedQueue.length}, ():velProps => ({ vel: '0.0MiB/s' }));
      updateQueue(removedQueue);
      updateQueuePrg(tempPrg);
      updateQueueVel(tempVel);
    };
    let type, extension;
    if (ext === 'custom') {
      if (curCustomExt || (curCustomExt ?? '').length > 2) {
        [type, extension] = curCustomExt?.split(' ') ?? ['v', 'mkv'];
      } else {
        alert('You must define a custom extesion type in the navbar to be able to use the \'Other\' tag');
        return;
      }
    } else {
      [type, extension] = ext.split(' ');
    }

    if (merge) {
      if (type === 'v') {
        downloadVideo(id, title, format, extension, clips, duration, context, 0, i).then(() => {
          callback();
        });
      } else {
        downloadAudio(id, title, extension, clips, duration, context, 0, i).then(() => {
          callback();
        });
      }
    } else {
      downloadOther(id, title, extension, clips, duration, format, context, 0, i).then(() => {
        callback();
      });
    }
  };

  const updateQual = (newQual: string) => {
    setQual(newQual);
    const tempQueue = [...curQueue];
    console.log(tempQueue)
    tempQueue[i].curQual = newQual;
    updateQueue(tempQueue);
  };

  const changeExt = (ext: string) => {
    const tempQueue = [...curQueue];
    tempQueue[i].ext = ext;
    updateQueue(tempQueue);
  };

  const removeQueue = () => {
    const tempQueue = [...curQueue];
    tempQueue.splice(i, 1);
    updateQueue(tempQueue);
  }

  const renameVideo = function (e: HTMLSpanElement) {
    const label = e;
    label.setAttribute('contenteditable', 'true');
    label.className = label.className.replace('truncate', '');
    label.focus();

    const changeTitle = (title: string) => {
      const tempQueue = [...curQueue];
      tempQueue[i].title = title;
      updateQueue(tempQueue);
    };

    function stopRenameEnter(event: KeyboardEvent) {
      if (event.target === label && event.key === 'Enter') {
        label.innerHTML.replace(/\n/g, '');
        document.removeEventListener('keydown', stopRenameEnter);
        label.blur();
      }
    }

    function stopRename() {
      label.setAttribute('contenteditable', 'false');
      label.removeEventListener('focusout', stopRename);
      label.className = `${label.className} truncate`
      label.scrollLeft = 0;
      changeTitle(label.innerHTML);
    }

    document.addEventListener('keydown', stopRenameEnter);
    e.addEventListener('focusout', stopRename);
  };

  return(
    <>
      {trim && <Trim closeTrim={() => setTrim(false)} hh={hours < 10 ? `0${hours}` : hours.toString()} mm={minutes < 10 ? `0${minutes}` : minutes.toString()} ss={seconds < 10 ? `0${seconds}` : seconds.toString()} clips={clips} i={i}/>}
      <div className={`${show ? 'grid' : 'hidden'} w-auto h-auto max-w-4xl grid-cols-5 gap-2 p-4 pr-0 m-4 bg-white rounded-md shadow-md max-h-56 min-h-48 dark:bg-gray-800 place-items-center`}>
        <div className="h-auto col-span-2 rounded-md shadow-sm max-h-56">
          <img width="300" height="166" src={thumbnail} alt={title} className="rounded-md w-min"/>
        </div>
        <div className="grid w-full h-full grid-cols-10 col-span-3 grid-rows-3 gap-2">
          <span className={`grid place-items-center ${curConcurrentDownload > 1 ? 'col-span-7' : 'col-span-9'} col-start-1 row-span-1 row-start-1 w-full`}>
            <span className="w-full overflow-hidden text-center truncate whitespace-nowrap" ref={titleLabel}>
              {title}
            </span>
          </span>
          <div className={`grid grid-cols-2 ${curConcurrentDownload > 1 ? 'col-span-7' : 'col-span-9'} col-start-1 row-span-1 row-start-2 gap-2 place-items-center`}>
            <span className="flex items-center justify-center w-full h-full gap-2 text-base font-medium flex-rows">
              <label htmlFor='qual'>Quality: </label>
              <select onChange={(e) => {updateQual(quality.get(e.target.value))}} defaultValue={curQual} id='qual' className="bg-gray-100 rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none">
              {options.map((val: string, i: number) => {
                return (
                  <option value={val} key={i}>
                    {val}
                  </option>
                );
              })}
              </select>
            </span>
            <span className="flex items-center justify-center w-full h-full gap-2 text-base font-medium flex-rows">
              <label htmlFor='qual'>Extension: </label>
              <select defaultValue={ext} onChange={(e) => changeExt(e.target.value)} id='qual' className="w-16 bg-gray-100 rounded-md shadow-sm dark:bg-gray-700 focus:outline-none">
                <optgroup label="Video">
                  <option value="v mkv">mkv</option>
                  <option value="v mp4">mp4</option>
                  <option value="v avi">avi</option>
                  <option value="v webm">webm</option>
                </optgroup>
                <optgroup label="Audio">
                  <option value="a mp3">mp3</option>
                  <option value="a m4a">m4a</option>
                  <option value="a ogg">ogg</option>
                  <option value="a wav">wav</option>
                </optgroup>
                <option value="custom">Other</option>
              </select>
            </span>
          </div>
          <div className={`grid grid-cols-2 ${curConcurrentDownload > 1 ? 'col-span-7' : 'col-span-9'} col-start-1 row-span-1 row-start-3 gap-2 place-items-center`}>
            <span className="text-base font-medium">
              <p>Duration: <code className="dark:bg-gray-700 bg-gray-100 px-1 py-0.5 rounded-lg">{hours > 0 ? `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}` : `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</code></p>
            </span>
            <span className="text-base font-medium">
              <p>Size: <code className="dark:bg-gray-700 bg-gray-100 px-1 py-0.5 rounded-lg">{(qual.filesize ?? qual.contentLength) ? `${((qual.filesize ?? qual.contentLength) / Storage.MEGABYTE).toFixed(2)} MiB` : 'Unknown'}</code></p>
            </span>
          </div>
          <div className="grid grid-cols-1 col-span-1 col-start-10 grid-rows-4 row-span-3 row-start-1 gap-1 border-l border-gray-200 dark:border-gray-700 place-items-center">
            {/* <CgRename className="text-black transition-all transform scale-100 fill-current dark:active:text-gray-300 active:scale-95 active:text-gray-700 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:scale-125" onClick={() => {if(titleLabel.current) renameVideo(titleLabel.current)}}/> */}

            <svg className="text-black transition-all transform scale-100 fill-[none] stroke-current group dark:active:text-gray-300 active:scale-95 active:text-gray-700 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:scale-125 w-[24px] h-[24px] stroke-[40px]" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="-10 0 475.2 303.46" onClick={() => {if(titleLabel.current) renameVideo(titleLabel.current)}}>
              <path d="M378.5,248.03H66.69c-31.31,0-56.69-25.38-56.69-56.69V92.13c0-31.31,25.38-56.69,56.69-56.69H378.5 c31.31,0,56.69,25.38,56.69,56.69v99.21C435.2,222.65,409.81,248.03,378.5,248.03z" />
              <path d="M378.5,248.03H66.69c-31.31,0-56.69-25.38-56.69-56.69V92.13c0-31.31,25.38-56.69,56.69-56.69H378.5 c31.31,0,56.69,25.38,56.69,56.69v99.21C435.2,222.65,409.81,248.03,378.5,248.03z" />
              <line className="translate-x-[calc(30%-20px)] group-hover:translate-x-[calc(65%-20px)] transition-all ease-out" stroke-linecap="round" y1="-20" y2="303.46" />
              <line className="stroke-current text-gray-200 dark:text-gray-800 translate-x-[calc(30%+20px)] group-hover:translate-x-[calc(65%+20px)] transition-all ease-out" y1="-20" y2="303.46" />
            </svg>

            <MdContentCut className="text-black transition-all transform scale-100 fill-current dark:active:text-gray-300 active:scale-95 active:text-gray-700 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:scale-125" onClick={() => setTrim(true)}/>

            <svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" className="text-black transition-all transform scale-100 fill-current group dark:active:text-gray-300 active:scale-95 active:text-gray-700 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:scale-125" height="1em" width="1em" onClick={dv} xmlns="http://www.w3.org/2000/svg">
              <path className="active:animate-download" d="M11 5C11 4.44772 11.4477 4 12 4C12.5523 4 13 4.44772 13 5V12.1578L16.2428 8.91501L17.657 10.3292L12.0001 15.9861L6.34326 10.3292L7.75748 8.91501L11 12.1575V5Z" fill="currentColor" />
              <rect className="text-gray-200 dark:text-gray-800" width="24" y="18" height="8"></rect>
              <path d="M4 14H6V18H18V14H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V14Z" fill="currentColor" />
            </svg>
            <CgClose onClick={removeQueue} className="text-black transition-all transform scale-100 rotate-0 fill-current active:text-red-600 active:scale-95 dark:active:text-red-600 dark:text-white hover:text-red-500 dark:hover:text-red-500 hover:rotate-90 hover:scale-125"/>
          </div>
          {(curConcurrentDownload > 1) &&
          <div className='flex items-center justify-end w-full h-full col-span-2 col-start-8 row-span-3 text-base'>
            <div className="flex flex-col items-center justify-start h-full font-normal text-right">
              <div className="w-full mb-auto">{prg}%</div>
              <div className="w-full">{vel.slice(0, -5)}</div>
              <div className="w-full">{vel.substring(vel.length - 5, vel.length)}</div>
            </div>
            <VerticalProgressBar id={`vprogress${i}`} value={prg / 100}/>
          </div>
          }
        </div>
      </div>
    </>
  )
}

export default Item;
