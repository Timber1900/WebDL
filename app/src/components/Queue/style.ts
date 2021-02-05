import styled from 'styled-components';

export const Outer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 90vw;
  height: calc(100vh - (110px + 4vh));
  padding: 2vh 5vw 2vh 5vw;
  z-index: 10;
`;

export const QueueContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  width: 58vw;
  margin: 1vh 1vw 1vh 0;
  border-radius: 5px;
  border: 2px solid var(--almost-black);
  overflow-y: scroll;

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: var(--black);
  }

  &::-webkit-scrollbar {
    background-color: #181a1b;
    width: 8px;
    margin: 0 auto;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #555;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  width: 28vw;
  padding: 1vh 1vw 1vh 1vw;

  > button {
    height: 8vh;

    &:disabled {
      background-color: var(--almost-black);
    }
  }
`;
