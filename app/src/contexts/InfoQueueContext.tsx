import { createContext, ReactNode, useState } from 'react';
import { Props } from '../components/Queue/Item';

export interface InfoQueueContextData {
  curQueue: Array<Props>;
  curInfo: string;
  curSearch: boolean;
  updateQueue(newQueue: Array<Props>): void;
  updateInfo(newInfo: string): void;
  updateSearch(newSearch: boolean): void;
}

interface InfoQueueProviderProps {
  children: ReactNode;
}

export const InfoQueueContext = createContext({} as InfoQueueContextData);

export default function InfoQueueProvider({ children }: InfoQueueProviderProps) {
  const [queue, setQueue] = useState<Props[]>([]);
  const [info, setInfo] = useState('Waiting for download');
  const [showSearch, setShowSearch] = useState(false);

  function updateQueue(newQueue: Props[]) {
    setQueue(newQueue);
  }

  function updateInfo(newInfo: string) {
    setInfo(newInfo);
  }

  function updateSearch(newSearch: boolean) {
    setShowSearch(newSearch);
  }

  return (
    <InfoQueueContext.Provider
      value={{
        updateQueue,
        updateInfo,
        updateSearch,
        curQueue: queue,
        curInfo: info,
        curSearch: showSearch,
      }}
    >
      {children}
    </InfoQueueContext.Provider>
  );
}
