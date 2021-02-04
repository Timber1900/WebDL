import React, { useEffect, useState } from 'react';
import { Outer, Inner, ProgressBar, Label } from './style';

export let updateProg: React.Dispatch<React.SetStateAction<number>>;
export let updateVel: React.Dispatch<React.SetStateAction<string>>;

const Progress = () => {
  const [prog, setProg] = useState(0);
  const [vel, setVel] = useState('0.0 MiB/s');

  useEffect(() => {
    updateProg = setProg;
    updateVel = setVel;
  }, []);

  return (
    <Outer>
      <ProgressBar value={prog / 100}></ProgressBar>
      <Inner>
        <Label>{vel}</Label>
        <Label>{`${prog}%`}</Label>
      </Inner>
    </Outer>
  );
};

export default Progress;
