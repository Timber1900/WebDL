import styled from 'styled-components';

export const NavButton = styled.button`
  display: block;
  height: 8vh;
  width: 10vw;
`;

export const NavLabel = styled.label`
  display: block;
  margin-right: auto;
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

  > div {
    opacity: 0;
  }

  &:hover {
    width: max(30vw, 100px);

    > div {
      opacity: 1;
    }
  }
`;

export const OptionOuter = styled.div`
  display: flex;
  flex-direction: column;
  height: 10vh;
  width: auto;
  justify-content: flex-start;
  align-items: center;
  transition: 0.5s ease;
`;

export const NavSpan = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1vh 2vh 1vh 2vh;
  width: max(28vw, 90px);
`;

export const NavSpanTypeTwo = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 1vh 2vh 1vh 2vh;
  width: max(28vw, 90px);

  > label {
    margin-right: auto;
  }
`;

interface Props {
  open: boolean;
}

export const NavSpanTypeThree = styled.span<Props>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 1vh 2vh 1vh 2vh;
  width: max(28vw, 90px);

  > svg {
    margin: 4px;
    transition: 0.1s ease;
    transform: ${(props) => (props.open ? 'scaleY(-1)' : 'scaleY(1)')};
  }
`;

export const ExperimentalSpan = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 1vh 2vh 1vh 2vh;
  width: max(28vw, 90px);
  animation: item-appear 0.5s ease;

  @keyframes item-appear {
    from {
      opacity: 0;
      transform: translateY(-40%);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const BrowseInput = styled.input`
  display: none;
`;

export const NavInput = styled.input`
  background-color: var(--dark-grey);
  font: 400 13.3333px Roboto;
  color: var(--white);
  width: 4vw;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  border-radius: 2px;
  border: none;
  padding: 1px 6px;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
