import YoutubeDlWrap from 'youtube-dl-wrap';
import { youtubeDlWrap } from './index';
import execa from 'execa';
import internal from 'stream';

export const execStream = (youtubeDlArguments: any[] = []): internal.Readable => {
  youtubeDlArguments = youtubeDlArguments.concat(['-o', '-']);
  const youtubeDlProcess = execa(youtubeDlWrap.binaryPath, youtubeDlArguments, {
    windowsHide: true,
  });

  let stderrData = '';
  youtubeDlProcess.stderr?.on('data', (data) => {
    let stringData = data.toString();
    // console.log(`%c ${data.toString()}`, 'color: #0099FF');
    YoutubeDlWrap.emitYoutubeDlEvents(stringData, youtubeDlProcess.stdout);
    stderrData += stringData;
  });
  youtubeDlProcess.on('error', (error) =>
    console.log(`Youtube DL exited with code ${error}, heres some error data: ${stderrData}`),
  );
  youtubeDlProcess.on('progress', console.log);
  return youtubeDlProcess.stdout as internal.Readable;
};
