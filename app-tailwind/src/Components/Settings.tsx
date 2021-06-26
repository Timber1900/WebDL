import { useState } from 'react';

interface Props {
  className?: string;
}

const getDarkOption = (): 'system' | 'dark' | 'light'  => {
  return (localStorage.getItem('theme') ?? 'system') as 'system' | 'dark' | 'light'
}

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
  const [ext, setExt] = useState<extTypes>("v mkv");

  return (
    <div className={`${className ?? ''} absolute inset-x-1/4 inset-y-24 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col items-start gap-4 text-black dark:text-white text-base font-medium`}>
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
        <button id='browse' className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500  rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none px-2 py-1 transition-colors">
          Browse
        </button>
      </span>
      <span>
        <label htmlFor='port' className="mr-4">Change port: </label>
        <button id='port' className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500  rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none px-2 py-1 transition-colors">
          Change
        </button>
      </span>
      <span>
        <label htmlFor='update' className="mr-4">Check for updates: </label>
        <button id='update' className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500  rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none px-2 py-1 transition-colors">
          Check
        </button>
      </span>
      <div className="h-0 border-b border-gray-200 dark:border-gray-700 w-full"/>
      <h1 className="text-xl font-bold">{"Video options:"}</h1>
      <span>
        <label htmlFor='file' className="mr-4">Filetype: </label>
        <select name='file' id='file' defaultValue={ext} onChange={(e) => {setExt(e.target.value as extTypes)}} className="px-2 py-1 bg-gray-100 rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none hover:bg-gray-200  dark:hover:bg-gray-600 transition-colors">
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
      {(ext === "custom") &&
        <span>
          <label htmlFor='customExt' className="mr-4">Type: </label>
          <select name='vid' id='vid' defaultValue="v" className="px-2 py-1 bg-gray-100 rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none hover:bg-gray-200  dark:hover:bg-gray-600 transition-colors">
            <option value='v'>Video</option>
            <option value='a'>Audio</option>
          </select>
          <input placeholder="mkv" type="text" id='customExt' className="mx-4 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500  rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none px-2 py-1 transition-colors" />
        </span>
      }
      <div className="h-0 border-b border-gray-200 dark:border-gray-700 w-full"/>
      <h1 className="text-xl font-bold">{"Experimental:"}</h1>
      <span>
        <label htmlFor='update' className="mr-4">Concurrent downloads: </label>
        <input placeholder="1" type="number" min={1} defaultValue={1} max={32} id='customExt' className="mx-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-500  rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none px-2 py-1 transition-colors" />
      </span>
    </div>
  )
}

export default Settings;
