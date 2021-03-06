import React, { FC, useEffect, useState } from 'react';
import { Outer, QueueContainer, ButtonsContainer } from './style';
import Item, { Props } from './Item';
import { ID } from '../../logic/id';
import { downloadVideo } from '../../logic/youtube-dl-wrap/downloadVideo';
import { downloadAudio } from '../../logic/youtube-dl-wrap/downloadAudio';
import { addToQueue } from '../../logic/server/addToQueue';
import { changeSearch, searchIsUp } from '../Search';

export let updateQueue: React.Dispatch<React.SetStateAction<Props[]>>;
export let outQueue: Array<Props>;

const Queue: FC = () => {
  const emptyQueue: Array<Props> = [];
  const [queue, setQueue] = useState(emptyQueue);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    updateQueue = setQueue;
  }, []);

  useEffect(() => {
    outQueue = queue;
  }, [queue]);

  const downloadQueue = () => {
    updateQueue(outQueue);

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
        if (Math.sign(parseInt(vid.ext)) === -1) {
          let ext: string = vid.ext === '-3' ? 'mkv' : vid.ext === '-2' ? 'mp4' : 'webm';
          downloadVideo(vid.id, callback, vid.title, vid.merge, format, ext, vid.clips, vid.duration);
        } else {
          let ext: string = vid.ext === '1' ? 'mp3' : 'm4a';
          downloadAudio(vid.id, callback, vid.title, ext, vid.clips, vid.duration);
        }
      } else {
        setDisable(false);
      }
    };

    let tryAgain = true;
    while (tryAgain) {
      if (outQueue.length > skipped) {
        const vid = outQueue[skipped];
        if (vid.download) tryAgain = false;
        if (tryAgain) skipped++;
      } else {
        tryAgain = false;
      }
    }
    if (outQueue.length > skipped) {
      const vid = outQueue[skipped];
      const format = vid.quality.get(vid.curQual);
      setDisable(true);
      const [type, extension] = vid.ext.split(' ');

      if (type === 'v') {
        downloadVideo(vid.id, callback, vid.title, vid.merge, format, extension, vid.clips, vid.duration);
      } else {
        downloadAudio(vid.id, callback, vid.title, extension, vid.clips, vid.duration);
      }
    }
  };

  const inputUrl = () => {
    // eslint-disable-next-line quotes
    const url: string | null = prompt("What's the video url?");
    if (url) {
      addToQueue(url);
    }
  };

  const search = () => {
    changeSearch(!searchIsUp);
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
            ext={val.ext}
            duration={val.duration}
            clips={val.clips}
          />
        ))}
      </QueueContainer>
      <ButtonsContainer>
        <button onClick={downloadQueue} disabled={disable}>
          Download Videos
        </button>
        <button onClick={() => setQueue([])} disabled={disable}>
          Clear queue
        </button>
        <button onClick={inputUrl}>Input url</button>
        <button onClick={search}>Search Youtube</button>
      </ButtonsContainer>
    </Outer>
  );
};

export default Queue;
