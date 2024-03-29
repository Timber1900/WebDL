import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { InfoQueueContext } from '../contexts/InfoQueueContext';
import { setPath } from '../Functions/getPath';
import { port } from '../Functions/server/server';
import { CheckUpdates, getCurrentVersion } from '../Functions/update';
import fs from 'fs';
import { getYoutubeCookies } from '../Functions/getYoutubeCookies';
import { downloadPath } from '../helpers/Constants';
import { join } from "path";
import { CgClose } from 'react-icons/cg';


interface Props {
  className?: string;
}

const getDarkOption = (): 'system' | 'dark' | 'light'  => {
  return (localStorage.getItem('theme') ?? 'system') as 'system' | 'dark' | 'light';
};

const setDarkOption = (option: 'system' | 'dark' | 'light') => {
  localStorage.setItem('theme', option);
  const sytemOption = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  switch (option === 'system' ? sytemOption : option) {
  case 'dark':
    document.documentElement.classList.add('dark');
    break;
  case 'light':
    document.documentElement.classList.remove('dark');
    break;
  default:
    console.error(`WTF! Option was ${option}`);
    break;
  }
};

export const setDarkMode = () => {
  const option = getDarkOption();
  const sytemOption = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  switch (option === 'system' ? sytemOption : option) {
  case 'dark':
    document.documentElement.classList.add('dark');
    break;
  case 'light':
    document.documentElement.classList.remove('dark');
    break;
  default:
    console.error(`WTF! Option was ${option}`);
    break;
  }
};

type extTypes = 'v mkv' | 'v mp4' | 'v avi' | 'v webm' | 'a mp3' | 'a m4a' | 'a ogg' | 'a wav' | 'custom';

const Settings = ({className}: Props) => {
  const [curVersion, setCurrentVersion] = useState(window.localStorage.getItem('curVer') ?? 'Unknown');
  const {curExt, updateExt, curCustomExt, updateCurCustomExt, curConcurrentDownload, updateConcurrentDownload, curAudioEncoder, curVideoEncoder, updateAudioEncoder, updateVideoEncoder } = useContext(InfoQueueContext);

  const refreshVersion = async () => {
    await getCurrentVersion();
    setCurrentVersion(window.localStorage.getItem('curVer') ?? 'Unknown');
  };

  useEffect(() => {
    window.require('electron').ipcRenderer.on('select-dirs-result', (event, message) => {
      setPath(message[0]);
      console.log(message[0]);
    });
    window.require('electron').ipcRenderer.on('open-cookies-result', (event, { filePaths }) => {
      console.log(filePaths)
      const cookies = fs.readFileSync(filePaths[0]).toString();
      const ytdlCoreCookie = getYoutubeCookies(cookies);
      console.log(ytdlCoreCookie)
      window.localStorage.setItem('ytdl-cookie', ytdlCoreCookie);
      fs.writeFileSync(join(downloadPath, 'cookies.txt'), cookies)
    });
  }, []);

  const check = async () => {
    window.localStorage.setItem('ytdl-lastcheck', '0');
    window.localStorage.setItem('webdl-lastcheck', '0');
    console.log(await CheckUpdates());
  };

  const removeCookies = () => {
    fs.rmSync(join(downloadPath, 'cookies.txt'))
    window.localStorage.setItem('ytdl-cookie', "");
  }

  return (
    <div className={`${className ?? ''} absolute inset-x-1/4 inset-y-24 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col items-start gap-4 text-black dark:text-white text-base font-medium overflow-y-scroll`}>
      <h1 className="text-xl font-bold">{'Appearence:'}</h1>
      <span>
        <label htmlFor='dark' className="mr-4">Dark mode: </label>
        <select name='dark' id='dark' defaultValue={getDarkOption()} onChange={(e) => {setDarkOption(e.target.value as 'system' | 'dark' | 'light');}} className="px-2 py-1 transition-colors bg-gray-100 rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-600">
          <option value='system'>Follow system</option>
          <option value='dark'>Dark</option>
          <option value='light'>Light</option>
        </select>
      </span>
      <div className="w-full h-0 border-b border-gray-200 dark:border-gray-700"/>
      <h1 className="text-xl font-bold">{'WebDL Specific:'}</h1>
      <span>
        <label htmlFor='browse' className="mr-4">Change save directory: </label>
        <button id='browse' className="px-2 py-1 transition-colors bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500 w-max dark:bg-gray-700 focus:outline-none" onClick={() => {
          window.require('electron').ipcRenderer.send('select-dirs');
        }}>
          Browse
        </button>
      </span>
      <span className="flex flex-row items-center justify-start w-full">
        <label htmlFor='port' className="mr-4">Change port: </label>
        <input onChange={(e) => {window.localStorage.setItem('port', e.target.value);}} defaultValue={port} placeholder="3003" type='number' className="w-20 px-2 py-1 mx-4 my-2 transition-colors bg-gray-100 rounded-md shadow-sm sm:my-0 hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500 dark:bg-gray-700 focus:outline-none"/>
        <div className="grid ml-auto transition-transform duration-300 ease-in-out transform scale-100 rotate-0 place-content-center hover:rotate-180 active:scale-90" onClick={() => {window.require('electron').ipcRenderer.send('reload')}}>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18px" height="18px" viewBox="0 0 12 10" className="h-full stroke-current text-dark dark:text-white w-max">
            <polyline fill="none" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="2" points="0.5,1 0.5,4 3.5,4 "/>
            <polyline fill="none" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="2" points="11.5,9 11.5,6 8.5,6 "/>
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="2" d="M10.24,3.5C9.42,1.16,6.84-0.07,4.5,0.76C3.87,0.98,3.29,1.35,2.82,1.82L0.5,4 M11.5,6L9.18,8.18
              c-1.76,1.76-4.61,1.76-6.36,0C2.34,7.71,1.98,7.13,1.75,6.5"/>
          </svg>
        </div>
        {/* <button onClick={selectPort} id='port' className="px-2 py-1 transition-colors bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500 w-max dark:bg-gray-700 focus:outline-none">
          Change
        </button> */}
      </span>
      <span>
        <label htmlFor='update' className="mr-4">Check for updates: </label>
        <button onClick={check} id='update' className="px-2 py-1 transition-colors bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500 w-max dark:bg-gray-700 focus:outline-none">
          Check
        </button>
      </span>
      <div className="w-full h-0 border-b border-gray-200 dark:border-gray-700"/>
      <h1 className="text-xl font-bold">{'Video options:'}</h1>
      <span>
        <label htmlFor='file' className="mr-4">Filetype: </label>
        <select name='file' id='file' defaultValue={curExt} onChange={(e) => {updateExt(e.target.value as extTypes);}} className="px-2 py-1 transition-colors bg-gray-100 rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-600">
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
      {(curExt === 'custom') &&
        <span className="flex flex-row flex-wrap items-center justify-start">
          <label htmlFor='customExt' className="mr-4">Type: </label>
          <select name='vid' id='vid' className="px-2 py-1 transition-colors bg-gray-100 rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-600" defaultValue={(curCustomExt ?? 'v').split(' ')[0]}
            onChange={(val: React.ChangeEvent<HTMLSelectElement>) => {
              const extension = val.target.parentNode?.querySelector('input')?.value;
              const type = val.target.value;
              updateCurCustomExt(`${type} ${extension}`);
            }}>
            <option value='v'>Video</option>
            <option value='a'>Audio</option>
          </select>
          <input defaultValue={(curCustomExt ?? 'v').split(' ')[1]} placeholder="mkv" type="text" maxLength={5} max={5} id='customExt' className="w-20 px-2 py-1 mx-4 my-2 transition-colors bg-gray-100 rounded-md shadow-sm sm:my-0 hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500 dark:bg-gray-700 focus:outline-none" onChange={(val: React.ChangeEvent<HTMLInputElement>) => {
            const type = val.target.parentNode?.querySelector('select')?.value;
            const extension = val.target.value;
            updateCurCustomExt(`${type} ${extension}`);
          }}/>
        </span>
      }
      <div className="w-full h-0 border-b border-gray-200 dark:border-gray-700"/>
      <h1 className="text-xl font-bold">{'Experimental:'}</h1>
      <span>
        <label htmlFor='update' className="mr-4">Concurrent downloads: </label>
        <input placeholder="1" type="number" min={1} defaultValue={curConcurrentDownload ?? 1} max={32} id='customExt' className="px-2 py-1 mx-1 transition-colors bg-gray-100 rounded-md shadow-sm appearance-none hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500 w-max dark:bg-gray-700 focus:outline-none"
          onChange={(val: React.ChangeEvent<HTMLInputElement>) => {
            if (val.target.valueAsNumber < 1) val.target.value = '1';
            updateConcurrentDownload(val.target.valueAsNumber);
          }}/>
      </span>
      <span className="flex flex-row items-center justify-start w-full">
        <label htmlFor='update' className="mr-4">Add cookies: </label>
        <button onClick={() => window.require('electron').ipcRenderer.send('open-cookies')} id='update' className="px-2 py-1 transition-colors bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500 w-max dark:bg-gray-700 focus:outline-none">
          Upload
        </button>
        <div aria-label="Delete cookies" className="grid ml-auto place-content-center dark:after:content-[attr(aria-label)] after:content-[attr(aria-label)] hover:after:content-[attr(aria-label)] relative after:absolute after:text-xl after:bottom-[150%] after:bg-gray-300 dark:after:bg-gray-600 after:shadow-md after:w-max after:h-max after:right-0 after:mx-auto after:px-2 after:py-1 after:rounded-md after:text-base cursor-default after:opacity-0 after:scale-0 after:transform hover:after:opacity-100 hover:after:scale-100 after:origin-bottom-right after:transition-all after:delay-[0ms] hover:after:delay-500 after:z-10" onClick={removeCookies}>
          <CgClose className="ml-auto text-black transition-all duration-200 transform scale-125 rotate-0 cursor-pointer fill-current hover:scale-150 active:scale-110 hover:rotate-90 hover:text-gray-900 dark:text-white dark:hover:text-gray-200 hover:text-red-500 dark:hover:text-red-500 active:text-red-600 dark:active:text-red-600" />
        </div>
      </span>
      <div className="w-full h-0 border-b border-gray-200 dark:border-gray-700"/>
      <h1 className="text-xl font-bold">{'Encoder settings:'}</h1>
      <span className="flex flex-col gap-4">
        <span>
          <label htmlFor='update' className="mr-4">Video Encoder: </label>
          <select name='vid' id='vid' className="px-2 py-1 transition-colors bg-gray-100 rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-600" defaultValue={curVideoEncoder} onChange={e => updateVideoEncoder(e.target.value as "copy" | "libx265" | "libx264" | "mpeg4")}>
            <option value='copy'>Copy encoding</option>
            <option value='libx265'>H.265</option>
            <option value='libx264'>H.264</option>
            <option value='mpeg4'>MPEG-4</option>
          </select>
        </span>
        <span>
          <label htmlFor='update' className="mr-4">Audio Encoder: </label>
          <select name='vid' id='vid' className="px-2 py-1 transition-colors bg-gray-100 rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-600" defaultValue={curAudioEncoder} onChange={e => updateAudioEncoder(e.target.value as "copy" | "aac" | "libmp3lame" | "wmav2")}>
            <option value='copy'>Copy encoding</option>
            <option value='aac'>AAC</option>
            <option value='libmp3lame'>MP3</option>
            <option value='wmav2'>WMA</option>
          </select>
        </span>
      </span>
      <div className="w-full h-0 border-b border-gray-200 dark:border-gray-700"/>
      <h1 className="text-xl font-bold">{'About:'}</h1>
      <span className="flex flex-row w-full gap-4">
        <h4>Version: </h4>
        <p className="text-base font-medium text-gray-700 dark:text-gray-400">{curVersion}</p>
        <div className="grid ml-auto transition-transform duration-300 ease-in-out transform scale-100 rotate-0 place-content-center hover:rotate-180 active:scale-90" onClick={refreshVersion}>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18px" height="18px" viewBox="0 0 12 10" className="h-full stroke-current text-dark dark:text-white w-max">
            <polyline fill="none" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="2" points="0.5,1 0.5,4 3.5,4 "/>
            <polyline fill="none" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="2" points="11.5,9 11.5,6 8.5,6 "/>
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="2" d="M10.24,3.5C9.42,1.16,6.84-0.07,4.5,0.76C3.87,0.98,3.29,1.35,2.82,1.82L0.5,4 M11.5,6L9.18,8.18
              c-1.76,1.76-4.61,1.76-6.36,0C2.34,7.71,1.98,7.13,1.75,6.5"/>
          </svg>
        </div>
      </span>
    </div>
  );
};

export default Settings;
