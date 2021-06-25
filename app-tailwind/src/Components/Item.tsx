import { CgRename, MdContentCut, CgSoftwareDownload, CgClose } from 'react-icons/all'

interface Props {
  i: number;
  id: string;
  thumbnail: string;
  info: any;
  quality?: Map<string, any>;
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

interface InnerProps {
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

const Item = ({ id, merge, clips, i, duration, title, ext, thumbnail}: Props) => {
  const seconds = duration % 60;
  const minutes = ((duration - seconds) / 60) % 60;
  const hours = (((duration - seconds) / 60) - minutes) / 60;


  return(
    <div className="grid w-auto h-auto max-w-4xl grid-cols-5 gap-2 p-4 m-4 bg-white rounded-md shadow-md max-h-56 min-h-48 dark:bg-gray-800 place-items-center">
      <div className="h-auto col-span-2 rounded-md shadow-sm max-h-56">
        <img width="300" height="166" src={thumbnail} alt={title} className="rounded-md w-min"/>
      </div>
      <div className="grid w-full h-full grid-cols-10 col-span-3 grid-rows-3 gap-2">
        <div className="grid col-span-9 col-start-1 row-span-1 row-start-1 truncate place-items-center">
          {title}
        </div>
        <div className="grid grid-cols-2 col-span-9 col-start-1 row-span-1 row-start-2 gap-2 place-items-center">
          <span className="flex items-center justify-center w-full h-full gap-2 text-base font-medium flex-rows">
            <label htmlFor='qual'>Quality: </label>
            <select id='qual' className="bg-gray-100 rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none">
              <option value='test'>Test</option>
            </select>
          </span>
          <span className="flex items-center justify-center w-full h-full gap-2 text-base font-medium flex-rows">
            <label htmlFor='qual'>Extension: </label>
            <select id='qual' className="bg-gray-100 rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none">
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
        <div className="grid grid-cols-2 col-span-9 col-start-1 row-span-1 row-start-3 gap-2 place-items-center">
          <span className="text-base font-medium">
            <p>Duration: <code className="dark:bg-gray-700 bg-gray-100 px-1 py-0.5 rounded-lg">{hours > 0 ? `${hours}:${minutes === 0 ? '00' : minutes}:${seconds === 0 ? '00' : seconds}` : `${minutes === 0 ? '00' : minutes}:${seconds === 0 ? '00' : seconds}`}</code></p>
          </span>
          <span className="text-base font-medium">
            <p>Size: <code className="dark:bg-gray-700 bg-gray-100 px-1 py-0.5 rounded-lg">Temp</code></p>
          </span>
        </div>
        <div className="grid grid-cols-1 col-span-1 col-start-10 grid-rows-4 row-span-3 row-start-1 gap-1 border-l border-gray-200 dark:border-gray-700 place-items-center">
          <CgRename className="text-black transition-all transform scale-100 fill-current dark:active:text-gray-300 active:scale-95 active:text-gray-700 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:scale-125"/>
          <MdContentCut className="text-black transition-all transform scale-100 fill-current dark:active:text-gray-300 active:scale-95 active:text-gray-700 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:scale-125"/>
          <CgSoftwareDownload className="text-black transition-all transform scale-100 fill-current dark:active:text-gray-300 active:scale-95 active:text-gray-700 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:scale-125"/>
          <CgClose className="text-black transition-all transform scale-100 rotate-0 fill-current active:text-red-600 active:scale-95 dark:active:text-red-600 dark:text-white hover:text-red-500 dark:hover:text-red-500 hover:rotate-90 hover:scale-125"/>
        </div>
      </div>
    </div>
  )
}

export default Item;
