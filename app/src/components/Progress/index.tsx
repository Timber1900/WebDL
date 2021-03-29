import React, { useContext, useEffect, useState } from 'react';
import { InfoQueueContext } from '../../contexts/InfoQueueContext';
import { Outer, Inner, ProgressBar, Label } from './style';

export let updateProg: React.Dispatch<React.SetStateAction<number>>;
export let updateVel: React.Dispatch<React.SetStateAction<string>>;

const Progress = () => {
  const [prog, setProg] = useState(0);
  const [vel, setVel] = useState('0.0 MiB/s');
  const { curConcurrentDownload } = useContext(InfoQueueContext);

  useEffect(() => {
    updateProg = setProg;
    updateVel = setVel;
  }, []);

  return (
    <Outer>
      <ProgressBar value={curConcurrentDownload === 1 ? prog / 100 : 0}></ProgressBar>
      <Inner>
        <Label>{curConcurrentDownload === 1 ? vel : '0.0 MiB/s'}</Label>
        <Label>{curConcurrentDownload === 1 ? `${prog}%` : '0%'}</Label>
      </Inner>
    </Outer>
  );
};

export default Progress;
