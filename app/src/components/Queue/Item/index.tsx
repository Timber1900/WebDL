import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import {
  PlayItem,
  ImagePreview,
  Image,
  NameContainer,
  VideoOptions,
  Container,
  DropdownContent,
  Separator,
  ProgressContainer,
} from './style';
import { Outer } from 'components/Quality/style';
import Trim from 'components/Trim';
import Quality from 'components/Quality';
import KebabMenu from 'components/KebabMenu';
import { InnerProps } from 'components/Trim';
import { downloadVideo } from 'logic/youtube-dl-wrap/downloadVideo';
import { downloadAudio } from 'logic/youtube-dl-wrap/downloadAudio';
import { ID } from 'logic/id';
import { downloadOther } from 'logic/youtube-dl-wrap/downloadOther';
import { InfoQueueContext, progressProps } from 'contexts/InfoQueueContext';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export interface Props {
  i: number;
  id: string;
  thumbnail: string;
  info: any;
  quality: Map<string, any>;
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

const Item: FC<Props> = (props: Props) => {
  const { id, merge, clips, i, duration } = props;
  const titleLabel = useRef(null);
  const title = props.title;
  const [qual, setQual] = useState<string>(props.quality.entries().next().value[0]);
  const [show, setShow] = useState(props.download);
  const ext = props.ext;
  const refs: any = [titleLabel];
  const context = useContext(InfoQueueContext);
  const { curQueue, updateQueue, curCustomExt, curConcurrentDownload, curQueuePrg, updateQueuePrg } = context;
  const refQueue = useRef(curQueue);
  const refPropsI = useRef(props.i);

  useEffect(() => {
    if (refQueue.current[refPropsI.current].animate ?? true) {
      setTimeout(() => {
        refQueue.current[refPropsI.current].animate = false;
      }, 1000);
    }
  }, []);

  const renameVideo = function (e: any) {
    const label = e;
    label.setAttribute('contenteditable', true);
    label.focus();

    const changeTitle = (title: string) => {
      const tempQueue = [...curQueue];
      tempQueue[i].title = title;
      updateQueue(tempQueue);
    };

    function stopRenameEnter(event: any) {
      if (event.target === label && event.key === 'Enter') {
        label.innerHTML.replace(/\n/g, '');
        label.setAttribute('contenteditable', false);
        document.removeEventListener('keydown', stopRenameEnter);
        changeTitle(label.innerHTML);
      }
    }
    function stopRename() {
      label.setAttribute('contenteditable', false);
      label.removeEventListener('focusout', stopRename);
      changeTitle(label.innerHTML);
    }
    document.addEventListener('keydown', stopRenameEnter);
    e.addEventListener('focusout', stopRename);
  };

  const changeExt = (ext: string) => {
    const tempQueue = [...curQueue];
    tempQueue[i].ext = ext;
    const tempPrg = new Array<progressProps>(tempQueue.length).fill({ progress: 0 });
    updateQueue(tempQueue);
    updateQueuePrg(tempPrg);
  };

  const dv = () => {
    // @ts-ignore: Object is possibly 'null'.
    const format = props.quality.get(qual);
    const callback = (queue_index: number) => {
      console.log(queue_index);
      const removedQueue = curQueue.filter((e) => e.id !== props.id);
      const tempPrg = new Array<progressProps>(removedQueue.length).fill({ progress: 0 });
      updateQueue(removedQueue);
      updateQueuePrg(tempPrg);
    };
    let type, extension;
    if (ext === 'custom') {
      if (curCustomExt || (curCustomExt ?? '').length > 2) {
        [type, extension] = curCustomExt.split(' ');
      } else {
        // eslint-disable-next-line prettier/prettier
        alert('You must define a custom extesion type in the navbar to be able to use the \'Other\' tag');
        return;
      }
    } else {
      [type, extension] = ext.split(' ');
    }

    if (merge) {
      if (type === 'v') {
        downloadVideo(id, title, format, extension, clips, duration, context, 0, i).then(({ queue_index }) => {
          callback(queue_index);
        });
      } else {
        downloadAudio(id, title, extension, clips, duration, context, 0, i).then(({ queue_index }) => {
          callback(queue_index);
        });
      }
    } else {
      downloadOther(id, title, extension, clips, duration, format, context, 0, i).then(({ queue_index }) => {
        callback(queue_index);
      });
    }
  };

  const setActive = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const res = refs.filter((val: any) => val.current === e.target || val === e.target);
    if (res.length) {
      setShow(!show);
      curQueue[props.i].download = !show;
    }
  };

  const fullmin = props.duration / 60;
  const hours = Math.floor(fullmin / 60);
  const min = Math.floor(fullmin - hours * 60);
  const sec = Math.floor(props.duration - min * 60);

  const h =
    hours.toString().length > 1 ? hours.toString() : hours.toString().length > 0 ? '0' + hours.toString() : '00';
  const m = min.toString().length > 1 ? min.toString() : min.toString().length > 0 ? '0' + min.toString() : '00';
  const s = sec.toString().length > 1 ? sec.toString() : sec.toString().length > 0 ? '0' + sec.toString() : '00';

  return (
    <Container onClick={setActive} ref={(ref) => refs.push(ref)} animate={props.animate ?? true} show={props.show}>
      <PlayItem
        ref={(ref) => refs.push(ref)}
        // @ts-ignore: Object is possibly 'null'.
        show={show}
      >
        <ImagePreview ref={(ref) => refs.push(ref)}>
          <Image src={props.thumbnail} ref={(ref) => refs.push(ref)} />
        </ImagePreview>
        <NameContainer
          ref={titleLabel}
          onBlur={() => {
            // @ts-ignore: Object is possibly 'null'.
            titleLabel.current.scrollLeft = 0;
          }}
        >
          {title}
        </NameContainer>
        {(() => {
          if (curConcurrentDownload > 1) {
            return (
              <ProgressContainer>
                <CircularProgressbar
                  value={curQueuePrg[props.i].progress}
                  maxValue={100}
                  text={''}
                  styles={buildStyles({
                    strokeLinecap: 'butt',
                    backgroundColor: '#343A40',
                    pathColor: '#48cae4',
                    trailColor: '#343A40',
                  })}
                />
              </ProgressContainer>
            );
          }
        })()}
        <VideoOptions ref={(ref) => refs.push(ref)}>
          <KebabMenu />
          <DropdownContent>
            <label onClick={() => renameVideo(titleLabel.current)}>Rename video</label>
            <Trim hh={h} mm={m} ss={s} clips={clips} i={i} key={ID()} />
            <label onClick={dv}>Download video</label>
            <Separator />
            <Quality quality={props.quality} setQual={setQual} />
            <Outer>
              <label>Filetype:</label>
              <select defaultValue={ext} onChange={(e) => changeExt(e.target.value)}>
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
            </Outer>
          </DropdownContent>
        </VideoOptions>
      </PlayItem>
    </Container>
  );
};

export default Item;
