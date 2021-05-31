import React, { FC, useContext, useState } from 'react';
import { Outer, QueueContainer, ButtonsContainer } from './style';
import Item, { Props } from './Item';
import { ID } from 'logic/id';
import { downloadVideo } from 'logic/youtube-dl-wrap/downloadVideo';
import { downloadAudio } from 'logic/youtube-dl-wrap/downloadAudio';
import { addToQueue } from 'logic/server/addToQueue';
import { downloadOther } from 'logic/youtube-dl-wrap/downloadOther';
import { InfoQueueContext, progressProps } from 'contexts/InfoQueueContext';

const Queue: FC = () => {
  const [disable, setDisable] = useState(false);
  const [stop, setStop] = useState(false);
  const context = useContext(InfoQueueContext);
  const { curQueue, updateQueue, updateSearch, curCustomExt, curConcurrentDownload, updateQueuePrg } = context;

  const downloadQueue = () => {
    setDisable(true);
    const download_queue: (Props | null)[] = [];
    let cur_index = 0;

    while (download_queue.length < curConcurrentDownload) {
      if (cur_index >= curQueue.length) {
        break;
      } else if (curQueue[cur_index].download) {
        curQueue[cur_index].i = cur_index;
        download_queue.push(curQueue[cur_index]);
      }
      cur_index++;
    }

    const callback = (vid_index: number, queue_index: number) => {
      const temp = [...curQueue];
      temp[queue_index].show = false;
      updateQueue(temp);

      let found = false;
      while (!found) {
        if (cur_index >= curQueue.length) {
          download_queue[vid_index] = null;
          break;
        } else if (curQueue[cur_index].download && !download_queue.includes(curQueue[cur_index])) {
          curQueue[cur_index].i = cur_index;
          download_queue[vid_index] = curQueue[cur_index];
          found = true;
        }
        cur_index++;
      }

      if (found && !stop) download(vid_index);
      if (download_queue.reduce((previousValue, currentValue) => previousValue && !currentValue, true)) {
        let temp = [...curQueue];
        temp[queue_index].show = false;
        temp = temp.filter((val, i) => val.show);
        const tempPrg = new Array<progressProps>(temp.length).fill({ progress: 0 });
        updateQueue(temp);
        updateQueuePrg(tempPrg);
        setDisable(false);
        setStop(false);
      }
    };

    const download = (vid_index: number): void => {
      const vid = download_queue[vid_index];
      const format = vid.quality.get(vid.curQual);
      let type, extension;
      if (vid.ext === 'custom') {
        if (curCustomExt || (curCustomExt ?? '').length > 2) {
          [type, extension] = curCustomExt.split(' ');
        } else {
          // eslint-disable-next-line prettier/prettier
          alert('You must define a custom extesion type in the navbar to be able to use the \'Other\' tag');
          return;
        }
      } else {
        [type, extension] = vid.ext.split(' ');
      }
      if (vid.merge) {
        if (type === 'v') {
          downloadVideo(vid.id, vid.title, format, extension, vid.clips, vid.duration, context, vid_index, vid.i).then(
            ({ vid_index, queue_index }) => {
              callback(vid_index, queue_index);
            },
          );
        } else {
          downloadAudio(vid.id, vid.title, extension, vid.clips, vid.duration, context, vid_index, vid.i).then(
            ({ vid_index, queue_index }) => {
              callback(vid_index, queue_index);
            },
          );
        }
      } else {
        downloadOther(vid.id, vid.title, extension, vid.clips, vid.duration, format, context, vid_index, vid.i).then(
          ({ vid_index, queue_index }) => {
            callback(vid_index, queue_index);
          },
        );
      }
    };

    if (download_queue.length === 0) {
      setDisable(false);
      return;
    }

    for (let i = 0; i < download_queue.length; i++) {
      download(i);
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
            animate={val.animate}
            show={val.show}
          />
        ))}
      </QueueContainer>
      <ButtonsContainer>
        <button onClick={downloadQueue} disabled={disable}>
          Download Videos
        </button>
        <button
          disabled={!disable}
          onClick={() => {
            setStop(true);
          }}
        >
          Stop Downloading
        </button>
        <button onClick={() => updateQueue([])} disabled={disable}>
          Clear queue
        </button>
        <button onClick={inputUrl}>Input url</button>
        <button onClick={search}>Search Youtube</button>
        {/* <button
          onClick={() => {
            const test: string[] = [];
            for (const item of curQueue) {
              test.push(item.id);
            }
            const buff = Buffer.from(JSON.stringify(test));
            const clipboard = nw.Clipboard.get();
            clipboard.set(buff.toString('base64'), 'text');
          }}
        >
          Test
        </button> */}
      </ButtonsContainer>
    </Outer>
  );
};

export default Queue;
