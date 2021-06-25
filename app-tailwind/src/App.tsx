import Header from './Components/Header';
import Main from './Components/Main';
import Footer from './Components/Footer';
import Settings from './Components/Settings';
import { SettingsContext } from './Contexts/SettingsContext';
import { useContext } from 'react';
import { useEffect } from 'react';
import { setDarkMode } from './Components/Settings';

function App() {
  const {showSettings, changeShowSettings} = useContext(SettingsContext);

  useEffect(() => {
    setDarkMode();
  })

  return (
    <div className="relative w-full h-full">
      <div className={`${showSettings ? 'opacity-40' : 'opacity-0 pointer-events-none'} z-10 absolute inset-0 w-screen h-screen bg-black transition-opacity duration-200`} onClick={changeShowSettings}/>
      <div className="grid w-screen h-screen font-sans text-2xl font-extrabold text-black bg-white grid-rows-pancake dark:bg-gray-800 dark:text-white">
        <Header />
        <Main />
        <Footer />
      </div>
      <Settings className={`${showSettings ? '' : 'hidden'} z-20`}/>
    </div>
  );
}

export default App;
