import styled from 'styled-components';

export const Container = styled.div`
  display: ${(props) => {
    // @ts-ignore: Object is possibly 'null'.
    return props?.show ? 'flex' : 'none';
  }};
  position: fixed;
  justify-content: flex-start;
  flex-direction: column;

  left: 4vw;
  right: 4vw;
  top: 4vh;
  bottom: 4vh;
  background-color: var(--black);
  border-radius: 5px;
  border: 2px solid var(--almost-black);
`;

export const InputDiv = styled.div`
  padding: 1vh 1vw;
  display: flex;
  flex-direction: row;
  height: 30px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const Input = styled.input`
  background-color: var(--almost-black);
  border: none;
  flex-grow: 1;
  height: 100%;
  border-radius: 4px;
  padding: 0 0 0 5px;
  &:focus {
    outline: none;
  }
`;

export const SearchButton = styled.button`
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 100%;
`;

export const SearchContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const ButtonsContainer = styled.div`
  height: 20px;
  display: flex;
  padding: 1vh 1vw 2vh 1vw;

  > button {
    height: 100%;
    flex: 1;
  }
`;

export const VideoFrame = styled.iframe`
  margin: 1vh 1vw;
  border: 2px solid var(--almost-black);
  border-radius: 5px;
  flex-grow: 1;
  overflow: hidden;
`;

export const ResultsContainer = styled.div`
  margin: 1vh 1vw 1vh 0;
  border: 2px solid var(--almost-black);
  border-radius: 5px;
  width: 35%;
  overflow-y: scroll;
  overflow-x: hidden;
`;

export const ItemDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  height: 50px;
  align-items: center;

  &:hover {
    background-color: var(--dark-grey);
  }

  &:active {
    background-color: var(--regular-grey);
  }
`;

export const ImagePreview = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
`;

export const ItemThumbnail = styled.img`
  width: 72px;
  height: 40px;
  border-radius: 2px;
`;

export const ItemLabel = styled.label`
  max-lines: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
