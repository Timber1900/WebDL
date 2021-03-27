import React, { useContext, useEffect } from 'react';
import ytpl from 'ytpl';
import Routes from './routes';
import GlobalStyles from './styles/global';
import 'logic/server/server';
import { CheckUpdates } from 'logic/update';
import { setUpMinimize } from 'logic/tray';
import { addToQueue } from 'logic/server/addToQueue';
import { InfoQueueContext, InfoQueueContextData } from 'contexts/InfoQueueContext';

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
