import React, { FC, useEffect, useRef, useState } from 'react';
import {
  PlayItem,
  ImagePreview,
  Image,
  NameContainer,
  VideoOptions,
  Container,
  DropdownContent,
  Separator,
} from './style';
import { Outer } from '../../Quality/style';
import Trim from '../../Trim';
import Quality from '../../Quality';
import KebabMenu from '../../KebabMenu';
import { downloadVideo } from '../../../logic/youtube-dl-wrap/downloadVideo';
import { downloadAudio } from '../../../logic/youtube-dl-wrap/downloadAudio';
import { outQueue, updateQueue } from '../index';
import { InnerProps } from '../../Trim';
import { ID } from '../../../logic/id';

let changeTitle: React.Dispatch<React.SetStateAction<string>>;

const renameVideo = function (e: any) {
  e.setAttribute('contenteditable', true);
  e.focus();
  const label = e;
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

export type Props = {
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
};

const Item: FC<Props> = (props: Props) => {
  const { id, merge, clips, i, duration } = props;
  const titleLabel = useRef(null);
  const [title, setTitle] = useState(props.title);
  const [qual, setQual] = useState<string>(props.quality.entries().next().value[0]);
  const [show, setShow] = useState(props.download);
  const [ext, setExt] = useState(props.ext);
  const refs: any = [titleLabel];

  useEffect(() => {
    changeTitle = setTitle;
  }, []);

  useEffect(() => {
    if (outQueue && outQueue[props.i]) outQueue[props.i].curQual = qual;
  }, [qual, props]);

  useEffect(() => {
    if (outQueue && outQueue[props.i]) outQueue[props.i].ext = ext;
  }, [ext, props]);

  const dv = () => {
    // @ts-ignore: Object is possibly 'null'.
    const format = props.quality.get(qual);
    const callback = () => {
      const removedQueue = outQueue.filter((e) => e.id !== props.id);
      updateQueue(removedQueue);
    };
    if (Math.sign(parseInt(ext)) === -1) {
      let container: string = ext === '-3' ? 'mkv' : ext === '-2' ? 'mp4' : 'webm';
      downloadVideo(id, callback, title, merge, format, container, clips, duration);
    } else {
      let container: string = ext === '1' ? 'mp3' : 'm4a';
      downloadAudio(id, callback, title, container, clips, duration);
    }
  };

  const setActive = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const res = refs.filter((val: any) => val.current === e.target || val === e.target);
    if (res.length) {
      setShow(!show);
      outQueue[props.i].download = !show;
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
    <Container onClick={setActive} ref={(ref) => refs.push(ref)}>
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
              <select defaultValue={ext} onChange={(e) => setExt(e.target.value)}>
                <optgroup label="Video">
                  <option value={-3}>mkv</option>
                  <option value={-2}>mp4</option>
                  <option value={-1} disabled={true}>
                    webm
                  </option>
                </optgroup>
                <optgroup label="Audio">
                  <option value={1} disabled={true}>
                    mp3
                  </option>
                  <option value={2}>m4a</option>
                </optgroup>
              </select>
            </Outer>
          </DropdownContent>
        </VideoOptions>
      </PlayItem>
    </Container>
  );
};

export default Item;
