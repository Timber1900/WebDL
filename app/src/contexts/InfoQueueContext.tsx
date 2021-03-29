import { createContext, ReactNode, useState } from 'react';
import { Props } from 'components/Queue/Item';

export interface InfoQueueContextData {
  curQueue: Props[];
  curQueuePrg: progressProps[];
  curInfo: string;
  curSearch: boolean;
  curExt: string;
  curCustomExt: string | null;
  curConcurrentDownload: number;
  updateQueue(newQueue: Props[]): void;
  updateQueuePrg(newPrg: progressProps[]): void;
  updateQueuePrgIndividually(newPrg: number, index: number): void;
  updateInfo(newInfo: string): void;
  updateSearch(newSearch: boolean): void;
  updateExt(newExt: string): void;
  updateCurCustomExt(newCustomExt: string): void;
  updateConcurrentDownload(newCuncurrentDownload: number): void;
}

interface InfoQueueProviderProps {
  children: ReactNode;
}

export interface progressProps {
  progress: number;
}

export const InfoQueueContext = createContext({} as InfoQueueContextData);

export default function InfoQueueProvider({ children }: InfoQueueProviderProps) {
  const [queue, setQueue] = useState<Props[]>([]);
  const [queuePrg, setQueuePrg] = useState<progressProps[]>([]);
  const [info, setInfo] = useState('Waiting for download');
  const [showSearch, setShowSearch] = useState(false);
  const [ext, setExt] = useState('v mkv');
  const [customExt, setCustomExt] = useState(null);
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

  function updateInfo(newInfo: string) {
    setInfo(newInfo);
  }

  function updateSearch(newSearch: boolean) {
    setShowSearch(newSearch);
  }

  function updateExt(newExt: string) {
    setExt(newExt);
  }

  function updateCurCustomExt(newCustomExt: string) {
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
        updateQueuePrgIndividually,
        updateInfo,
        updateSearch,
        updateExt,
        updateCurCustomExt,
        updateConcurrentDownload,
        curQueue: queue,
        curQueuePrg: queuePrg,
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
