import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { CaptionTrack, InfoVideo } from '../helpers/Constants';


interface captionChooserProps {
  info: InfoVideo,
  languageName: string | null,
  translateName: string | null,
  formatName: string | null,
  captions: captions[],
  setCaptions: React.Dispatch<React.SetStateAction<captions[]>>,
  index: number,
}

export interface captions {
  languageName: string | null,
  translateName: string | null,
  formatName: string | null,
  id: string
}

export interface captionsProp {
  setCaptions: React.Dispatch<React.SetStateAction<captions[]>>,
  captions: captions[],
  info: InfoVideo,
}

export const Captions = ({captions, info, setCaptions}: captionsProp) => {
  const [innerCaptions, setInnerCaptions] = useState<captions[]>(captions)

  function addCaption() {
    const temp = [...innerCaptions];
    temp.push({languageName: null, translateName: null, formatName: null, id: '_' + Math.random().toString(36).substr(2, 9)})
    setInnerCaptions(temp);
  }

  useEffect(( ) => {
    setCaptions(innerCaptions);
  }, [innerCaptions])

  return(
    <div className="absolute z-20 flex flex-col items-center justify-start gap-4 p-8 bg-white rounded-lg shadow-lg inset-x-0 mx-auto min-w-[576px] w-max max-w-[636px] inset-y-12 dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      <h1 className="w-full text-2xl text-center">Caption options</h1>
      <div className="flex flex-col items-center justify-start w-full h-full p-4 overflow-x-visible overflow-y-scroll">
        {innerCaptions.map(({languageName, translateName, formatName, id}, i) =>
          <>
            <CaptionsChooser key={id} info={info} languageName={languageName} translateName={translateName} formatName={formatName} captions={innerCaptions} index={i} setCaptions={setInnerCaptions}/>
            {i !== captions.length - 1 && <div key={`${i}_separator`} className="w-full h-0 my-2 border-b border-gray-200 dark:border-gray-700" />}
          </>
        )}
      </div>
      <span className="grid w-full p-4 pb-0 mt-auto place-content-center">
        <CgClose onClick={addCaption} className="ml-auto text-black transition-all transform scale-100 -rotate-45 fill-current active:text-blue-600 active:scale-95 dark:active:text-blue-600 dark:text-white hover:text-blue-500 dark:hover:text-blue-500 hover:rotate-45 hover:scale-125"/>
      </span>
    </div>

  )
}


const CaptionsChooser = ({ info, languageName, translateName, captions, index, setCaptions, formatName }: captionChooserProps) => {
  const [captionString, setCaptionString] = useState(languageName ?? "");
  const [translateString, setTranslateString] = useState(translateName ?? "Do not translate");
  const [formatString, setFormatString] = useState(formatName ?? "vtt");
  const [showCaptionLanguageDropdown, setShowCaptionLanguageDropdown] = useState(false);
  const [showTranslateLanguageDropdown, setShowTranslateLanguageDropdown] = useState(false);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [captionLanguage, setCaptionLanguage] = useState<string | null>(languageName)
  const [translateLanguage, setTranslateLanguage] = useState<string>(translateName ?? "Do not translate")
  const [format, setFormat] = useState<string>(formatName ?? "vtt")
  const captionRef = useRef<HTMLInputElement>(null)
  const translateRef = useRef<HTMLInputElement>(null)
  const formatRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const temp = [...captions]
    temp[index].languageName = captionLanguage;
    temp[index].translateName = translateLanguage;
    temp[index].formatName = format;
    setCaptions(temp);
  }, [captionLanguage, translateLanguage, format])

  const removeCaption = () => {
    const temp = [...captions]
    temp.splice(index, 1)
    setCaptions(temp);
  }

  return(
    <>
      <div onClick={() => {setShowCaptionLanguageDropdown(false); setShowTranslateLanguageDropdown(false); setShowFormatDropdown(false);}} className={`${showCaptionLanguageDropdown || showTranslateLanguageDropdown || showFormatDropdown ? 'block pointer-events-auto' : 'none pointer-events-none'} absolute z-30 inset-0 `}/>
      <div className="relative select-none w-max">
        <div className="flex flex-col items-start justify-center w-full gap-1">
          <span className="flex flex-row items-center justify-center w-full gap-4">
            <h2 className="text-lg font-normal">Available captions:</h2>
            <div className="relative ml-auto">
              <div className="relative z-50 flex items-center justify-center">
                <input spellCheck={false} onFocus={() => {setShowCaptionLanguageDropdown(true); setShowTranslateLanguageDropdown(false); setShowFormatDropdown(false);} } onChange={e => {setCaptionString(e.currentTarget.value)}} ref={captionRef} className="flex-grow px-2 text-lg font-normal text-justify bg-gray-200 rounded-md dark:bg-gray-700 focus:outline-none" placeholder={captionLanguage ?? 'Choose Language'} defaultValue={captionLanguage ?? ''} type='text'/>
              </div>
              {showCaptionLanguageDropdown &&
              <div className="absolute inset-x-0 overflow-y-scroll bg-gray-200 rounded-md z-[60] top-full max-h-36 dark:bg-gray-600">
                <ul className="text-base font-normal divide-y divide-gray-400 shadow-sm dark:divide-gray-500">
                  {info.player_response.captions.playerCaptionsTracklistRenderer.captionTracks.filter(val => val.name.simpleText.toLowerCase().startsWith(captionString.toLowerCase()) || captionString === "").map((val: CaptionTrack, i: number) =>
                    <li className="px-1 py-0.5 dark:hover:bg-gray-custom-550 dark:bg-gray-600 hover:bg-gray-200 bg-gray-300 transition-colors" key={i} onClick={() => {setCaptionLanguage(val.name.simpleText); setShowCaptionLanguageDropdown(false); captionRef.current.value = val.name.simpleText; setCaptionString(val.name.simpleText)}}>{val.name.simpleText}</li>)
                  }
                </ul>
              </div>}
            </div>
          </span>
          <span className="flex flex-row items-center justify-center w-full gap-4">
            <h2 className="text-lg font-normal">Translate to:</h2>
            <div className="relative ml-auto">
              <div className="relative z-50 flex items-center justify-center">
                <input spellCheck={false} onFocus={() => {setShowTranslateLanguageDropdown(true); setShowCaptionLanguageDropdown(false); setShowFormatDropdown(false);}} onChange={e => {setTranslateString(e.currentTarget.value)}} ref={translateRef} className="flex-grow px-2 text-lg font-normal text-justify bg-gray-200 rounded-md dark:bg-gray-700 focus:outline-none" placeholder={translateLanguage ?? 'Choose Language'} defaultValue={translateLanguage} type='text'/>
              </div>
              {showTranslateLanguageDropdown &&
              <div className="absolute inset-x-0 z-[60] overflow-y-scroll bg-gray-200 rounded-md top-full max-h-36 dark:bg-gray-600">
                <ul className="text-base font-normal divide-y divide-gray-400 shadow-sm dark:divide-gray-500">
                  <li className="px-1 py-0.5 dark:hover:bg-gray-custom-550 dark:bg-gray-600 hover:bg-gray-200 bg-gray-300 transition-colors" onClick={() => {setTranslateLanguage("Do not translate"); setShowTranslateLanguageDropdown(false); translateRef.current.value = "Do not translate"; setTranslateString("Do not translate")}}>Do not translate</li>
                  {info.player_response.captions.playerCaptionsTracklistRenderer.translationLanguages.filter(val => val.languageName.simpleText.toLowerCase().startsWith(translateString.toLowerCase()) || translateString === "").map((val, i: number) =>
                    <li className="px-1 py-0.5 dark:hover:bg-gray-custom-550 dark:bg-gray-600 hover:bg-gray-200 bg-gray-300 transition-colors" key={i} onClick={() => {setTranslateLanguage(val.languageName.simpleText); setShowTranslateLanguageDropdown(false); translateRef.current.value = val.languageName.simpleText; setTranslateString(val.languageName.simpleText)}}>{val.languageName.simpleText}</li>)
                  }
                </ul>
              </div>}
            </div>
          </span>
          <span className="flex flex-row items-center justify-center w-full gap-4">
            <h2 className="text-lg font-normal">Format:</h2>
            <div className="relative ml-auto">
              <div className="relative z-50 flex items-center justify-center">
                <input spellCheck={false} onFocus={() => {setShowFormatDropdown(true); setShowTranslateLanguageDropdown(false); setShowCaptionLanguageDropdown(false);}} onChange={e => {setFormatString(e.currentTarget.value)}} ref={formatRef} className="flex-grow px-2 text-lg font-normal text-justify bg-gray-200 rounded-md dark:bg-gray-700 focus:outline-none" placeholder={format ?? 'Choose Language'} defaultValue={format} type='text'/>
              </div>
              {showFormatDropdown &&
              <div className="absolute inset-x-0 z-[60] overflow-y-scroll bg-gray-200 rounded-md top-full max-h-36 dark:bg-gray-600">
                <ul className="text-base font-normal divide-y divide-gray-400 shadow-sm dark:divide-gray-500">
                  {['xml', 'ttml', 'vtt', 'srv1', 'srv2', 'srv3'].filter(val => val.toLowerCase().startsWith(formatString.toLowerCase()) || format === "").map((val, i: number) =>
                    <li className="px-1 py-0.5 dark:hover:bg-gray-custom-550 dark:bg-gray-600 hover:bg-gray-200 bg-gray-300 transition-colors" key={i} onClick={() => {setFormat(val); setShowFormatDropdown(false); formatRef.current.value = val; setFormatString(val)}}>{val}</li>)
                  }
                </ul>
              </div>}
            </div>
          </span>
        </div>
        <CgClose onClick={removeCaption} className="absolute inset-y-0 my-auto left-[102.5%] ml-auto text-black transition-all transform scale-100 rotate-0 fill-current active:text-red-600 active:scale-95 dark:active:text-red-600 dark:text-white hover:text-red-500 dark:hover:text-red-500 hover:rotate-90 hover:scale-125"/>

      </div>
    </>
  )
}
export default CaptionsChooser;
