import styled from 'styled-components';

export const Outer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90vw;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 10px 5vw 0 5vw;
`;

export const Inner = styled.div`
  display: flex;
  flex-direction: row;
  width: 90vw;
  align-items: center;
  justify-content: space-between;
`;

export const ProgressBar = styled.progress`
  appearance: none;
  border-radius: 10px;
  width: 90vw;
  padding: 5px 0 5px 0;
  height: 25px;
  transition: all 0.1s;
  -webkit-transition: all 0.1s;

  &::-webkit-progress-bar {
    background-color: var(--almost-black);
    width: 100%;
    border-radius: 10px;
    transition: all 0.1s;
    -webkit-transition: all 0.1s;
  }

  &::-webkit-progress-value {
    background-color: var(--blue);
    border-radius: 10px;
  }
`;

export const Label = styled.label`
  font-family: Roboto;
  font-size: 16px;
  color: var(--white);
`;
