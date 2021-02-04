import React, { FC, useState } from 'react';
import { ID } from '../../logic/id';
import { outQueue, updateQueue } from '../Queue';
import {
  Container,
  InnerContainer,
  Outer,
  InnerSpan,
  StyledTime,
  Button,
  ButtonsDiv,
  ButtonInnerSpan,
  TimeContainer,
} from './style';

interface Props {
  hh: string;
  mm: string;
  ss: string;
  clips: InnerProps[];
  i: number;
}

interface OtherProps {
  hh: string;
  mm: string;
  ss: string;
  clips: InnerProps[];
  i: number;
  show: boolean;
  change: any;
}

export interface InnerProps {
  h1: string;
  m1: string;
  s1: string;
  h2: string;
  m2: string;
  s2: string;
  i: number;
  start: number;
  end: number;
  id: string;
  index: number;
  change: any;
}

const Trim: FC<Props> = (prop: Props) => {
  const [show, setShow] = useState(false);

  const changeShow = () => setShow(!show);

  return (
    <Outer>
      <TimeInput hh={prop.hh} mm={prop.mm} ss={prop.ss} clips={prop.clips} i={prop.i} show={show} change={changeShow} />
      <label onClick={() => changeShow()}>Trim video</label>
    </Outer>
  );
};

const TimeInput: FC<OtherProps> = (prop: OtherProps) => {
  const [innerClips, setInnerClips] = useState<InnerProps[]>(prop.clips);

  const addClip = () => {
    const temp = [...innerClips];
    temp.push({
      h2: prop.hh,
      m2: prop.mm,
      s2: prop.ss,
      h1: '00',
      m1: '00',
      s1: '00',
      start: 0,
      end: 0,
      id: ID(),
      index: 1,
      i: prop.i,
      change: null,
    });
    outQueue[prop.i].clips = temp;
    updateQueue(outQueue);
    setInnerClips(temp);
  };

  return (
    <Container
      // @ts-ignore: Object is possibly 'null'.
      show={prop.show}
    >
      <TimeContainer>
        {innerClips.map((e, i) => {
          return (
            <TimeInputInner
              h2={e.h2}
              m2={e.m2}
              s2={e.s2}
              h1={e.h1}
              m1={e.m1}
              s1={e.s1}
              start={e.start}
              end={e.end}
              index={i}
              key={e.id}
              id={e.id}
              i={e.i}
              change={setInnerClips}
            />
          );
        })}
      </TimeContainer>
      <ButtonsDiv>
        <Button onClick={prop.change}>Close</Button>
        <Button onClick={addClip}>Add clip</Button>
      </ButtonsDiv>
    </Container>
  );
};

const TimeInputInner: FC<InnerProps> = (prop: InnerProps) => {
  const { h1, m1, s1, h2, m2, s2 } = prop;

  const changeStart = (value: string) => {
    const [hour, min, sec] = value.split(':');
    outQueue[prop.i].clips[prop.index].h1 = hour;
    outQueue[prop.i].clips[prop.index].m1 = min;
    outQueue[prop.i].clips[prop.index].s1 = sec;
    const total = parseInt(hour) * 3600 + parseInt(min) * 60 + parseInt(sec);
    outQueue[prop.i].clips[prop.index].start = total;
    prop.change(outQueue[prop.i].clips);
  };

  const changeEnd = (value: string) => {
    const [hour, min, sec] = value.split(':');
    outQueue[prop.i].clips[prop.index].h2 = hour;
    outQueue[prop.i].clips[prop.index].m2 = min;
    outQueue[prop.i].clips[prop.index].s2 = sec;
    const total = parseInt(hour) * 3600 + parseInt(min) * 60 + parseInt(sec);
    outQueue[prop.i].clips[prop.index].end = total;
    prop.change(outQueue[prop.i].clips);
  };

  const remove = () => {
    const new_clips = outQueue[prop.i].clips.filter((e) => e.id !== prop.id);
    outQueue[prop.i].clips = new_clips;
    updateQueue(outQueue);
    prop.change(new_clips);
  };

  return (
    <InnerContainer>
      <InnerSpan>
        <StyledTime showSeconds value={`${h1}:${m1}:${s1}`} onChange={(event, value) => changeStart(value)} />
      </InnerSpan>
      To
      <InnerSpan>
        <StyledTime showSeconds value={`${h2}:${m2}:${s2}`} onChange={(event, value) => changeEnd(value)} />
      </InnerSpan>
      <ButtonInnerSpan>
        <button onClick={remove}>Remove</button>
      </ButtonInnerSpan>
    </InnerContainer>
  );
};

export default Trim;
