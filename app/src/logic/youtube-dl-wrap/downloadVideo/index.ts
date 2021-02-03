import { youtubeDlWrap } from '../index';
import { updateInfo } from '../../../components/InfoLabel';
import { spawn } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import { join } from 'path';
import OS from 'os';
import { path } from '../../getPath';
import fs from 'fs';
import { updateProg, updateVel } from '../../../components/Progress';

export const downloadVideo = async (url: string, callback: any, title: string, merge: boolean, videoFormat: any) => {
  const clips: any[] = [];
  // const outer_span = vid.children[2].children[1].children[1].children[1].children;
  // if (outer_span.length > 1) {
  //   for (let i = 0; i < outer_span.length - 1; i++) {
  //     const start =
  //       parseInt(outer_span[i].children[0].children[0].value * 3600) +
  //       parseInt(outer_span[i].children[0].children[2].value * 60) +
  //       parseInt(outer_span[i].children[0].children[4].value);
  //     const end =
  //       parseInt(outer_span[i].children[2].children[0].value * 3600) +
  //       parseInt(outer_span[i].children[2].children[2].value * 60) +
  //       parseInt(outer_span[i].children[2].children[4].value);
  //     clips.push([start, end]);
  //   }
  // }

  console.log(videoFormat);

  updateInfo(`Downloading ${title}`);

  const regex = /["*/:<>?\\|]/g;
  const fixedTitle: string = title.replace(regex, '');

  const format = merge ? `${videoFormat}+bestaudio` : `${videoFormat}`;

  console.log(format);

  youtubeDlWrap
    .exec([
      url,
      '-f',
      format,
      '--merge-output-format',
      'mkv',
      '-o',
      clips.length
        ? join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'tempvideo.mkv')
        : join(path, fixedTitle + '.mkv'),
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
          promises.push(cutVid(clip[0], clip[1], path, title, i));
          i++;
        }

        Promise.all(promises).then(() => {
          fs.unlinkSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'tempvideo.mkv'));
          updateInfo(`Done downloading ${title}`);
          callback();
        });
      } else {
        updateInfo(`Done downloading ${title}`);
        callback();
      }
    });
};

async function cutVid(start: number, end: number, path: string, title: string, i: number) {
  return new Promise((resolve, reject) => {
    const duration = end - start;
    const secondffmpegprocess = spawn(
      ffmpeg,
      [
        '-ss',
        start.toString(),
        '-i',
        join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'tempvideo.mkv'),
        '-to',
        duration.toString(),
        '-c',
        'copy',
        join(path, `${title}-clip-${i}.mkv`),
      ],
      {
        windowsHide: true,
        stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'pipe', 'pipe'],
      },
    );
    secondffmpegprocess.on('close', function () {
      resolve('done');
    });
  });
}
