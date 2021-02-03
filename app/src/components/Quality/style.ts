import styled from 'styled-components';

export const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  line-height: 26px;

  > label {
    padding: 5px 10px;
    text-align: center;
    display: block;
  }
`;

export const QualSelect = styled.select`
  background-color: var(--almost-black);

  &:focus {
    outline: none;
  }
`;
