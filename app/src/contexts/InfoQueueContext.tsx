import { createContext, ReactNode, useState } from 'react';
import { Props } from 'components/Queue/Item';

export interface InfoQueueContextData {
  curQueue: Array<Props>;
  curInfo: string;
  curSearch: boolean;
  curExt: string;
  curCustomExt: string | null;
  updateQueue(newQueue: Array<Props>): void;
  updateInfo(newInfo: string): void;
  updateSearch(newSearch: boolean): void;
  updateExt(newExt: string): void;
  updateCurCustomExt(newCustomExt: string): void;
}

interface InfoQueueProviderProps {
  children: ReactNode;
}

export const InfoQueueContext = createContext({} as InfoQueueContextData);

export default function InfoQueueProvider({ children }: InfoQueueProviderProps) {
  const [queue, setQueue] = useState<Props[]>([]);
  const [info, setInfo] = useState('Waiting for download');
  const [showSearch, setShowSearch] = useState(false);
  const [ext, setExt] = useState('v mkv');
  const [customExt, setCustomExt] = useState(null);

  function updateQueue(newQueue: Props[]) {
    setQueue(newQueue);
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

  return (
    <InfoQueueContext.Provider
      value={{
        updateQueue,
        updateInfo,
        updateSearch,
        updateExt,
        updateCurCustomExt,
        curQueue: queue,
        curInfo: info,
        curSearch: showSearch,
        curExt: ext,
        curCustomExt: customExt,
      }}
    >
      {children}
    </InfoQueueContext.Provider>
  );
}
