import { useContext, useEffect, useRef, useState } from 'react';
import { InfoQueueContext } from '../contexts/InfoQueueContext';
import { path, setPath } from '../Functions/getPath';
import { port } from '../Functions/server/server';
import { CheckUpdates } from '../Functions/update';

interface Props {
  className?: string;
}

const getDarkOption = (): 'system' | 'dark' | 'light'  => {
  return (localStorage.getItem('theme') ?? 'system') as 'system' | 'dark' | 'light'
}

const selectPort = () => {
  let temp_port: string | null = prompt('Select the default port', port);
  if (!(temp_port && /^[0-9]+$/.test(temp_port))) {
    alert('Port has to be a whole number');
  } else {
    window.localStorage.setItem('port', temp_port);
    chrome.runtime.reload();
  }
};

const setDarkOption = (option: 'system' | 'dark' | 'light') => {
  localStorage.setItem('theme', option)
  const sytemOption = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  switch (option === 'system' ? sytemOption : option) {
    case 'dark':
      document.documentElement.classList.add('dark');
      break;
    case 'light':
      document.documentElement.classList.remove('dark')
      break;
    default:
      console.error(`WTF! Option was ${option}`)
      break;
  }
}

export const setDarkMode = () => {
  const option = getDarkOption();
  const sytemOption = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  switch (option === 'system' ? sytemOption : option) {
    case 'dark':
      document.documentElement.classList.add('dark');
      break;
    case 'light':
      document.documentElement.classList.remove('dark')
      break;
    default:
      console.error(`WTF! Option was ${option}`)
      break;
  }
}

type extTypes = "v mkv" | "v mp4" | "v avi" | "v webm" | "a mp3" | "a m4a" | "a ogg" | "a wav" | "custom";

const Settings = ({className}: Props) => {
  // const [customExt, setCustomExt] = useState("");
  const [curPath, setCurPath] = useState(path);
  const {curExt, updateExt, curCustomExt, updateCurCustomExt, curConcurrentDownload, updateConcurrentDownload } = useContext(InfoQueueContext);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      //@ts-ignore
      inputRef.current.nwdirectory = true;
    }
  }, []);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      //@ts-ignore
      inputRef.current.nwworkingdir = curPath;
    }
  }, [curPath]);

  const check = async () => {
    window.localStorage.setItem('ytdl-lastcheck', '0');
    window.localStorage.setItem('webdl-lastcheck', '0');
    console.log(await CheckUpdates());
  };

  return (
    <div className={`${className ?? ''} absolute inset-x-1/4 inset-y-24 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col items-start gap-4 text-black dark:text-white text-base font-medium overflow-y-scroll`}>
      <h1 className="text-xl font-bold">{"Appearence:"}</h1>
      <span>
        <label htmlFor='dark' className="mr-4">Dark mode: </label>
        <select name='dark' id='dark' defaultValue={getDarkOption()} onChange={(e) => {setDarkOption(e.target.value as 'system' | 'dark' | 'light')}} className="px-2 py-1 bg-gray-100 rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none hover:bg-gray-200  dark:hover:bg-gray-600 transition-colors">
          <option value='system'>Follow system</option>
          <option value='dark'>Dark</option>
          <option value='light'>Light</option>
        </select>
      </span>
      <div className="h-0 border-b border-gray-200 dark:border-gray-700 w-full"/>
      <h1 className="text-xl font-bold">{"WebDL Specific:"}</h1>
      <span>
        <label htmlFor='browse' className="mr-4">Change save directory: </label>
        <button id='browse' className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500  rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none px-2 py-1 transition-colors" onClick={() => { inputRef.current?.click(); }}>
          Browse
        </button>
        <input type='file' className="hidden" onChange={(e) => { setPath(e.target.value); setCurPath(e.target.value); }} ref={inputRef}/>
      </span>
      <span>
        <label htmlFor='port' className="mr-4">Change port: </label>
        <button onClick={selectPort} id='port' className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500  rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none px-2 py-1 transition-colors">
          Change
        </button>
      </span>
      <span>
        <label htmlFor='update' className="mr-4">Check for updates: </label>
        <button onClick={check} id='update' className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500  rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none px-2 py-1 transition-colors">
          Check
        </button>
      </span>
      <div className="h-0 border-b border-gray-200 dark:border-gray-700 w-full"/>
      <h1 className="text-xl font-bold">{"Video options:"}</h1>
      <span>
        <label htmlFor='file' className="mr-4">Filetype: </label>
        <select name='file' id='file' defaultValue={curExt} onChange={(e) => {updateExt(e.target.value as extTypes)}} className="px-2 py-1 bg-gray-100 rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none hover:bg-gray-200  dark:hover:bg-gray-600 transition-colors">
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
      {(curExt === "custom") &&
        <span className="flex flex-row flex-wrap justify-start items-center">
          <label htmlFor='customExt' className="mr-4">Type: </label>
          <select name='vid' id='vid' className="px-2 py-1 bg-gray-100 rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none hover:bg-gray-200  dark:hover:bg-gray-600 transition-colors" defaultValue={(curCustomExt ?? 'v').split(' ')[0]}
                  onChange={(val: React.ChangeEvent<HTMLSelectElement>) => {
                    const extension = val.target.parentNode?.querySelector('input')?.value;
                    const type = val.target.value;
                    updateCurCustomExt(`${type} ${extension}`);
                  }}>
            <option value='v'>Video</option>
            <option value='a'>Audio</option>
          </select>
          <input defaultValue={(curCustomExt ?? 'v').split(' ')[1]} placeholder="mkv" type="text" maxLength={5} max={5} id='customExt' className="mx-4 sm:my-0 my-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500 rounded-md shadow-sm w-20 dark:bg-gray-700 focus:outline-none px-2 py-1 transition-colors" onChange={(val: React.ChangeEvent<HTMLInputElement>) => {
                    const type = val.target.parentNode?.querySelector('select')?.value;
                    const extension = val.target.value;
                    updateCurCustomExt(`${type} ${extension}`);
                  }}/>
        </span>
      }
      <div className="h-0 border-b border-gray-200 dark:border-gray-700 w-full"/>
      <h1 className="text-xl font-bold">{"Experimental:"}</h1>
      <span>
        <label htmlFor='update' className="mr-4">Concurrent downloads: </label>
        <input placeholder="1" type="number" min={1} defaultValue={curConcurrentDownload ?? 1} max={32} id='customExt' className="mx-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500  rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none px-2 py-1 transition-colors appearance-none"
        onChange={(val: React.ChangeEvent<HTMLInputElement>) => {
                    if (val.target.valueAsNumber < 1) val.target.value = '1';
                    updateConcurrentDownload(val.target.valueAsNumber);
                  }}/>
      </span>
    </div>
  )
}

export default Settings;
