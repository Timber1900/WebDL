import { join } from 'path';
import { path } from '../../getPath';
import fs, { chmodSync } from 'fs';
import { updateProg, updateVel } from '../../../Components/Header';
import { InnerProps } from '../../../Components/Item';
import { cutAudio } from '../cutVid';
import { spawn } from 'child_process';
import { execStream } from '../execStream';
import { InfoQueueContextData } from '../../../contexts/InfoQueueContext';
import { downloadPath } from '../../../Constants';

interface index_interface {
  vid_index: number;
  queue_index: number;
}

export const downloadOther = async (
  url: string,
  title: string,
  ext: string,
  raw_clips: InnerProps[],
  length: number,
  videoFormat: any,
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

    console.log(videoFormat)

    const ffmpeg = nw.require('ffmpeg-static');
    if(process.platform === 'linux') chmodSync(ffmpeg, 0o755)

    const video = execStream([url, '-f', videoFormat.format_id]);

    const ffmpegProcess = spawn(
      ffmpeg,
      [
        '-loglevel',
        '8',
        '-hide_banner',
        '-i',
        'pipe:4',
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
    video.pipe(ffmpegProcess.stdio[4]);

    video
      .on('progress', (progress: any) => {
        updateProg(progress.percent);
        updateQueuePrgIndividually(progress.percent, queue_index);
        updateQueueVelIndividually(progress.currentSpeed, queue_index)
        updateVel(progress.currentSpeed);
      })
      .on('error', (err: any) => {
        console.error(`%c ${err}`, 'color: #F87D7A');
        res({ vid_index, queue_index });
      });

    video.on('error', console.log);

    ffmpegProcess.on('close', () => {
      if (clips.length) {
        updateInfo('Cutting video ...');
        const promises = [];
        let i = 1;
        for (const clip of clips) {
          promises.push(cutAudio(clip[0], clip[1], path, title, i, ext));
          i++;
        }

        Promise.all(promises).then(() => {
          fs.unlinkSync(join(downloadPath, `tempvideo.${ext}`));
          updateInfo(`Done downloading ${title}`);
          res({ vid_index, queue_index });
        });
      } else {
        updateInfo(`Done downloading ${title}`);
        res({ vid_index, queue_index });
      }
    });
  });
};
