import fs from 'fs';
import { join } from 'path';
import { execStream } from './execStream';
import { path } from '../getPath';
import { InnerProps } from '../../Components/Item';
import { updateEta, updateProg, updateVel } from '../../Components/Header';
import { InfoQueueContextData } from '../../contexts/InfoQueueContext';
import { downloadPath, Progress } from '../../helpers/Constants';
import FFMPEG_Helper from '../../helpers/ffmpeg';

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
  { updateInfo, updateQueuePrgIndividually, updateQueueVelIndividually, updateQueueEtaIndividually, curVideoEncoder, curAudioEncoder }: InfoQueueContextData,
  vid_index: number,
  queue_index: number,
) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<index_interface>(async (res) => {
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

    if (clips.length) await fs.unlink(join(downloadPath, `tempvideo.${ext}`), console.log);

    const ffmpeg_helper = new FFMPEG_Helper({loglevel: '32', output_file: clips.length
      ? join(downloadPath, `tempvideo.${ext}`)
      : join(path, `${fixedTitle}.${ext}`), videoEncoder: curVideoEncoder, audioEncoder: curAudioEncoder});

    const close_function = () => {
      if (clips.length) {
        updateInfo('Cutting video ...');
        const promises = [];
        let i = 1;
        for (const clip of clips) {
          promises.push(ffmpeg_helper.cut_video(clip[0], clip[1], path, fixedTitle, i, ext));
          i++;
        }

        Promise.all(promises).then((val) => {
          console.log(val)
          fs.unlink(join(downloadPath, `tempvideo.${ext}`), console.log);
          updateInfo(`Done downloading ${title}`);
          res({ vid_index, queue_index });
        });
      } else {
        updateInfo(`Done downloading ${title}`);
        res({ vid_index, queue_index });
      }
    };

    ffmpeg_helper.merge_video(audio, video, close_function);

    video
      .on('progress', (progress: Progress) => {
        updateProg(progress.percent ?? 0);
        updateVel(progress.currentSpeed ?? '0.0MiB/s');
        updateEta(progress.eta ?? '00:00');
        updateQueuePrgIndividually(progress.percent ?? 0, queue_index);
        updateQueueVelIndividually(progress.currentSpeed ?? '0.0MiB/s', queue_index);
        updateQueueEtaIndividually(progress.eta ?? '00:00', queue_index);
      })
      .on('error', (err: any) => {
        console.error(`%c ${err}`, 'color: #F87D7A');
        res({ vid_index, queue_index });
      });

    audio.on('error', (err: any) => {
      console.error(`%c ${err}`, 'color: #F87D7A');
      res({ vid_index, queue_index });
    });
  });
};
