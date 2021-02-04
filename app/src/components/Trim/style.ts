import styled from 'styled-components';
import TimeField from 'react-simple-timefield';

export const Outer = styled.div`
  > label {
    padding: 5px 10px;
    text-align: center;
    display: block;
  }

  > label:hover {
    background-color: var(--almost-black);
  }
`;

export const ButtonsDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-self: flex-end;
  margin-top: auto;
`;

export const Button = styled.button`
  flex: 1;
`;

export const Container = styled.div`
  width: 58vw;
  margin: 1vh 1vw 1vh 5vw;
  left: 0;
  z-index: 10;
  top: calc(50px + 3vh);
  bottom: 50px;
  background-color: var(--almost-black);
  border: 2px solid var(--dark-grey);
  border-radius: 7px;
  position: fixed;
  display: ${(props) => {
    // @ts-ignore: Object is possibly 'null'.
    return props.show ? 'flex' : 'none';
  }};
  visibility: visible !important;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  overflow: visible;
`;

export const TimeContainer = styled.div`
  width: 100%;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  overflow: visible;
  overflow-y: scroll;
  white-space: nowrap;
  z-index: 1;
`;

export const InnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  > button {
    margin-left: auto;
  }
`;

export const InnerSpan = styled.span`
  display: flex;
  align-items: center;
  padding: 5px 20px 5px 20px;
`;

export const ButtonInnerSpan = styled.span`
  display: flex;
  align-items: center;
  margin-left: auto;
  padding: 5px 20px 5px 20px;
`;

export const StyledTime = styled(TimeField)`
  color: var(--white);
  background-color: var(--dark-grey);
  border: solid var(--black) 2px;
  border-radius: 2px;
  padding: 2px;
`;
