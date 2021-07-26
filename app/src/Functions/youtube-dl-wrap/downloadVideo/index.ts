import fs, { chmodSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import { cutVid } from '../cutVid';
import { execStream } from '../execStream';
import { path } from '../../../Functions/getPath';
import { InnerProps } from '../../../Components/Item';
import { updateProg, updateVel } from '../../../Components/Header';
import { InfoQueueContextData } from '../../../contexts/InfoQueueContext';
import { downloadPath } from '../../../Constants';

interface index_interface {
  vid_index: number;
  queue_index: number;
}

export const downloadVideo = async (
  url: string,
  title: string,
  videoFormat: any,
  ext: string,
  raw_clips: InnerProps[],
  length: number,
  { updateInfo, updateQueuePrgIndividually, updateQueueVelIndividually }: InfoQueueContextData,
  vid_index: number,
  queue_index: number,
) => {
  return new Promise<index_interface>(async (res, rej) => {
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

    const video = execStream([url, '-f', videoFormat.itag ?? videoFormat.format_id]);
    const audio = execStream([url, '-f', 'bestaudio']);

    const ffmpeg = nw.require('ffmpeg-static');
    chmodSync(ffmpeg, 0o755)

    if (clips.length) await fs.unlink(join(downloadPath, `tempvideo.${ext}`), () => {});


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
          ? join(downloadPath, `tempvideo.${ext}`)
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
        updateQueuePrgIndividually(progress.percent, queue_index);
        updateQueueVelIndividually(progress.currentSpeed, queue_index);
        updateVel(progress.currentSpeed);
      })
      .on('error', (err: any) => {
        console.error(`%c ${err}`, 'color: #F87D7A');
        res({ vid_index, queue_index });
      });

    ffmpegProcess.on('close', (data) => {
      if (clips.length) {
        updateInfo('Cutting video ...');
        const promises = [];
        let i = 1;
        for (const clip of clips) {
          promises.push(cutVid(clip[0], clip[1], path, fixedTitle, i, ext));
          i++;
        }

        Promise.all(promises).then((val) => {
          fs.unlink(join(downloadPath, `tempvideo.${ext}`), console.log);
          updateInfo(`Done downloading ${title}`);
          res({ vid_index, queue_index });
        });
      } else {
        console.log(`Done downloading ${title}. Data: ${data}`);
        updateInfo(`Done downloading ${title}`);
        res({ vid_index, queue_index });
      }
    })
  });
};
