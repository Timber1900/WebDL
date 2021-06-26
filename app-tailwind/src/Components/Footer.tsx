import { InfoQueueContext } from '../Contexts/InfoQueueContext';
import { useContext } from 'react';
import { MdSettings, MdSearch } from 'react-icons/md';
import { CgSoftwareDownload, CgClose } from 'react-icons/cg'
import { SettingsContext } from '../Contexts/SettingsContext';


const Footer = () => {
  const { curInfo } = useContext(InfoQueueContext);
  const { changeShowSettings, changeShowSearch } = useContext(SettingsContext);
  const { updateQueue, updateQueuePrg } = useContext(InfoQueueContext);

  const clearQueue = () => {
    updateQueue([])
    updateQueuePrg([])
  }

  return(
    <footer className="flex flex-row items-center justify-end w-full gap-4 p-2 text-xl font-bold truncate border-t border-gray-200 shadow-md dark:border-gray-700">
      <span className="w-full text-center truncate">{curInfo}</span>
      <CgClose onClick={clearQueue} className="ml-auto text-black transition-all duration-200 transform scale-125 rotate-0 fill-current hover:scale-150 active:scale-110 hover:rotate-90 hover:text-gray-900 dark:text-white dark:hover:text-gray-200 hover:text-red-500 dark:hover:text-red-500 active:text-red-600 dark:active:text-red-600"/>
      <CgSoftwareDownload className="ml-auto text-black transition-all duration-200 transform scale-125 fill-current hover:scale-150 active:scale-110 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"/>
      <MdSearch onClick={changeShowSearch} className="ml-auto text-black transition-all duration-200 transform scale-125 fill-current hover:scale-150 active:scale-110 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"/>
      <MdSettings onClick={changeShowSettings} className="ml-auto text-black transition-all duration-200 transform scale-125 rotate-0 fill-current hover:scale-150 active:scale-110 hover:rotate-90 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"/>
    </footer>
  )
}

export default Footer
