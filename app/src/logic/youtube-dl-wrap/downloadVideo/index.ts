import fs from 'fs';
import OS from 'os';
import { join } from 'path';
import { spawn } from 'child_process';
import { cutVid } from '../cutVid';
import { execStream } from '../execStream';
import { path } from 'logic/getPath';
import { InnerProps } from 'components/Trim';
import { updateProg, updateVel } from 'components/Progress';
import { InfoQueueContextData } from 'contexts/InfoQueueContext';

export const downloadVideo = async (
  url: string,
  callback: any,
  title: string,
  videoFormat: any,
  ext: string,
  raw_clips: InnerProps[],
  length: number,
  { updateInfo, curQueue, updateQueuePrgIndividually }: InfoQueueContextData,
  i: number,
) => {
  const clips: number[][] = [];

  for (const c of raw_clips) {
    let start = parseInt(c.h1) * 3600 + parseInt(c.m1) * 60 + parseInt(c.s1);
    start = start > 0 ? start : 0;
    let end = parseInt(c.h2) * 3600 + parseInt(c.m2) * 60 + parseInt(c.s2);
    end = end < length ? end : length;

    if (start > end) clips.push([end, start]);
    if (start < end) clips.push([start, end]);
  }

  updateInfo(`Downloading ${title}`);

  const regex = /["*/:<>?\\|]/g;
  const fixedTitle: string = title.replace(regex, '');

  const video = execStream([url, '-f', videoFormat]);
  const audio = execStream([url, '-f', 'bestaudio']);

  // @ts-expect-error
  const ffmpeg = nw.require('ffmpeg-static');

  if (clips.length) await fs.unlink(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', `tempvideo.${ext}`), () => {});

  console.log(ext);

  const ffmpegProcess = spawn(
    ffmpeg,
    [
      '-loglevel',
      '8',
      '-hide_banner',
      '-i',
      'pipe:4',
      '-i',
      'pipe:5',
      '-map',
      '0:a',
      '-map',
      '1:v',
      '-c:v',
      'copy',
      '-y',
      clips.length
        ? join(OS.homedir(), 'AppData', 'Roaming', '.webdl', `tempvideo.${ext}`)
        : join(path, `${fixedTitle}.${ext}`),
    ],
    {
      windowsHide: true,
      stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'pipe', 'pipe'],
    },
  );
  // @ts-expect-error
  audio.pipe(ffmpegProcess.stdio[4]);
  // @ts-expect-error
  video.pipe(ffmpegProcess.stdio[5]);

  video
    .on('progress', (progress: any) => {
      updateProg(progress.percent);
      updateQueuePrgIndividually(progress.percent, i - 1);
      updateVel(progress.currentSpeed);
    })
    .on('error', (err: any) => {
      console.error(`%c ${err}`, 'color: #F87D7A');
      callback();
    });
  ffmpegProcess.on('close', () => {
    if (clips.length) {
      updateInfo('Cutting video ...');
      const promises = [];
      let i = 1;
      for (const clip of clips) {
        promises.push(cutVid(clip[0], clip[1], path, fixedTitle, i, ext));
        i++;
      }

      Promise.all(promises).then((val) => {
        fs.unlink(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', `tempvideo.${ext}`), console.log);
        updateInfo(`Done downloading ${title}`);
        callback();
      });
    } else {
      updateInfo(`Done downloading ${title}`);
      callback();
    }
  });
};
