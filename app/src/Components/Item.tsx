import { useContext, useRef } from 'react';
import { useState } from 'react';
import { CgClose } from 'react-icons/all'
import { Storage, InfoVideo } from '../Constants';
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

const Item = ({ duration, title, thumbnail, quality, curQual, i, ext, show, id, merge, clips, info }: Props) => {
  const innerInfo: InfoVideo = info as InfoVideo;
  const [qual, setQual] = useState(quality.get(curQual));
  const [trim, setTrim] = useState(false);
  const [showInfo, setInfo] = useState(false);
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
    const format = quality.get(curQual.toString());
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

  const updateQual = (newQual: any) => {
    setQual(newQual);
    const tempQueue = [...curQueue];
    tempQueue[i].curQual = newQual.qualityLabel ?? newQual.itag ?? newQual.height;
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

  function linkify(text: string) {
    text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
    const urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
    return text.replace(urlRegex, function(url: string) {
      return `<a onclick="require('nw.gui').Shell.openExternal('${url}')" class="text-indigo-400 hover:text-indigo-500 active:text-indigo-600 transition-colors cursor-pointer" >${url}</a>`;
    });
  }

  return(
    <>
      {trim && <Trim closeTrim={() => setTrim(false)} hh={hours < 10 ? `0${hours}` : hours.toString()} mm={minutes < 10 ? `0${minutes}` : minutes.toString()} ss={seconds < 10 ? `0${seconds}` : seconds.toString()} clips={clips} i={i}/>}
      <div className={`absolute inset-0 z-10 bg-black ${showInfo ? 'opacity-40 pointer-events-auto': 'opacity-0 pointer-events-none'}  transition-opacity duration-200`} onClick={() => {setInfo(false)}}></div>
      {(showInfo && merge) &&
        <div className="absolute z-20 flex flex-col items-center justify-start gap-4 p-8 bg-white rounded-lg shadow-lg inset-x-0 mx-auto min-w-[576px] w-max max-w-[636px] inset-y-12 dark:bg-gray-800">
          <h1 className="text-2xl text-center">{innerInfo.videoDetails.title}</h1>
          <span className="grid grid-cols-5 grid-rows-2 gap-2 max-h-32">
            <img className="col-span-2 col-start-1 row-span-2 my-auto rounded-lg shadow-md max-h-32" src={innerInfo.videoDetails.thumbnails[innerInfo.videoDetails.thumbnails.length - 1].url} alt='Video Thumbnail'/>
            <div className="flex flex-col col-span-3 row-span-2 gap-2 my-auto">
              <span className='flex flex-row items-center justify-start gap-2'>
                <img src={innerInfo.videoDetails.author.thumbnails[innerInfo.videoDetails.author.thumbnails.length -1].url} alt='Channel logo' className="cursor-pointer rounded-full h-[50px] m-[5px]" onClick={() => {require('electron').shell.openExternal(innerInfo.videoDetails.author.channel_url)}}/>
                <div className="flex flex-col items-start justify-center col-span-2 my-auto">
                  <p className='flex flex-row items-center justify-start gap-1 mt-auto text-base font-semibold text-left cursor-pointer' onClick={() => {require('electron').shell.openExternal(innerInfo.videoDetails.author.channel_url)}}>{innerInfo.videoDetails.author.name}
                  {innerInfo.videoDetails.author.verified &&
                  <div aria-label="Verified" className="after:content-[attr(aria-label)] dark:after:content-[attr(aria-label)] dark:hover:after:content-[attr(aria-label)] hover:after:content-[attr(aria-label)] relative after:absolute after:bottom-[130%] after:-inset-x-24 after:mx-auto after:px-1 after:py-.5 after:w-max after:bg-gray-200 dark:after:bg-gray-600 after:rounded-md after:opacity-0 after:scale-0 hover:after:opacity-100 hover:after:scale-100 after:origin-bottom after:transition-all">
                  <svg className="text-gray-400 fill-current dark:text-gray-500" version="1.1" x="0px" y="0px" height="13px" viewBox="0 0 20 20">
                    <path style={{'fillRule': 'evenodd','clipRule':'evenodd'}} d="M10,0C4.48,0,0,4.48,0,10s4.48,10,10,10s10-4.48,10-10S15.52,0,10,0z M7.92,15.93l-4.95-4.95l2.05-2.05
                      l2.9,2.9l7.35-7.35l2.05,2.05L7.92,15.93z"/>
                    </svg>
                  </div>
                  }
                  </p>
                  <p className='text-sm font-normal text-left text-gray-400 dark:text-gray-500'>{(innerInfo.videoDetails.author.subscriber_count ?? 0).toLocaleString()} subscribers</p>
                </div>
              </span>
              <span className='flex flex-row items-center justify-start gap-2 mx-4 text-sm font-semibold text-gray-500 divide-x divide-gray-500'>
                <span className="flex flex-row gap-4">
                  <span className="flex flex-row items-center justify-center gap-2">
                  <svg className="text-gray-500 fill-current dark:text-gray-400" version="1.1" x="0px" y="0px" width="22px" height="20px" viewBox="0 0 22 20">
                    <path d="M0,20h4V8H0V20z M22,9c0-1.1-0.9-2-2-2h-6.31l0.95-4.57l0.03-0.32c0-0.41-0.17-0.79-0.44-1.06L13.17,0L6.59,6.59
                      C6.22,6.95,6,7.45,6,8v10c0,1.1,0.9,2,2,2h9c0.83,0,1.54-0.5,1.84-1.22l3.02-7.05C21.95,11.5,22,11.26,22,11V9.09l-0.01-0.01L22,9z
                      "/>
                  </svg>
                  {innerInfo.videoDetails.likes.toLocaleString()}
                </span>
                  <span className="flex flex-row items-center justify-center gap-2">
                  <svg className="text-gray-500 fill-current dark:text-gray-400" version="1.1" x="0px" y="0px" width="22px" height="20px" viewBox="0 0 22 20">
                    <path d="M14,0H5C4.17,0,3.46,0.5,3.16,1.22L0.14,8.27C0.05,8.5,0,8.74,0,9v1.91l0.01,0.01L0,11c0,1.1,0.9,2,2,2h6.31l-0.95,4.57
                      l-0.03,0.32c0,0.41,0.17,0.79,0.44,1.06L8.83,20l6.59-6.59C15.78,13.05,16,12.55,16,12V2C16,0.9,15.1,0,14,0z M18,0v12h4V0H18z"/>
                  </svg>
                  {innerInfo.videoDetails.dislikes.toLocaleString()}
                </span>
                </span>
                  <span className="pl-2">
                    {parseInt(innerInfo.videoDetails.viewCount).toLocaleString()} views
                  </span>
                </span>
            </div>
          </span>
          <p className="flex-grow w-full col-span-3 overflow-y-scroll text-sm text-base text-left sm:font-normal" dangerouslySetInnerHTML={{__html: linkify(innerInfo.videoDetails.description ?? '')}}></p>
          <span className="flex flex-wrap w-full gap-2 overflow-y-scroll max-h-28">
            <h2 className="text-lg font-bold">Tags:</h2>
            {innerInfo.videoDetails.keywords?.map((val, i) =>
              <code className="px-2 py-1 my-auto text-base font-semibold text-center bg-gray-200 rounded-md cursor-pointer dark:bg-gray-700" key={i} onClick={() => {require('electron').shell.openExternal(`https://www.youtube.com/results?search_query=${val.replace(" ", "+")}`)}}>{val}</code>
            )}
          </span>
        </div>
      }
      <div className={`${show ? 'grid' : 'hidden'} w-auto h-auto max-w-4xl grid-cols-5 gap-2 p-4 pr-0 m-4 bg-white rounded-md shadow-md max-h-56 min-h-48 dark:bg-gray-800 place-items-center animate-appear origin-top`}>
        <div className="h-auto col-span-2 rounded-md shadow-sm max-h-56 w-[300px] h-[166px] grid place-content-center">
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
              <select onChange={(e) => { updateQual(quality.get(e.target.value)) }} defaultValue={curQual} id='qual' className="bg-gray-100 rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none">
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
                  <option value="v mov">mov</option>
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
          <div className="grid grid-cols-1 col-span-1 col-start-10 grid-rows-5 row-span-3 row-start-1 gap-1 border-l border-gray-200 dark:border-gray-700 place-items-center">
            <button aria-label="Rename video" className="after:content-[attr(aria-label)] dark:after:content-[attr(aria-label)] hover:after:content-[attr(aria-label)] dark:hover:after:content-[attr(aria-label)] relative after:absolute after:text-base after:inset-y-0 after:right-[130%] after:w-max after:bg-gray-300 dark:after:bg-gray-600 after:shadow-md after:opacity-0 after:scale-0 after:transform hover:after:opacity-100 hover:after:scale-100 after:origin-right after:transition-all after:delay-[0ms] hover:after:delay-1000 after:px-2 after:py-1 after:rounded-md after:text-center after:h-max after:grid after:place-content-center">
              <svg className="text-black transition-all transform scale-100 fill-[none] stroke-current group dark:active:text-gray-300 active:scale-95 active:text-gray-700 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:scale-125 w-[24px] h-[24px] stroke-[40px]" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="-10 0 475.2 303.46" onClick={() => {if(titleLabel.current) renameVideo(titleLabel.current)}}>
                <path d="M378.5,248.03H66.69c-31.31,0-56.69-25.38-56.69-56.69V92.13c0-31.31,25.38-56.69,56.69-56.69H378.5 c31.31,0,56.69,25.38,56.69,56.69v99.21C435.2,222.65,409.81,248.03,378.5,248.03z" />
                <path d="M378.5,248.03H66.69c-31.31,0-56.69-25.38-56.69-56.69V92.13c0-31.31,25.38-56.69,56.69-56.69H378.5 c31.31,0,56.69,25.38,56.69,56.69v99.21C435.2,222.65,409.81,248.03,378.5,248.03z" />
                <line className="translate-x-[calc(30%-20px)] group-hover:translate-x-[calc(65%-20px)] transition-all ease-out" strokeLinecap="round" y1="-20" y2="303.46" />
                <line className="stroke-current text-gray-200 dark:text-gray-800 translate-x-[calc(30%+20px)] group-hover:translate-x-[calc(65%+20px)] transition-all ease-out" y1="-20" y2="303.46" />
              </svg>
            </button>
            <button aria-label="Trim video" className="after:content-[attr(aria-label)] dark:after:content-[attr(aria-label)] hover:after:content-[attr(aria-label)] dark:hover:after:content-[attr(aria-label)] relative after:absolute after:text-base after:inset-y-0 after:right-[130%] after:w-max after:bg-gray-300 dark:after:bg-gray-600 after:shadow-md after:opacity-0 after:scale-0 after:transform hover:after:opacity-100 hover:after:scale-100 after:origin-right after:transition-all after:delay-[0ms] hover:after:delay-1000 after:px-2 after:py-1 after:rounded-md after:text-center after:h-max after:grid after:place-content-center">
              <svg width="1em" height="1em" className="overflow-visible text-black transition-all transform scale-100 fill-current dark:active:text-gray-300 active:scale-95 active:text-gray-700 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 group p-[1px]" viewBox="0 0 130.45 130.25" onClick={() => setTrim(true)}>
                <g className="transition-all origin-center rotate-0 group-hover:rotate-[-15deg]">
                  <path d="M49.83,36.79c1.5-3.26,2.35-6.85,2.35-10.7C52.18,11.68,40.51,0,26.09,0C11.68,0,0,11.68,0,26.09s11.68,26.09,26.09,26.09
                    c3.85,0,7.44-0.85,10.7-2.35l15.39,15.39l13.05,13.05l45.66,45.66h19.57v-6.52L49.83,36.79z M26.09,39.14
                    c-7.17,0-13.05-5.81-13.05-13.05c0-7.24,5.87-13.05,13.05-13.05c7.17,0,13.05,5.81,13.05,13.05
                    C39.14,33.33,33.27,39.14,26.09,39.14z M65.23,70.9c-3.13,0-5.67-2.54-5.67-5.67c0-3.13,2.54-5.67,5.67-5.67s5.67,2.54,5.67,5.67
                    C70.9,68.36,68.36,70.9,65.23,70.9z"/>
                </g>
                <g className="transition-all origin-center rotate-0 group-hover:rotate-[15deg]">
                  <path d="M130.45,6.31h-19.57L65.23,51.97L52.18,65.02L36.79,80.41c-3.26-1.5-6.85-2.35-10.7-2.35C11.68,78.06,0,89.74,0,104.16
                    c0,14.42,11.68,26.09,26.09,26.09c14.42,0,26.09-11.68,26.09-26.09c0-3.85-0.85-7.44-2.35-10.7l80.62-80.62V6.31z M26.09,117.2
                    c-7.17,0-13.05-5.81-13.05-13.05c0-7.24,5.87-13.05,13.05-13.05c7.17,0,13.05,5.81,13.05,13.05
                    C39.14,111.4,33.27,117.2,26.09,117.2z M65.23,70.69c-3.13,0-5.67-2.54-5.67-5.67c0-3.13,2.54-5.67,5.67-5.67s5.67,2.54,5.67,5.67
                    C70.9,68.15,68.36,70.69,65.23,70.69z"/>
                </g>
              </svg>
            </button>
            <button aria-label="Download video" className="after:content-[attr(aria-label)] dark:after:content-[attr(aria-label)] hover:after:content-[attr(aria-label)] dark:hover:after:content-[attr(aria-label)] relative after:absolute after:text-base after:inset-y-0 after:right-[130%] after:w-max after:bg-gray-300 dark:after:bg-gray-600 after:shadow-md after:opacity-0 after:scale-0 after:transform hover:after:opacity-100 hover:after:scale-100 after:origin-right after:transition-all after:delay-[0ms] hover:after:delay-1000 after:px-2 after:py-1 after:rounded-md after:text-center after:h-max after:grid after:place-content-center">
              <svg viewBox="0 0 13.33 13.33" className="text-black transition-all duration-200 transform scale-125 cursor-pointer fill-current hover:scale-150 active:scale-110 hover:text-gray-900 dark:text-white dark:hover:text-gray-200 group p-[4px]" version="1.1" x="0px" y="0px" height="1em" width="1em" onClick={dv}>
                <path d="M5.83,0.83C5.83,0.37,6.2,0,6.67,0S7.5,0.37,7.5,0.83V6.8l2.7-2.7l1.18,1.18l-4.72,4.7L1.95,5.27l1.18-1.18l2.7,2.72V0.83z" className="transition-all duration-500 -translate-y-full group-hover:translate-y-0 group-hover:delay-100" />
                <path d="M5.83,0.83C5.83,0.37,6.2,0,6.67,0S7.5,0.37,7.5,0.83V6.8l2.7-2.7l1.18,1.18l-4.72,4.7L1.95,5.27l1.18-1.18l2.7,2.72V0.83z" className="group-hover:translate-y-full translate-y-0 transition-all group-hover:delay-[0] delay-100 duration-500" />
                <path d="M0,8.33h1.67v3.33h10V8.33h1.67v3.33c0,0.92-0.75,1.67-1.67,1.67h-10C0.75,13.33,0,12.58,0,11.67V8.33z" />
              </svg>
            </button>
            <button aria-label="Show video info" className="group after:content-[attr(aria-label)] dark:after:content-[attr(aria-label)] hover:after:content-[attr(aria-label)] dark:hover:after:content-[attr(aria-label)] relative after:absolute after:text-base after:inset-y-0 after:right-[130%] after:w-max after:bg-gray-300 dark:after:bg-gray-600 after:shadow-md after:opacity-0 after:scale-0 after:transform hover:after:opacity-100 hover:after:scale-100 after:origin-right after:transition-all after:delay-[0ms] hover:after:delay-1000 after:px-2 after:py-1 after:rounded-md after:text-center after:h-max after:grid after:place-content-center disabled:opacity-60 opacity-100 disabled:after:opacity-0" onClick={() => setInfo(true)} disabled={!merge}>
              <svg className="text-black group-disabled:text-black transition-all duration-200 transform scale-125 cursor-pointer fill-current group-disabled:scale-125 hover:scale-150 active:scale-110 hover:text-gray-900 dark:text-white dark:group-disabled:text-white dark:hover:text-gray-200 group p-[4px]" x="0px" y="0px" width="1em" height="1em" viewBox="0 0 385.92 385.92">
                <g className="group-hover:rotate-[360deg] group-disabled:rotate-0 rotate-0 transition-all duration-700 origin-center ease-back">
                  <path
                    d="M173.67,173.27c0-10.66,8.64-19.3,19.3-19.3c10.66,0,19.3,8.64,19.3,19.3v115.78c0,10.66-8.64,19.3-19.3,19.3
                    c-10.66,0-19.3-8.64-19.3-19.3V173.27z"
                  />
                  <path
                    d="M192.96,78.17c-10.66,0-19.3,8.64-19.3,19.3c0,10.66,8.64,19.3,19.3,19.3c10.66,0,19.3-8.64,19.3-19.3
                    C212.26,86.81,203.62,78.17,192.96,78.17z"
                  />
                </g>
                <path
                  style={{'fillRule': 'evenodd','clipRule':'evenodd'}}
                  d="M192.96,0C86.39,0,0,86.39,0,192.96c0,106.57,86.39,192.96,192.96,192.96c106.57,0,192.96-86.39,192.96-192.96
                  C385.92,86.39,299.53,0,192.96,0z M38.59,192.96c0,85.26,69.11,154.37,154.37,154.37c85.26,0,154.37-69.11,154.37-154.37
                  c0-85.26-69.11-154.37-154.37-154.37C107.71,38.59,38.59,107.71,38.59,192.96z"
                />
              </svg>
            </button>
            <button aria-label="Remove video from queue" className="after:content-[attr(aria-label)] dark:after:content-[attr(aria-label)] hover:after:content-[attr(aria-label)] dark:hover:after:content-[attr(aria-label)] relative after:absolute after:text-base after:inset-y-0 after:right-[130%] after:w-max after:bg-gray-300 dark:after:bg-gray-600 after:shadow-md after:opacity-0 after:scale-0 after:transform hover:after:opacity-100 hover:after:scale-100 after:origin-right after:transition-all after:delay-[0ms] hover:after:delay-1000 after:px-2 after:py-1 after:rounded-md after:text-center after:h-max after:grid after:place-content-center">
              <CgClose onClick={removeQueue} className="text-black transition-all transform scale-100 rotate-0 fill-current active:text-red-600 active:scale-95 dark:active:text-red-600 dark:text-white hover:text-red-500 dark:hover:text-red-500 hover:rotate-90 hover:scale-125"/>
            </button>
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
