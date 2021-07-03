import YoutubeDlWrap from 'youtube-dl-wrap';
import { youtubeDlWrap } from '../index';
import { spawn } from 'child_process';

export const execStream = (youtubeDlArguments: any[] = []) => {
  youtubeDlArguments = youtubeDlArguments.concat(['-o', '-']);
  const youtubeDlProcess = spawn(youtubeDlWrap.binaryPath, youtubeDlArguments, {
    windowsHide: true,
  });

  let stderrData = '';
  youtubeDlProcess.stderr.on('data', (data) => {
    let stringData = data.toString();
    // console.log(`%c ${data.toString()}`, 'color: #0099FF');
    YoutubeDlWrap.emitYoutubeDlEvents(stringData, youtubeDlProcess.stdout);
    stderrData += stringData;
  });
  youtubeDlProcess.on('error', (error) =>
    console.log(`Youtube DL exited with code ${error}, heres some error data: ${stderrData}`),
  );
  youtubeDlProcess.on('progress', console.log);
  return youtubeDlProcess.stdout;
};
