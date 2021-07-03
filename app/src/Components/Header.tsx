import ProgressBar from './ProgressBar';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { InfoQueueContext } from '../Contexts/InfoQueueContext';

export let updateProg: React.Dispatch<React.SetStateAction<number>>;
export let updateVel: React.Dispatch<React.SetStateAction<string>>;

const Header = () => {
  const [prog, setProg] = useState(0);
  const [vel, setVel] = useState('0.0MiB/s');
  const {curConcurrentDownload} = useContext(InfoQueueContext)
  const [curD, setCurD] = useState(curConcurrentDownload)

  useEffect(() => {
    updateProg = setProg;
    updateVel = setVel;
  }, []);

  useEffect(() => setCurD(curConcurrentDownload), [curConcurrentDownload])

  return(
    <header className="flex flex-col items-center justify-start border-b border-gray-200 shadow-md dark:border-gray-700">
      <span className="flex flex-row items-center justify-center w-full">
        <ProgressBar id="progress" value={curD > 1 ? 0 :(prog / 100)}/>
      </span>
      <span className='flex flex-row items-start justify-start w-full px-2 mb-1 text-base font-medium'>
        <label htmlFor='progress' className="text-base font-medium">{`${curD > 1 ? 0 : prog}%`}</label>
        <label htmlFor='progress' className="ml-auto text-base font-medium">{curD > 1 ? '0.0MiB/s' : vel}</label>
      </span>
    </header>
  )
}

export default Header
