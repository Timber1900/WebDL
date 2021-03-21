import React, { FC, useEffect, useState, useRef, useContext } from 'react';
import {
  Container,
  Input,
  InputDiv,
  SearchButton,
  SearchContainer,
  ButtonsContainer,
  ResultsContainer,
  VideoFrame,
  ItemDiv,
  ItemLabel,
  ItemThumbnail,
  ImagePreview,
} from './style';
import ytsr from 'ytsr';
import { addToQueue } from '../../logic/server/addToQueue';
import { InfoQueueContext } from '../../contexts/InfoQueueContext';
import mergeImages from 'merge-images';
import playlistImage from '../../../assets/playlist.png';

let changeIframe: React.Dispatch<React.SetStateAction<string>>;
let changeId: React.Dispatch<React.SetStateAction<string>>;

const Search: FC = () => {
  const [items, setItems] = useState<Props[]>([]);
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [currSearch, setCurSearch] = useState<ytsr.Result | ytsr.ContinueResult>();
  const [id, setId] = useState<string>('');
  const { updateSearch } = useContext(InfoQueueContext);
  const inputRef = useRef(null);

  useEffect(() => {
    changeIframe = setIframeUrl;
    changeId = setId;
  }, []);

  const setSearch = (search: ytsr.Result | ytsr.ContinueResult) => {
    setCurSearch(search);
    const videos = search.items.filter((e) => e.type === 'video' || e.type === 'playlist');
    const vids: Props[] = [];
    for (const vid of videos) {
      if (vid.type === 'video') {
        vids.push({
          thumbnail: vid.bestThumbnail.url ?? '',
          title: vid.title,
          url: vid.id,
          id: vid.id,
          type: vid.type,
        });
      } else if (vid.type === 'playlist') {
        vids.push({
          thumbnail: vid.firstVideo.thumbnails[vid.firstVideo.thumbnails.length - 1].url ?? '',
          title: vid.title,
          url: vid.firstVideo.id,
          id: vid.playlistID,
          type: vid.type,
        });
      }
    }
    setItems(vids);
  };

  const searchVideo = async () => {
    // @ts-ignore: Object is possibly 'null'.
    const searchTerms = inputRef?.current?.value;
    const search = await ytsr(searchTerms, { pages: 1 });
    setSearch(search);
  };

  const nextPage = async () => {
    if (currSearch?.continuation) {
      const search = await await ytsr.continueReq(currSearch.continuation);
      setCurSearch(search);
      setSearch(search);
    }
  };

  return (
    <Container>
      <InputDiv>
        <Input
          ref={inputRef}
          onKeyPress={(e) => {
            if (e.key === 'Enter') searchVideo();
          }}
        />
        <SearchButton onClick={searchVideo}>Search Youtube</SearchButton>
      </InputDiv>
      <SearchContainer>
        <VideoFrame
          src={iframeUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={true}
        />
        <ResultsContainer>
          {items.map((e, i) => {
            return <Item thumbnail={e.thumbnail} title={e.title} url={e.url} id={e.id} type={e.type} key={i} />;
          })}
        </ResultsContainer>
      </SearchContainer>
      <ButtonsContainer>
        <button
          onClick={() => {
            updateSearch(false);
          }}
        >
          Leave
        </button>
        <button
          onClick={() => {
            addToQueue(id);
          }}
        >
          Add to queue
        </button>
        <button onClick={nextPage}>Next page</button>
      </ButtonsContainer>
    </Container>
  );
};

interface Props {
  title: string;
  url: string;
  thumbnail: string;
  id: string;
  type: string;
}

const getImage = (url: string) => {
  return mergeImages([
    { src: url },
    {
      src: playlistImage,
      opacity: 0.8,
    },
  ]);
};

const Item: FC<Props> = (props: Props) => {
  const [url, setUrl] = useState(props.thumbnail);
  useEffect(() => {
    if (props.type === 'playlist') {
      getImage(props.thumbnail).then((val) => {
        setUrl(val);
      });
    } else {
      setUrl(props.thumbnail);
    }
  }, [props]);

  return (
    <ItemDiv
      onClick={() => {
        changeIframe(`https://www.youtube.com/embed/${props.url}`);
        changeId(props.id);
      }}
    >
      <ImagePreview>
        <ItemThumbnail src={url} />
      </ImagePreview>
      <ItemLabel>{props.title}</ItemLabel>
    </ItemDiv>
  );
};

export default Search;
