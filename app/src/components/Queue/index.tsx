import React, { FC, useContext, useState } from 'react';
import { Outer, QueueContainer, ButtonsContainer } from './style';
import Item from './Item';
import { ID } from '../../logic/id';
import { downloadVideo } from '../../logic/youtube-dl-wrap/downloadVideo';
import { downloadAudio } from '../../logic/youtube-dl-wrap/downloadAudio';
import { addToQueue } from '../../logic/server/addToQueue';
import { InfoQueueContext } from '../../contexts/InfoQueueContext';

const Queue: FC = () => {
  const [disable, setDisable] = useState(false);
  const context = useContext(InfoQueueContext);
  const { curQueue, updateQueue, updateSearch } = context;

  const downloadQueue = () => {
    updateQueue(curQueue);

    let skipped = 0;
    const callback = () => {
      const removedQueue = [...curQueue];
      removedQueue.splice(skipped, 1);
      updateQueue(removedQueue);
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
        console.log(vid);
        const format = vid.quality.get(vid.curQual);
        if (Math.sign(parseInt(vid.ext)) === -1) {
          let ext: string = vid.ext === '-3' ? 'mkv' : vid.ext === '-2' ? 'mp4' : 'webm';
          downloadVideo(vid.id, callback, vid.title, vid.merge, format, ext, vid.clips, vid.duration, context);
        } else {
          let ext: string = vid.ext === '1' ? 'mp3' : 'm4a';
          downloadAudio(vid.id, callback, vid.title, ext, vid.clips, vid.duration, context);
        }
      } else {
        setDisable(false);
      }
    };

    let tryAgain = true;
    while (tryAgain) {
      if (curQueue.length > skipped) {
        const vid = curQueue[skipped];
        if (vid.download) tryAgain = false;
        if (tryAgain) skipped++;
      } else {
        tryAgain = false;
      }
    }
    if (curQueue.length > skipped) {
      const vid = curQueue[skipped];
      const format = vid.quality.get(vid.curQual);
      setDisable(true);
      const [type, extension] = vid.ext.split(' ');
      if (type === 'v') {
        downloadVideo(vid.id, callback, vid.title, vid.merge, format, extension, vid.clips, vid.duration, context);
      } else {
        downloadAudio(vid.id, callback, vid.title, extension, vid.clips, vid.duration, context);
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
    updateSearch(true);
  };

  return (
    <Outer>
      <QueueContainer>
        {curQueue.map((val, i) => (
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
        <button onClick={() => updateQueue([])} disabled={disable}>
          Clear queue
        </button>
        <button onClick={inputUrl}>Input url</button>
        <button onClick={search}>Search Youtube</button>
      </ButtonsContainer>
    </Outer>
  );
};

export default Queue;
