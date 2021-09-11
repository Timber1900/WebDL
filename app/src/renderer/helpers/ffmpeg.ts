import execa from 'execa';
import { join } from 'path';
import internal from 'stream';
import { downloadPath } from './Constants';

//@ts-ignore
const ffmpeg = window.ffmpeg;

interface ffmpeg_options {
  loglevel?: string,
  output_file: string,
}

export default class FFMPEG_Helper {
  private video_args: string[];
  private loglevel: string;
  private output_file: string;
  constructor({loglevel, output_file}: ffmpeg_options) {
    this.video_args = [
      '-loglevel',
      loglevel ?? '8',
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
      output_file
    ];
    this.loglevel = loglevel ?? '8';
    this.output_file = output_file;
  }

  public merge_video(audio: internal.Readable, video: internal.Readable, close_function: () => void) {
    const ffmpeg_process = execa(ffmpeg, this.video_args, {windowsHide: true, stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'pipe', 'pipe']});

    //@ts-ignore
    audio.pipe(ffmpeg_process.stdio[4]);
    //@ts-ignore
    video.pipe(ffmpeg_process.stdio[5]);

    ffmpeg_process.then(close_function);
  }

  public convert_video(audio: internal.Readable, close_function: () => void) {
    const ffmpeg_process = execa(ffmpeg,
      [
        '-loglevel',
        '8',
        '-hide_banner',
        '-i',
        'pipe:4',
        '-y',
        this.output_file
      ], {windowsHide: true, stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'pipe', 'pipe'] }
    );

    //@ts-ignore
    audio.pipe(ffmpeg_process.stdio[4]);
    ffmpeg_process.then(close_function);
  }

  public async cut_video(start: number, end: number, path: string, title: string, i: number, ext: string) {
    return new Promise((resolve, reject) => {
      const duration = end - start;
      const ffmpeg_process = execa(ffmpeg, [
        '-loglevel',
        this.loglevel ?? '8',
        '-ss',
        start.toString(),
        '-i',
        join(downloadPath, `tempvideo.${ext}`),
        '-to',
        duration.toString(),
        '-c',
        'copy',
        '-y',
        join(path, `${title}-clip-${i}.${ext}`),
      ], {
        windowsHide: true,
      },);
      ffmpeg_process.then((data) => resolve(data));
      ffmpeg_process.catch((error) => reject(error));
    });
  }
}
