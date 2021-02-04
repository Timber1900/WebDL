import React, { FC, useEffect, useState } from 'react';
import { Container, ILabel } from './style';

export let updateInfo: React.Dispatch<React.SetStateAction<string>>;
export let curInfo: string;

const InfoLabel: FC = () => {
  const [info, setInfo] = useState('Waiting for download');

  useEffect(() => {
    updateInfo = setInfo;
  }, []);

  useEffect(() => {
    curInfo = info;
  }, [info]);

  return (
    <Container>
      <ILabel>{info}</ILabel>
    </Container>
  );
};

export default InfoLabel;
