import React, { FC, useEffect, useState } from 'react';
import { Outer, QueueContainer, ButtonsContainer } from './style';
import Item, { Props } from './Item';
import { ID } from '../../logic/id';
import { downloadVideo } from '../../logic/youtube-dl-wrap/downloadVideo';

export let updateQueue: React.Dispatch<React.SetStateAction<Props[]>>;
export let outQueue: Array<Props>;

const Queue: FC = () => {
  const emptyQueue: Array<Props> = [];
  const [queue, setQueue] = useState(emptyQueue);

  useEffect(() => {
    updateQueue = setQueue;
  }, []);

  useEffect(() => {
    outQueue = queue;
  }, [queue]);

  const downloadQueue = () => {
    updateQueue(outQueue);
    const vid = outQueue[0];
    const format = vid.quality.get(vid.curQual);
    let skipped = 0;
    const callback = () => {
      const removedQueue = [...outQueue];
      removedQueue.splice(skipped, 1);
      setQueue(removedQueue);
      let tryAgain = true;
      while (tryAgain) {
        if (removedQueue.length > skipped) {
          const vid = removedQueue[skipped];
          if (vid.download) tryAgain = false;
          if (tryAgain) skipped++;
        } else {
          tryAgain = false;
        }
      }

      if (removedQueue.length > skipped) {
        const vid = removedQueue[skipped];
        const format = vid.quality.get(vid.curQual);
        downloadVideo(vid.id, callback, vid.title, vid.merge, format);
      }
    };
    downloadVideo(vid.id, callback, vid.title, vid.merge, format);
  };

  return (
    <Outer>
      <QueueContainer>
        {queue.map((val, i) => (
          <Item
            title={val.title}
            thumbnail={val.thumbnail}
            id={val.id}
            i={i}
            info={val.info}
            quality={val.quality}
            key={ID()}
            download={val.download}
            merge={val.merge}
            curQual={val.curQual}
          />
        ))}
      </QueueContainer>
      <ButtonsContainer>
        <button onClick={downloadQueue}>Download Videos</button>
        <button>Clear queue</button>
        <button>Input url</button>
        <button>Search Youtube</button>
      </ButtonsContainer>
    </Outer>
  );
};

export default Queue;
