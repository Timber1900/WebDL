import { SettingsContext } from './contexts/SettingsContext';
import { useContext } from 'react';
import { useEffect } from 'react';
import { setDarkMode } from './Components/Settings';
import { InfoQueueContext, InfoQueueContextData } from './contexts/InfoQueueContext';
import { setUpMinimize } from './Functions/tray';
import { CheckUpdates } from './Functions/update';
import { addToQueue } from './Functions/server/addToQueue';
import { startServer } from './Functions/server/server';
import Header from './Components/Header';
import Main from './Components/Main';
import Footer from './Components/Footer';
import Settings from './Components/Settings';
import Search from './Components/Search'
import ytpl from 'ytpl';

export let outerContext: InfoQueueContextData;

function App() {
  const {showSettings, changeShowSettings, changeShowSearch, showSearch} = useContext(SettingsContext);
  const context = useContext(InfoQueueContext);

  const closeOpen = () => {
    if(showSettings) changeShowSettings();
    if(showSearch) changeShowSearch();
  }

  useEffect(() => {
    setDarkMode();
    startServer();
    //@ts-ignore
    window.ytpl = ytpl;
    if(process.platform === 'win32') setUpMinimize();
    CheckUpdates();
    window.addEventListener('paste', (event: any) => {
      let paste = event.clipboardData.getData('text');
      addToQueue(paste);
    });
  }, [])

  useEffect(() => {
    outerContext = context;
  }, [context]);

  return (
    <div className="relative w-full h-full subpixel-antialiased">
      <div className={`${(showSettings || showSearch) ? 'opacity-40' : 'opacity-0 pointer-events-none'} z-10 absolute inset-0 w-screen h-screen bg-black transition-opacity duration-200`} onClick={closeOpen}/>
      <div className="grid w-screen h-screen font-sans text-2xl font-extrabold text-black bg-white grid-rows-pancake dark:bg-gray-800 dark:text-white">
        <Header />
        <Main />
        <Footer />
      </div>
      <Settings className={`${showSettings ? '' : 'hidden'} z-20`}/>
      <Search className={`${showSearch ? '' : 'hidden'} z-20`}/>
    </div>
  );
}

export default App;
