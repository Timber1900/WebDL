import styled from 'styled-components';

export const DropdownContent = styled.div`
  display: block;
  position: absolute;
  background-color: var(--black);
  min-width: 160px;
  z-index: 2;
  right: 0;
  top: 35px;
  border-radius: 10px;
  border: var(--almost-black) solid 2px;
  overflow: visible;
  visibility: hidden;

  > label {
    padding: 5px 10px;
    text-align: center;
    display: block;
  }

  > label:hover {
    background-color: var(--almost-black);
  }
`;

export const VideoOptions = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 24px;
  visibility: hidden;

  &:hover ${DropdownContent} {
    visibility: visible;
  }
`;

export const Container = styled.span`
  position: relative;
`;

export const PlayItem = styled.div`
  display: flex;
  border-radius: 2px;
  width: 100%;
  height: 50px;
  min-height: 50px;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid var(--almost-black);
  overflow: hidden;
  white-space: nowrap;
  background-color: ${(props) => {
    // @ts-ignore: Object is possibly 'null'.
    return props.show ? 'var(--almost-black)' : 'var(--black)';
  }};

  &:hover ${VideoOptions} {
    visibility: visible;
  }

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

export const Image = styled.img`
  width: 72px;
  height: 40px;
  border-radius: 2px;
`;

export const NameContainer = styled.span`
  line-height: 20px;
  font-family: Roboto;
  font-size: 16px;
  color: var(--white);
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:focus {
    text-overflow: initial;
  }
`;

export const Separator = styled.hr`
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid var(--dark-grey);
  margin: 0.05em 0;
  padding: 0;
`;

export const Placeholder = styled.span`
  height: 50px;
  width: 24px;
`;
