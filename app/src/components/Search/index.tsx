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

let changeIframe: React.Dispatch<React.SetStateAction<string>>;

const Search: FC = () => {
  const [items, setItems] = useState<Props[]>([]);
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [currSearch, setCurSearch] = useState<ytsr.Result | ytsr.ContinueResult>();
  const { curSearch, updateSearch } = useContext(InfoQueueContext);
  const inputRef = useRef(null);

  useEffect(() => {
    changeIframe = setIframeUrl;
  }, []);

  const setSearch = (search: ytsr.Result | ytsr.ContinueResult) => {
    setCurSearch(search);
    const videos = search.items.filter((e) => e.type === 'video');
    const vids: Props[] = [];
    for (const vid of videos) {
      if (vid.type === 'video') {
        vids.push({
          thumbnail: vid.bestThumbnail.url ?? '',
          title: vid.title,
          url: vid.url,
          id: vid.id,
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
            return <Item thumbnail={e.thumbnail} title={e.title} url={e.url} id={e.id} key={i} />;
          })}
        </ResultsContainer>
      </SearchContainer>
      <ButtonsContainer>
        <button
          onClick={() => {
            console.log(curSearch);
            updateSearch(false);
          }}
        >
          Leave
        </button>
        <button
          onClick={() => {
            addToQueue(iframeUrl);
          }}
        >
          Add to queue
        </button>
        <button onClick={nextPage}>Next page</button>
      </ButtonsContainer>
    </Container>
  );
};

type Props = {
  title: string;
  url: string;
  thumbnail: string;
  id: string;
};

const Item: FC<Props> = (props: Props) => {
  return (
    <ItemDiv onClick={() => changeIframe(`https://www.youtube.com/embed/${props.id}`)}>
      <ImagePreview>
        <ItemThumbnail src={props.thumbnail} />
      </ImagePreview>
      <ItemLabel>{props.title}</ItemLabel>
    </ItemDiv>
  );
};

export default Search;
