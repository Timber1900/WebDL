import { InfoQueueContext } from '../Contexts/InfoQueueContext';
import { useContext } from 'react';
import { MdSettings } from 'react-icons/md';
import { SettingsContext } from '../Contexts/SettingsContext';


const Footer = () => {
  const { curInfo } = useContext(InfoQueueContext);
  const { changeShowSettings } = useContext(SettingsContext);

  return(
    <footer className="flex flex-row items-center justify-end w-full gap-4 p-2 text-xl font-bold truncate border-t border-gray-200 shadow-md dark:border-gray-700">
      <span className="w-full text-left text-center truncate">{curInfo}</span>
      <MdSettings onClick={changeShowSettings} className="ml-auto text-black transition-all duration-200 transform rotate-0 fill-current hover:rotate-90 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"/>
    </footer>
  )
}

export default Footer
