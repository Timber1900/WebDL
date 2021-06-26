import { useState } from 'react';
import { CgClose } from 'react-icons/all'

interface Props {
  className?: string;
}

interface SearchItemProps {
  title: string,
  url: string
}

const Search = ({className}: Props) => {
  const [val, setVal] = useState("");
  const items: SearchItemProps[] = [{title: 'I got to meet jschlatt and amourah', url: 'https://www.youtube.com/embed/ILxST69xTpg'}]

  return (
    <div className={`${className ?? ''} flex flex-col items-center justify-start absolute inset-x-12 inset-y-12 p-4 gap-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-black dark:text-white text-base font-medium`}>
      <span className="relative w-full p-4 group">
        <input value={val} onChange={(e) => {setVal(e.target.value)}} placeholder="Search youtube" maxLength={64} type='text' className="w-full px-4 py-2 bg-gray-200 rounded-md shadow-md dark:bg-gray-700 focus:outline-none"/>
        <div className={`${val === "" ? 'opacity-0' : 'opacity-100'} absolute top-0 bottom-0 grid transition-opacity right-6 place-content-center duration-200`}>
          <CgClose onClick={() => {setVal("")}} className="text-red-600 transition-all transform scale-125 fill-current active:scale-110 dark:text-red-600 hover:text-red-700 dark:hover:text-red-500 hover:scale-150"/>
        </div>
      </span>
      <div className="flex flex-col items-center justify-start w-full h-full overflow-y-scroll">
        {items.map(({title, url}, i) => <SearchItem title={title} url={url} key={i}/>)}
      </div>
    </div>
  )
}

const SearchItem = ({title, url}: SearchItemProps) => {
  return (
    <div className="flex flex-row items-center justify-start w-full p-2">
      <div className="rounded-md">
        <iframe title="video" src={url} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={false} className="m-4 rounded-md shadow-md w-max"></iframe>
      </div>
      <div className="flex flex-col items-center justify-start w-full gap-4 p-4 truncate rounded-md" >
        <h1 className="w-full text-xl font-bold text-left text-black truncate dark:text-white">{title}</h1>
        <button className="px-2 py-1 transition-colors bg-gray-100 rounded-md dark:bg-gray-700 hover:bg-gray-200 active:bg-gray-300 dark:active:bg-gray-500 dark:hover:bg-gray-600 focus:outline-none">Add to queue</button>
      </div>
    </div>
  )
}

export default Search;
