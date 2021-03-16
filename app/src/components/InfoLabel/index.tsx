import { FC, useContext } from 'react';
import { InfoQueueContext } from '../../contexts/InfoQueueContext';
import { Container, ILabel } from './style';

const InfoLabel: FC = () => {
  const { curInfo } = useContext(InfoQueueContext);

  return (
    <Container>
      <ILabel>{curInfo}</ILabel>
    </Container>
  );
};

export default InfoLabel;
