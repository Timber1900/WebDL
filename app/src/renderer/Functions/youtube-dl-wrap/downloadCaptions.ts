import { Captions, TranslationLanguage } from '../../helpers/Constants';
import https from 'https';
import fs from 'fs';
import { resolve}  from 'path'
import { path } from '../getPath';

export const downloadCaptions = (languageName: string, translateName: string, format: string, captionInfo: Captions, video_title: string) => {
  return(new Promise((res, rej) => {
    const captionTrack = captionInfo.playerCaptionsTracklistRenderer.captionTracks.find(val => val.name.simpleText === languageName)
    if(!captionTrack) rej("Invaid languageName")

    const translate = translateName !== "Do not translate";
    let translateCode: TranslationLanguage;
    if(translate) {
      translateCode = captionInfo.playerCaptionsTracklistRenderer.translationLanguages.find(val => val.languageName.simpleText === translateName)
      if(!translateCode) rej("Invaid translateName")
    }

    const output = `${video_title}.${captionTrack.languageCode}.${format}`;
    const download_url = `${captionTrack.baseUrl}&fmt=${format !== 'xml' ? format : ''}${translate ? `&tlang=${translateCode.languageCode}` : ''}`

    https.get(download_url, res => {
      res.pipe(fs.createWriteStream(resolve(path, output)));
    });

    res("Done downloading!")
  }))
}
