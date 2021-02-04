import { youtubeDlWrap } from '../index';
import { updateInfo } from '../../../components/InfoLabel';
import { join } from 'path';
import OS from 'os';
import { path } from '../../getPath';
import fs from 'fs';
import { updateProg, updateVel } from '../../../components/Progress';
import { InnerProps } from '../../../components/Trim';
import { cutAudio } from '../cutVid';

export const downloadAudio = async (
  url: string,
  callback: any,
  title: string,
  ext: string,
  raw_clips: InnerProps[],
  length: number,
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

  youtubeDlWrap
    .exec([
      url,
      '-f',
      'bestaudio',
      '--extract-audio',
      '--audio-format',
      ext,
      '-o',
      clips.length
        ? join(OS.homedir(), 'AppData', 'Roaming', '.webdl', `tempvideo.${ext}`)
        : join(path, `${fixedTitle}.${ext}`),
    ])
    .on('progress', (progress: any) => {
      updateProg(progress.percent);
      updateVel(progress.currentSpeed);
    })
    .on('error', (err: any) => {
      console.error(`%c ${err}`, 'color: #F87D7A');
      callback();
    })
    .on('close', () => {
      if (clips.length) {
        updateInfo('Cutting video ...');
        const promises = [];
        let i = 1;
        for (const clip of clips) {
          promises.push(cutAudio(clip[0], clip[1], path, title, i, ext));
          i++;
        }

        Promise.all(promises).then(() => {
          fs.unlinkSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', `tempvideo.${ext}`));
          updateInfo(`Done downloading ${title}`);
          callback();
        });
      } else {
        updateInfo(`Done downloading ${title}`);
        callback();
      }
    });
};
