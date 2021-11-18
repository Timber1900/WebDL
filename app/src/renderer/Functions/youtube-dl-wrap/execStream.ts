import YoutubeDlWrap from 'youtube-dl-wrap';
import { youtubeDlWrap } from './index';
import execa from 'execa';
import internal from 'stream';
import { downloadPath } from '../../helpers/Constants';
import { join } from "path";

export const execStream = (youtubeDlArguments: any[] = []): internal.Readable => {
  youtubeDlArguments = youtubeDlArguments.concat(['-o', '-', '--cookies', join(downloadPath, 'cookies.txt')]);
  console.log(youtubeDlArguments);

  const youtubeDlProcess = execa(youtubeDlWrap.binaryPath, youtubeDlArguments, {
    windowsHide: true,
  });

  let stderrData = '';
  youtubeDlProcess.stderr?.on('data', (data) => {
    const stringData = data.toString();
    // console.log(`%c ${data.toString()}`, 'color: #0099FF');
    YoutubeDlWrap.emitYoutubeDlEvents(stringData, youtubeDlProcess.stdout);
    stderrData += stringData;
  });
  youtubeDlProcess.on('close', (code, signal) => {console.log({code, signal, stderrData})})
  return youtubeDlProcess.stdout as internal.Readable;
};
