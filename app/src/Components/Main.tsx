import * as React from 'react';
import Item from './Item';
import { InfoQueueContext } from '../contexts/InfoQueueContext';
import { useContext } from 'react';

const Main = () => {
  const { curQueue } = useContext(InfoQueueContext);

  return(
    <div className="flex flex-col items-center justify-start overflow-y-scroll bg-gray-200 dark:bg-gray-700">
      {curQueue.map(({ clips, curQual, download, duration, ext, id, info, merge, quality, show, thumbnail, title}, i) => (
        <Item quality={quality} key={i} clips={clips} curQual={curQual} download={download} duration={duration} ext={ext} i={i} id={id} info={info} merge={merge} show={show} thumbnail={thumbnail} title={title} />
      ))}

    </div>
  );
};

export default Main;

