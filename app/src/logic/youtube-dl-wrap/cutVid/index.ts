// import ffmpeg from 'ffmpeg-static';
import { spawn } from 'child_process';
import { join } from 'path';
import OS from 'os';
// @ts-expect-error
import ffmpeg from 'ffmpeg-static';

export const cutAudio = async (start: number, end: number, path: string, title: string, i: number, ext: string) => {
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
        '-c:a',
        'aac',
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
  return new Promise((resolve, reject) => {
    const duration = end - start;
    const secondffmpegprocess = spawn(
      './ffmpeg.dll',
      [
        '-ss',
        start.toString(),
        '-i',
        join(OS.homedir(), 'AppData', 'Roaming', '.webdl', `tempvideo.${ext}`),
        '-to',
        duration.toString(),
        '-c',
        'copy',
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
