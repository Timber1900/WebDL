import OS from 'os';
import { spawn } from 'child_process';
import { join } from 'path';

export const cutAudio = async (start: number, end: number, path: string, title: string, i: number, ext: string) => {
  // @ts-expect-error
  const ffmpeg = nw.require('ffmpeg-static');
  return new Promise((resolve, reject) => {
    const duration = end - start;
    const secondffmpegprocess = spawn(
      ffmpeg,
      [
        '-ss',
        start.toString(),
        '-i',
        join(OS.homedir(), 'AppData', 'Roaming', '.webdl', `tempvideo.${ext}`),
        '-to',
        duration.toString(),
        '-y',
        join(path, `${title}-clip-${i}.${ext}`),
      ],
      {
        windowsHide: true,
        stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'pipe', 'pipe'],
      },
    );
    secondffmpegprocess.on('close', function () {
      resolve('done');
    });
    secondffmpegprocess.on('error', function (err) {
      reject(err);
    });
  });
};

export const cutVid = async (start: number, end: number, path: string, title: string, i: number, ext: string) => {
  // @ts-expect-error
  const ffmpeg = nw.require('ffmpeg-static');
  return new Promise((resolve, reject) => {
    const duration = end - start;
    const secondffmpegprocess = spawn(
      ffmpeg,
      [
        '-loglevel',
        '8',
        '-ss',
        start.toString(),
        '-i',
        join(OS.homedir(), 'AppData', 'Roaming', '.webdl', `tempvideo.${ext}`),
        '-to',
        duration.toString(),
        '-c',
        'copy',
        '-y',
        join(path, `${title}-clip-${i}.${ext}`),
      ],
      {
        windowsHide: true,
      },
    );
    secondffmpegprocess.on('close', function (code) {
      resolve('done');
    });
    secondffmpegprocess.on('error', function (err) {
      reject(err);
    });
  });
};
