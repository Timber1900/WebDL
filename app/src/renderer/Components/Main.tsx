import * as React from 'react';
import Item from './Item';
import { InfoQueueContext } from '../contexts/InfoQueueContext';
import { useContext, useState, useRef } from 'react';

const Main = () => {
  const { curQueue } = useContext(InfoQueueContext);
  const [maxRenderable, setMaxRenderable] = useState(20);
  const scrollRef = useRef<HTMLDivElement>(null)
  const fixManxRenderable = () => {
    const scrollPercentage = (scrollRef.current.scrollHeight - scrollRef.current.scrollTop - scrollRef.current.clientHeight) / scrollRef.current.scrollHeight;
    const hiddenVideos = scrollPercentage * maxRenderable;

    if(hiddenVideos > 20 && maxRenderable > 20) setMaxRenderable(maxRenderable - 20)
  }

  let counter = 0;

  return(
    <div ref={scrollRef} onScroll={fixManxRenderable} className="flex flex-col items-center justify-start overflow-y-scroll bg-gray-200 dark:bg-gray-700">
      {
        curQueue.map(({ clips, curQual, download, duration, ext, id, info, merge, quality, show, thumbnail, title, captions, open }, i) => {
          if(counter > maxRenderable) return
          if(show) counter++
          return(
            <Item open={open} captions={captions} quality={quality} key={i} clips={clips} curQual={curQual} download={download} duration={duration} ext={ext} i={i} id={id} info={info} merge={merge} show={show} thumbnail={thumbnail} title={title} />
            )
          }
      )}
      {curQueue.filter(val => val.show).length > maxRenderable &&
        <button  className="px-4 py-2 mb-2 transition-colors bg-gray-300 rounded-lg dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-800 active:bg-gray-400 dark:active:bg-gray-900 focus:outline-none" onClick={() => setMaxRenderable(maxRenderable + 20)}>
        Load More
      </button>}
    </div>
  );
};

export default Main;

