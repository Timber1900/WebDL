import * as React from 'react';
import minw10 from '../icons/min-w-10.png';
import minw12 from '../icons/min-w-12.png';
import minw15 from '../icons/min-w-15.png';
import minw20 from '../icons/min-w-20.png';
import minw24 from '../icons/min-w-24.png';
import minw30 from '../icons/min-w-30.png';
import maxw10 from '../icons/max-w-10.png';
import maxw12 from '../icons/max-w-12.png';
import maxw15 from '../icons/max-w-15.png';
import maxw20 from '../icons/max-w-20.png';
import maxw24 from '../icons/max-w-24.png';
import maxw30 from '../icons/max-w-30.png';
import restorew10 from '../icons/restore-w-10.png';
import restorew12 from '../icons/restore-w-12.png';
import restorew15 from '../icons/restore-w-15.png';
import restorew20 from '../icons/restore-w-20.png';
import restorew24 from '../icons/restore-w-24.png';
import restorew30 from '../icons/restore-w-30.png';
import closew10 from '../icons/close-w-10.png';
import closew12 from '../icons/close-w-12.png';
import closew15 from '../icons/close-w-15.png';
import closew20 from '../icons/close-w-20.png';
import closew24 from '../icons/close-w-24.png';
import closew30 from '../icons/close-w-30.png';
import { useEffect, useState } from 'react';

const Titlebar = () => {
  const [isMax, setIsMax] = useState(false);

  useEffect(() => {
    window.require('electron').ipcRenderer.on('maximize', () => {
      setIsMax(true);
    });
    window.require('electron').ipcRenderer.on('unmaximize', () => {
      setIsMax(false);
    });
  });

  return(
    <div className="h-7 w-screen bg-[#202124] text-white text-center grid grid-cols-titlebar1 fixed top-0">
      <div className={isMax ? '' : 'p-1'}>
        <div className={`z-10 grid w-full h-5 drag grid-cols-titlebar ${!isMax ? '' : 'p-1'}`}>
          <span className="relative w-5 h-5">
            <svg className="absolute inset-0 m-auto" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 128 128" fill="none">
              <path d="M96 119.426L128 64H64L96 119.426Z" fill="#0095C2"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M128 64L96 8.57437L64 64H0L32 119.426H96L64 64H128Z" fill="#00B3D4"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M0 64L32 8.57437H96L64 64H0Z" fill="#00C9E1"/>
            </svg>
          </span>
          <span className="flex items-center justify-start h-5 ml-2 text-sm select-none font-extralight">
            <p>{document.title}</p>
          </span>
        </div>
      </div>
      <div className="grid h-full grid-cols-3 w-max">
        <span onClick={() => {window.require('electron').ipcRenderer.send('minimize');}} className="grid place-content-center select-none w-12 h-full selection:bg-[#202124] hover:bg-[#37383A] active:bg-[#4D4D50] transition-colors z-20 cursor-default">
          <img srcSet={`${minw10} 1x, ${minw12} 1.25x, ${minw15} 1.5x, ${minw15} 1.75x, ${minw20} 2x, ${minw20} 2.25x, ${minw24} 2.5x, ${minw30} 3x, ${minw30} 3.5x`} draggable="false" />
        </span>
        <span onClick={() => {window.require('electron').ipcRenderer.send('maximize');}} className="grid place-content-center select-none w-12 h-full selection:bg-[#202124] hover:bg-[#37383A] active:bg-[#4D4D50] transition-colors z-20 cursor-default">
          {!isMax &&
            <img srcSet={`${maxw10} 1x, ${maxw12} 1.25x, ${maxw15} 1.5x, ${maxw15} 1.75x, ${maxw20} 2x, ${maxw20} 2.25x, ${maxw24} 2.5x, ${maxw30} 3x, ${maxw30} 3.5x"`} draggable="false" />
          }
          {isMax &&
           <img srcSet={`${restorew10} 1x, ${restorew12} 1.25x, ${restorew15} 1.5x, ${restorew15} 1.75x, ${restorew20} 2x, ${restorew20} 2.25x, ${restorew24} 2.5x, ${restorew30} 3x, ${restorew30} 3.5x"`} draggable="false" />
          }
        </span>
        <span onClick={() => {window.require('electron').ipcRenderer.send('close');}} className="grid place-content-center select-none w-12 h-full selection:bg-[#202124] hover:bg-[#E81123] active:bg-[#971722] transition-colors z-20 cursor-default">
          <img srcSet={`${closew10} 1x, ${closew12} 1.25x, ${closew15} 1.5x, ${closew15} 1.75x, ${closew20} 2x, ${closew20} 2.25x, ${closew24} 2.5x, ${closew30} 3x, ${closew30} 3.5x"`} draggable="false" />
        </span>
      </div>
    </div>
  );
};

export default Titlebar;
