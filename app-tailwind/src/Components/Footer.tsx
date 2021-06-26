import { InfoQueueContext } from '../Contexts/InfoQueueContext';
import { useContext } from 'react';
import { MdSettings, MdSearch } from 'react-icons/md';
import { SettingsContext } from '../Contexts/SettingsContext';


const Footer = () => {
  const { curInfo } = useContext(InfoQueueContext);
  const { changeShowSettings, changeShowSearch } = useContext(SettingsContext);

  return(
    <footer className="flex flex-row items-center justify-end w-full gap-4 p-2 text-xl font-bold truncate border-t border-gray-200 shadow-md dark:border-gray-700">
      <span className="w-full text-center truncate">{curInfo}</span>
      <MdSearch onClick={changeShowSearch} className="ml-auto text-black transition-all duration-200 transform scale-100 fill-current hover:scale-125 active:scale-95 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"/>
      <MdSettings onClick={changeShowSettings} className="ml-auto text-black transition-all duration-200 transform scale-100 rotate-0 fill-current hover:scale-125 active:scale-95 hover:rotate-90 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"/>
    </footer>
  )
}

export default Footer
