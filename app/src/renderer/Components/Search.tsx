import * as React from 'react';
import { useEffect, useState } from 'react';
import { CgClose } from 'react-icons/all';
import ytsr from 'ytsr';
import { addToQueue } from '../Functions/server/addToQueue';
interface Props {
  className?: string;
}

const Search = ({className}: Props) => {
  const [val, setVal] = useState('');
  const [items, setItems] = useState<(ytsr.Video | ytsr.Playlist)[]>([]);
  const [currSearch, setCurSearch] = useState<ytsr.Result | ytsr.ContinueResult>();
  const [loadState, setLoadState] = useState<'Loading...' | 'Load more'>('Load more');

  useEffect(() => {
    if(val === '') {
      setItems([]);
      setCurSearch(undefined);
    }
  }, [val]);

  const searchVideo = async () => {
    const search = await ytsr(val, { pages: 1 });
    setLoadState('Loading...');
    await setSearch(search, 'replace');
    setLoadState('Load more');
  };

  const nextPage = async () => {
    if (currSearch?.continuation) {
      setLoadState('Loading...');
      const search = await await ytsr.continueReq(currSearch.continuation);
      setCurSearch(search);
      await setSearch(search, 'add');
      setLoadState('Load more');
    }
  };

  const setSearch = (search: ytsr.Result | ytsr.ContinueResult, type: 'add' | 'replace') => {
    setCurSearch(search);
    const videos: ytsr.Item[] = search.items.filter((e) => e.type === 'video' || e.type === 'playlist');
    const vids: (ytsr.Video | ytsr.Playlist)[] = type === 'add' ? items : [];
    for (const vid of videos) {
      if (vid.type === 'video') {
        vids.push(vid);
      } else if (vid.type === 'playlist') {
        vids.push(vid);
      }
    }
    setItems(vids);
    return Promise.resolve();
  };

  return (
    <div className={`${className ?? ''} flex flex-col items-center justify-start absolute inset-x-12 inset-y-12 p-4 gap-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-black dark:text-white text-base font-medium`}>
      <span className="relative w-full p-4 group">
        <input value={val} onChange={(e) => {setVal(e.target.value);}} placeholder="Search youtube" maxLength={64} type='text' className="w-full px-4 py-2 bg-gray-200 rounded-md shadow-md dark:bg-gray-700 focus:outline-none" onKeyPress={(e) => { if (e.key === 'Enter') searchVideo(); }}/>
        <div className={`${val === '' ? 'opacity-0' : 'opacity-100'} absolute top-0 bottom-0 grid transition-opacity right-6 place-content-center duration-200`}>
          <CgClose onClick={() => {setVal(''); setItems([]); setCurSearch(undefined);}} className="text-red-600 transition-all transform scale-125 fill-current active:scale-110 dark:text-red-600 hover:text-red-700 dark:hover:text-red-500 hover:scale-150"/>
        </div>
      </span>
      <div className="flex flex-col items-center justify-start w-full h-full gap-2 overflow-y-scroll">
        {items.map((item, i) => {
          if(item.type === 'video') {
            const {author, badges, bestThumbnail, description, duration, id, isLive, isUpcoming, thumbnails, title, type, upcoming, uploadedAt, url, views} = item;
            return(
              <SearchVideo author={author} badges={badges} bestThumbnail={bestThumbnail} description={description} duration={duration} id={id} isLive={isLive} isUpcoming={isUpcoming} thumbnails={thumbnails} title={title} type={type} upcoming={upcoming} uploadedAt={uploadedAt} url={url} views={views} key={i}/>
            );
          } else {
            const {firstVideo, length, owner, playlistID, publishedAt, title, type, url} = item;
            return(
              <SearchPlaylist firstVideo={firstVideo} length={length} owner={owner} playlistID={playlistID} publishedAt={publishedAt} title={title} type={type} url={url} key={i}/>
            );
          }
        })}
        {(currSearch) && <button disabled={loadState === 'Loading...'} className="px-4 py-2 transition-colors bg-gray-200 rounded-lg dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-500 focus:outline-none" onClick={nextPage}>
          {loadState}
        </button>}
      </div>
    </div>
  );
};

const SearchVideo = ({url, id, title, views, author}: ytsr.Video ) => {
  return (
    <div className="flex flex-row items-center justify-start w-full p-2">
      <div className="rounded-md">
        <iframe title="video" src={`https://www.youtube.com/embed/${id}?controls=0`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={false} className="m-4 rounded-md shadow-md w-max"></iframe>
      </div>
      <div className="flex flex-col items-center justify-start w-full gap-4 p-4 truncate rounded-md" >
        <h1 className="w-full text-xl font-semibold text-center text-black truncate dark:text-white">{title}</h1>
        <span className="flex flex-row flex-wrap items-center justify-center w-full gap-4">
          <p className="text-center truncate w-max whitespace-nowrap">Author: <code className="dark:bg-gray-700 bg-gray-100 px-1 py-0.5 rounded-lg">{author?.name}</code></p>
          <p className="text-center truncate w-max">Views: <code className="dark:bg-gray-700 bg-gray-100 px-1 py-0.5 rounded-lg">{views?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</code></p>
        </span>
        <button className="px-2 py-1 transition-colors bg-gray-100 rounded-md dark:bg-gray-700 hover:bg-gray-200 active:bg-gray-300 dark:active:bg-gray-500 dark:hover:bg-gray-600 focus:outline-none" onClick={() => {addToQueue(url);}}>Add to queue</button>
      </div>
    </div>
  );
};

const SearchPlaylist = ({title, url, owner, length, firstVideo }: ytsr.Playlist ) => {
  return (
    <div className="flex flex-row items-center justify-start w-full p-2">
      <div className="rounded-md">
        <iframe title="video" src={`https://www.youtube.com/embed/${firstVideo?.id}?controls=0`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={false} className="m-4 rounded-md shadow-md w-max"></iframe>
      </div>
      <div className="flex flex-col items-center justify-start w-full gap-4 p-4 truncate rounded-md" >
        <h1 className="w-full text-xl font-semibold text-center text-black truncate dark:text-white"><span className="font-bold">[Playlist]</span> {title}</h1>
        <span className="flex flex-row flex-wrap items-center justify-center w-full gap-4">
          <p className="text-center truncate w-max whitespace-nowrap">Author: <code className="dark:bg-gray-700 bg-gray-100 px-1 py-0.5 rounded-lg">{owner?.name}</code></p>
          <p className="text-center truncate w-max">Videos: <code className="dark:bg-gray-700 bg-gray-100 px-1 py-0.5 rounded-lg">{length?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</code></p>
        </span>
        <button className="px-2 py-1 transition-colors bg-gray-100 rounded-md dark:bg-gray-700 hover:bg-gray-200 active:bg-gray-300 dark:active:bg-gray-500 dark:hover:bg-gray-600 focus:outline-none" onClick={() => {addToQueue(url);}}>Add to queue</button>
      </div>
    </div>
  );
};
export default Search;
