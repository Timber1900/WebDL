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
import Trim from '../../Trim';
import Quality from '../../Quality';
import KebabMenu from '../../KebabMenu';
import { downloadVideo } from '../../../logic/youtube-dl-wrap/downloadVideo';
import { outQueue, updateQueue } from '../index';

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
};

const Item: FC<Props> = (props: Props) => {
  const { id, merge } = props;
  const titleLabel = useRef(null);
  const [title, setTitle] = useState(props.title);
  const [qual, setQual] = useState<string>(props.quality.entries().next().value[0]);
  const [show, setShow] = useState(props.download);
  const refs: any = [titleLabel];

  useEffect(() => {
    changeTitle = setTitle;
  }, []);

  useEffect(() => {
    if (outQueue[props.i]) outQueue[props.i].curQual = qual;
  }, [qual, props]);

  const dv = () => {
    // @ts-ignore: Object is possibly 'null'.
    const format = props.quality.get(qual);
    const callback = () => {
      const removedQueue = outQueue.filter((e) => e.id !== props.id);
      updateQueue(removedQueue);
    };
    downloadVideo(id, callback, title, merge, format);
  };

  const setActive = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const res = refs.filter((val: any) => val.current === e.target || val === e.target);
    if (res.length) {
      setShow(!show);
      outQueue[props.i].download = !show;
    }
  };

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
        <NameContainer ref={titleLabel}>{title}</NameContainer>
        <VideoOptions ref={(ref) => refs.push(ref)}>
          <KebabMenu />
          <DropdownContent>
            <label onClick={() => renameVideo(titleLabel.current)}>Rename video</label>
            <Trim />
            <label onClick={dv}>Download video</label>
            <Separator />
            <Quality quality={props.quality} setQual={setQual} />
          </DropdownContent>
        </VideoOptions>
      </PlayItem>
    </Container>
  );
};

/*
<div class="playItem show" url="" rank="" youtube="">
  <span class="preview-container">
    <img class="image" src="">
  </span>
  <span class="video-name-container">The Modern Web</span>
  <span class="video-options">
    <img src="../assets/more_vert-24px.png">
    <div class="dropdown-content">
      <label>Rename video</label>
      <span>
        <label onclick="openTrimPopup(this)">Trim video</label>
        <div class="outer">
          <span class="trim-btn-span" name="buttons">
            <button class="trim-btn" onclick="openTrimPopup(this.parentNode.parentNode.parentNode.children[0])">Leave</button>
            <button class="trim-btn" onclick="addClip(this, 0, 8, 24, 504)">Add clip</button>
          </span>
        </div>
      </span>
      <label>Download video</label>
      <hr class="separator">
      <span class="qual-span">
        <label class="qual-sel" for="_xrh1nq9vt">Quality</label>
        <select id="_xrh1nq9vt">
          <option value="1080p">1080p</option>
          <option value="720p">720p</option>
          <option value="480p">480p</option>
          <option value="360p">360p</option>
          <option value="240p">240p</option>
          <option value="144p">144p</option>
        </select>
      </span>
    </div>
  </span>
  <span class="video-options-placeholder"></span>
</div>
*/

export default Item;
