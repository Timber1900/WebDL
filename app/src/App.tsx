import React, { useContext, useEffect } from 'react';
import GlobalStyles from './styles/global';
import Routes from './routes';
import './logic/server/server';
import { CheckUpdates } from './logic/update';
import { setUpMinimize } from './logic/tray';
import { addToQueue } from './logic/server/addToQueue';
import { InfoQueueContext, InfoQueueContextData } from './contexts/InfoQueueContext';
import ytpl from 'ytpl';

export let outerContext: InfoQueueContextData;

function App() {
  const context = useContext(InfoQueueContext);

  useEffect(() => {
    //@ts-ignore
    window.ytpl = ytpl;
    setUpMinimize();
    CheckUpdates();
    window.addEventListener('paste', (event: any) => {
      let paste = event.clipboardData.getData('text');
      addToQueue(paste);
    });
  }, []);

  useEffect(() => {
    outerContext = context;
  }, [context]);

  return (
    <>
      <Routes />
      <GlobalStyles />
    </>
  );
}

export default App;
