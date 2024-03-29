import * as React from 'react';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { Props } from '../Components/Item';
import {join} from 'path';
import fs from 'fs';
import { downloadPath } from '../helpers/Constants';


type extTypes = 'v mkv' | 'v mp4' | 'v avi' | 'v webm' | 'v mov' | 'a mp3' | 'a m4a' | 'a ogg' | 'a wav' | 'custom';
export interface InfoQueueContextData {
  curQueue: Props[];
  curQueuePrg: progressProps[];
  curQueueVel: velProps[];
  curQueueEta: etaProps[];
  curInfo: string;
  curSearch: boolean;
  curExt: extTypes;
  curCustomExt: string | null;
  curConcurrentDownload: number;
  curVideoEncoder: 'copy' | 'libx265' | 'libx264' | 'mpeg4',
  curAudioEncoder: 'copy' | 'aac' | 'libmp3lame' | 'wmav2',
  updateQueue(newQueue: Props[]): void;
  updateQueuePrg(newPrg: progressProps[]): void;
  updateQueuePrgIndividually(newPrg: number, index: number): void;
  updateQueueVel(newVel: velProps[]): void;
  updateQueueVelIndividually(newVel: string, index: number): void;
  updateQueueEta(newVel: etaProps[]): void;
  updateQueueEtaIndividually(newEta: string, index: number): void;
  updateInfo(newInfo: string): void;
  updateSearch(newSearch: boolean): void;
  updateExt(newExt: extTypes): void;
  updateCurCustomExt(newCustomExt: string | null): void;
  updateConcurrentDownload(newCuncurrentDownload: number): void;
  updateVideoEncoder(newVideoEncoder: 'copy' | 'libx265' | 'libx264' | 'mpeg4'): void;
  updateAudioEncoder(newAudioEncoder: 'copy' | 'aac' | 'libmp3lame' | 'wmav2'): void;
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

export interface etaProps {
  eta: string;
}

export const InfoQueueContext = createContext({} as InfoQueueContextData);

function replacer(key: any, value: any) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key: any, value: any) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

export default function InfoQueueProvider({ children }: InfoQueueProviderProps) {
  const [queue, setQueue] = useState<Props[]>([]);
  const [queuePrg, setQueuePrg] = useState<progressProps[]>([]);
  const [queueVel, setQueueVel] = useState<velProps[]>([]);
  const [queueEta, setQueueEta] = useState<etaProps[]>([]);
  const [info, setInfo] = useState('Waiting for download');
  const [showSearch, setShowSearch] = useState(false);
  const [ext, setExt] = useState<extTypes>(process.platform !== 'darwin' ? 'v mkv' : 'v mov');
  const [customExt, setCustomExt] = useState<string | null>(null);
  const [concurrentDownloads, setConcurrentDownloads] = useState(1);
  const [videoEncoder, setVideoEncoder] = useState<'copy' | 'libx265' | 'libx264' | 'mpeg4'>('copy');
  const [audioEncoder, setAudioEncoder] = useState<'copy' | 'aac' | 'libmp3lame' | 'wmav2'>('copy');

  useEffect(() => {
    let startQueue: Props[] = [];

    try{
      if(fs.existsSync(join(downloadPath, 'queue.webdl'))) startQueue = JSON.parse(fs.readFileSync(join(downloadPath, 'queue.webdl')).toString(), reviver);

      const startPrg = Array.from({length: startQueue.length}, ():progressProps => ({progress: 0}));
      const startVel = Array.from({length: startQueue.length}, ():velProps => ({ vel: '0.0MiB/s' }));
      const startEta = Array.from({length: startQueue.length}, ():etaProps => ({ eta: '00:00' }));

      setQueue(startQueue);
      setQueuePrg(startPrg);
      setQueueVel(startVel);
      setQueueEta(startEta);
    } catch (e) {
      console.error(e)
    }
  }, []);

  useEffect(() => {
    fs.writeFile(join(downloadPath, 'queue.webdl'), JSON.stringify(queue, replacer), (e) => {if(e) console.error(e);});
  }, [queue]);

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

  function updateQueueEta(newEta: etaProps[]) {
    setQueueEta(newEta);
  }

  function updateQueueEtaIndividually(newEta: string, index: number) {
    const temp = [...queueEta];
    temp[index].eta = newEta;
    setQueueEta(temp);
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

  function updateVideoEncoder(newVideoEncoder: 'copy' | 'libx265' | 'libx264' | 'mpeg4') {
    setVideoEncoder(newVideoEncoder);
  }

  function updateAudioEncoder(newAudioEncoder: 'copy' | 'aac' | 'libmp3lame' | 'wmav2') {
    setAudioEncoder(newAudioEncoder);
  }

  return (
    <InfoQueueContext.Provider
      value={{
        updateQueue,
        updateQueuePrg,
        updateQueueVel,
        updateQueueEta,
        updateQueuePrgIndividually,
        updateQueueVelIndividually,
        updateQueueEtaIndividually,
        updateInfo,
        updateSearch,
        updateExt,
        updateCurCustomExt,
        updateConcurrentDownload,
        updateVideoEncoder,
        updateAudioEncoder,
        curQueue: queue,
        curQueuePrg: queuePrg,
        curQueueVel: queueVel,
        curQueueEta: queueEta,
        curInfo: info,
        curSearch: showSearch,
        curExt: ext,
        curCustomExt: customExt,
        curConcurrentDownload: concurrentDownloads,
        curVideoEncoder: videoEncoder,
        curAudioEncoder: audioEncoder
      }}
    >
      {children}
    </InfoQueueContext.Provider>
  );
}
