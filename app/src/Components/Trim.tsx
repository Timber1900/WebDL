import { useContext, useEffect, useState } from 'react';
import TimeField from 'react-simple-timefield';
import { InfoQueueContext } from '../Contexts/InfoQueueContext';
import { InnerProps } from './Item';
import { CgClose } from 'react-icons/cg'

interface TrimProps {
  closeTrim: () => void
  hh: string;
  mm: string;
  ss: string;
  clips: InnerProps[];
  i: number;
}

let outsideClips: InnerProps[];

const Trim = ({closeTrim, clips, hh, mm, ss, i}: TrimProps) => {
  const [opacity, setOpacity] = useState(false)
  const [innerClips, setInnerClips] = useState<InnerProps[]>(clips);
  const { curQueue, updateQueue } = useContext(InfoQueueContext);

  useEffect(() => {
    setOpacity(true)
    return () => {setOpacity(false)}
  }, [])

  useEffect(() => {
    outsideClips = innerClips;
  }, [innerClips])

  const saveClips = () => {
    const temp = [...curQueue];
    temp[i].clips = innerClips;
    updateQueue(temp);
  }

  const addClip = () => {
    const temp = [...innerClips];
    temp.push({
      h2: hh,
      m2: mm,
      s2: ss,
      h1: '00',
      m1: '00',
      s1: '00',
      start: 0,
      end: 0,
      id: '_' + Math.random().toString(36).substr(2, 9),
      index: 1,
      i: i,
      change: setInnerClips,
    });
    setInnerClips(temp);
  };

  return(
    <>
      <div className={`absolute inset-0 z-10 bg-black ${opacity ? 'opacity-40' : 'opacity-0'} transition-opacity duration-200`} onClick={() => {setOpacity(false); setTimeout(() => {
        closeTrim()
      }, 200); saveClips(); }}/>
      <div className={`${opacity ? 'flex' : 'hidden'} flex-col gap-4 absolute z-20 p-4 bg-white shadow-lg inset-12 mx-auto max-w-3xl dark:bg-gray-800 rounded-2xl justify-start items-center divide-gray-200 divide-y-2 dark:divide-gray-700`}>
        <h1 className="w-full text-center">Trim Video</h1>
        <div className="flex flex-col items-center justify-start w-full h-full p-4 overflow-y-scroll divide-y divide-gray-200 dark:divide-gray-700">
        {innerClips.map((e, i) => {
          return (
            <InnerTrim
              h2={e.h2}
              m2={e.m2}
              s2={e.s2}
              h1={e.h1}
              m1={e.m1}
              s1={e.s1}
              start={e.start}
              end={e.end}
              index={i}
              key={i}
              id={e.id}
              i={e.i}
              change={setInnerClips}
            />
          );
        })}
        <span className="grid w-full p-4 place-content-center">
        <CgClose onClick={addClip} className="ml-auto text-black transition-all transform scale-100 -rotate-45 fill-current active:text-blue-600 active:scale-95 dark:active:text-blue-600 dark:text-white hover:text-blue-500 dark:hover:text-blue-500 hover:rotate-45 hover:scale-125"/>
        </span>
        </div>
      </div>
    </>
  )
}


const InnerTrim = ({h1, h2, m1, m2, s1, s2, i, change, index, id}: InnerProps) => {

  const changeStart = (value: string) => {
    const tempClips = [...outsideClips];
    const [hour, min, sec] = value.split(':');
    tempClips[index].h1 = hour;
    tempClips[index].m1 = min;
    tempClips[index].s1 = sec;
    const total = parseInt(hour) * 3600 + parseInt(min) * 60 + parseInt(sec);
    tempClips[index].start = total;
    change(tempClips);
  };

  const changeEnd = (value: string) => {
    const tempClips = [...outsideClips];
    const [hour, min, sec] = value.split(':');
    tempClips[index].h2 = hour;
    tempClips[index].m2 = min;
    tempClips[index].s2 = sec;
    const total = parseInt(hour) * 3600 + parseInt(min) * 60 + parseInt(sec);
    tempClips[index].end = total;
    change(tempClips);
  };

  const remove = () => {
    const new_clips = outsideClips.filter((e) => e.id !== id);
    // console.log(new_clips)
    // const temp = [...curQueue];
    // temp[i].clips = new_clips;
    // updateQueue(temp);
    change(new_clips);
  };

  return(
    <span className="flex flex-row items-center justify-center w-full gap-4 p-4">
      <TimeField showSeconds value={`${h1}:${m1}:${s1}`} input={<input type="text" className="w-24 px-4 py-2 text-xl bg-gray-200 rounded-md shadow-md sm:text-2xl sm:w-32 dark:bg-gray-700 focus:outline-none"/>} onChange={(event, value) => changeStart(value)}/>
      <p>To</p>
      <TimeField showSeconds value={`${h2}:${m2}:${s2}`} input={<input type="text" className="w-24 px-4 py-2 text-xl bg-gray-200 rounded-md shadow-md sm:text-2xl sm:w-32 dark:bg-gray-700 focus:outline-none"/>} onChange={(event, value) => changeEnd(value)}/>
      <CgClose onClick={remove} className="ml-auto text-black transition-all transform scale-100 rotate-0 fill-current active:text-red-600 active:scale-95 dark:active:text-red-600 dark:text-white hover:text-red-500 dark:hover:text-red-500 hover:rotate-90 hover:scale-125"/>
    </span>
  )
}

export default Trim;
