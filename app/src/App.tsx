import * as React from 'react';
import { SettingsContext } from './contexts/SettingsContext';
import { useContext, useEffect } from 'react';
import Settings, { setDarkMode } from './Components/Settings';
import { InfoQueueContext, InfoQueueContextData } from './contexts/InfoQueueContext';
import { CheckUpdates } from './Functions/update';
import { addToQueue } from './Functions/server/addToQueue';
import { startServer } from './Functions/server/server';
import Header from './Components/Header';
import Main from './Components/Main';
import Footer from './Components/Footer';
import Search from './Components/Search';
import ytpl from 'ytpl';

export let outerContext: InfoQueueContextData;

function App() {
  const {showSettings, changeShowSettings, changeShowSearch, showSearch} = useContext(SettingsContext);
  const context = useContext(InfoQueueContext);

  const closeOpen = () => {
    if(showSettings) changeShowSettings();
    if(showSearch) changeShowSearch();
  };

  useEffect(() => {
    setDarkMode();
    startServer();
    //@ts-ignore
    window.ytpl = ytpl;
    CheckUpdates();
    window.addEventListener('paste', (event: any) => {
      const paste = event.clipboardData.getData('text');
      addToQueue(paste);
    });


  }, []);

  useEffect(() => {
    outerContext = context;
  }, [context]);

  return (
    <div className="w-screen h-[calc(100vh-1.75rem)] fixed bottom-0 subpixel-antialiased">
      <div className={`${(showSettings || showSearch) ? 'opacity-40' : 'opacity-0 pointer-events-none'} z-10 absolute inset-0 w-screen h-screen bg-black transition-opacity duration-200`} onClick={closeOpen}/>
      <div className="grid w-screen h-full font-sans text-2xl font-extrabold text-black bg-white grid-rows-pancake dark:bg-gray-800 dark:text-white">
        <Header />
        <Main />
        <Footer />
      </div>
      <Settings className={`${showSettings ? '' : 'hidden'} z-20`}/>
      <Search className={`${showSearch ? '' : 'hidden'} z-20`}/>
    </div>
  );
}

export default (App);
