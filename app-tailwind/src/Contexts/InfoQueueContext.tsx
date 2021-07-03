import { createContext, ReactNode, useState } from 'react';
import { Props } from '../Components/Item';

type extTypes = "v mkv" | "v mp4" | "v avi" | "v webm" | "a mp3" | "a m4a" | "a ogg" | "a wav" | "custom";
export interface InfoQueueContextData {
  curQueue: Props[];
  curQueuePrg: progressProps[];
  curQueueVel: velProps[];
  curInfo: string;
  curSearch: boolean;
  curExt: extTypes;
  curCustomExt: string | null;
  curConcurrentDownload: number;
  updateQueue(newQueue: Props[]): void;
  updateQueuePrg(newPrg: progressProps[]): void;
  updateQueuePrgIndividually(newPrg: number, index: number): void;
  updateQueueVel(newVel: velProps[]): void;
  updateQueueVelIndividually(newVel: string, index: number): void;
  updateInfo(newInfo: string): void;
  updateSearch(newSearch: boolean): void;
  updateExt(newExt: extTypes): void;
  updateCurCustomExt(newCustomExt: string | null): void;
  updateConcurrentDownload(newCuncurrentDownload: number): void;
}

interface InfoQueueProviderProps {
  children: ReactNode;
}

export interface progressProps {
  progress: number;
}

export interface velProps {
  vel: string;
}

export const InfoQueueContext = createContext({} as InfoQueueContextData);

export default function InfoQueueProvider({ children }: InfoQueueProviderProps) {
  const [queue, setQueue] = useState<Props[]>([]);
  const [queuePrg, setQueuePrg] = useState<progressProps[]>([]);
  const [queueVel, setQueueVel] = useState<velProps[]>([]);
  const [info, setInfo] = useState('Waiting for download');
  const [showSearch, setShowSearch] = useState(false);
  const [ext, setExt] = useState<extTypes>('v mkv');
  const [customExt, setCustomExt] = useState<string | null>(null);
  const [concurrentDownloads, setConcurrentDownloads] = useState(1);

  function updateQueue(newQueue: Props[]) {
    setQueue(newQueue);
  }

  function updateQueuePrg(newPrg: progressProps[]) {
    setQueuePrg(newPrg);
  }

  function updateQueuePrgIndividually(newPrg: number, index: number) {
    const temp = [...queuePrg];
    temp[index].progress = newPrg;
    setQueuePrg(temp);
  }

  function updateQueueVel(newVel: velProps[]) {
    setQueueVel(newVel);
  }

  function updateQueueVelIndividually(newVel: string, index: number) {
    const temp = [...queueVel];
    temp[index].vel = newVel;
    setQueueVel(temp);
  }

  function updateInfo(newInfo: string) {
    setInfo(newInfo);
  }

  function updateSearch(newSearch: boolean) {
    setShowSearch(newSearch);
  }

  function updateExt(newExt: extTypes) {
    setExt(newExt);
  }

  function updateCurCustomExt(newCustomExt: string | null) {
    setCustomExt(newCustomExt);
  }

  function updateConcurrentDownload(newCuncurrentDownload: number) {
    setConcurrentDownloads(newCuncurrentDownload);
  }

  return (
    <InfoQueueContext.Provider
      value={{
        updateQueue,
        updateQueuePrg,
        updateQueueVel,
        updateQueuePrgIndividually,
        updateQueueVelIndividually,
        updateInfo,
        updateSearch,
        updateExt,
        updateCurCustomExt,
        updateConcurrentDownload,
        curQueue: queue,
        curQueuePrg: queuePrg,
        curQueueVel: queueVel,
        curInfo: info,
        curSearch: showSearch,
        curExt: ext,
        curCustomExt: customExt,
        curConcurrentDownload: concurrentDownloads,
      }}
    >
      {children}
    </InfoQueueContext.Provider>
  );
}