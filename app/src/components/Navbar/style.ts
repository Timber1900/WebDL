import styled from 'styled-components';

export const NavButton = styled.button`
  display: block;
  height: 8vh;
  width: 10vw;
`;

export const NavLabel = styled.label`
  display: block;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-lines: 1;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 2vw;
  background-color: var(--almost-black);
  transition: width 0.5s;
  z-index: 1;
  &:hover {
    width: max(30vw, 100px);
  }
`;

export const OptionOuter = styled.div`
  display: flex;
  flex-direction: column;
  height: 10vh;
  width: auto;
  justify-content: flex-start;
  align-items: center;
`;

export const NavSpan = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1vh 2vh 1vh 2vh;
  width: max(28vw, 90px);
`;

export const BrowseInput = styled.input`
  display: none;
`;
