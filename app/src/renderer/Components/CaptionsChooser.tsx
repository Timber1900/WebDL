import * as React from 'react';
import { useRef, useEffect, useState } from 'react';
import { downloadCaptions } from '../Functions/youtube-dl-wrap/downloadCaptions';
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

  const download = () =>{
    downloadCaptions(captionLanguage, translateLanguage, format, info.player_response.captions, info.videoDetails.title)
  }

  return(
    <>
      <div onClick={() => {setShowCaptionLanguageDropdown(false); setShowTranslateLanguageDropdown(false); setShowFormatDropdown(false);}} className={`${showCaptionLanguageDropdown || showTranslateLanguageDropdown || showFormatDropdown ? 'block pointer-events-auto' : 'none pointer-events-none'} absolute z-30 inset-0 `}/>
      <div className="flex flex-col items-start justify-center w-full">
        <span className="flex flex-row items-center justify-start gap-4">
          <h2 className="text-lg font-normal">Available captions:</h2>
          <div className="relative">
            <div className="relative z-50">
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
        <span className="flex flex-row items-center justify-start gap-4">
          <h2 className="text-lg font-normal">Translate to:</h2>
          <div className="relative">
            <div className="relative z-50">
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
        <span className="flex flex-row items-center justify-start gap-4">
          <h2 className="text-lg font-normal">Format:</h2>
          <div className="relative">
            <div className="relative z-50">
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
        <div>
          <button onClick={download}>download__temp</button>
        </div>
      </div>
    </>
  )
}
export default CaptionsChooser;
