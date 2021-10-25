import execa from 'execa';
import { join } from 'path';
import internal from 'stream';
import { downloadPath } from './Constants';

//@ts-ignore
const ffmpeg = window.ffmpeg;

interface ffmpeg_options {
  loglevel?: string,
  output_file: string,
  videoEncoder: 'copy' | 'libx265' | 'libx264' | 'mpeg4',
  audioEncoder: 'copy' | 'aac' | 'libmp3lame' | 'wmav2'
}

export default class FFMPEG_Helper {
  private video_args: string[];
  private loglevel: string;
  private output_file: string;
  private videoEncoder: 'copy' | 'libx265' | 'libx264' | 'mpeg4';
  private audioEncoder: 'copy' | 'aac' | 'libmp3lame' | 'wmav2';

  constructor({loglevel, output_file, videoEncoder, audioEncoder}: ffmpeg_options) {
    this.audioEncoder = audioEncoder;
    this.videoEncoder = videoEncoder;
    this.video_args = [
      '-loglevel',
      loglevel ?? '32',
      '-hide_banner',
      '-i',
      'pipe:4',
      '-i',
      'pipe:5',
      '-map',
      '0:a',
      '-map',
      '1:v',
      '-acodec',
      audioEncoder,
      '-vcodec',
      videoEncoder,
      '-y',
      output_file
    ];
    this.loglevel = loglevel ?? '32';
    this.output_file = output_file;
  }

  public merge_video(audio: internal.Readable, video: internal.Readable, close_function: () => void) {
    const ffmpeg_process = execa(ffmpeg, this.video_args, {windowsHide: true, stdio: ['pipe', 'pipe', 'pipe', 'pipe', 'pipe', 'pipe']});

    //@ts-ignore
    audio.pipe(ffmpeg_process.stdio[4]);
    //@ts-ignore
    video.pipe(ffmpeg_process.stdio[5]);

    let stdout_text = ""
    let stderr_text = ""
    ffmpeg_process.stdout.on('data', chunk => stdout_text+=chunk.toString())
    ffmpeg_process.stderr.on('data', chunk => stderr_text+=chunk.toString())

    ffmpeg_process.finally(() => {console.log({stdout_text, stderr_text}); close_function()});
  }

  public convert_video(audio: internal.Readable, close_function: () => void) {
    const ffmpeg_process = execa(ffmpeg,
      [
        '-loglevel',
        '8',
        '-hide_banner',
        '-i',
        'pipe:4',
        '-acodec',
        this.audioEncoder,
        '-vcodec',
        this.videoEncoder,
        '-y',
        this.output_file
      ], {windowsHide: true, stdio: ['pipe', 'pipe', 'pipe', 'pipe', 'pipe', 'pipe'] }
    );

    //@ts-ignore
    audio.pipe(ffmpeg_process.stdio[4]);

    let stdout_text = ""
    let stderr_text = ""
    ffmpeg_process.stdout.on('data', chunk => stdout_text+=chunk.toString())
    ffmpeg_process.stderr.on('data', chunk => stderr_text+=chunk.toString())

    ffmpeg_process.finally(() => {console.log({stdout_text, stderr_text}); close_function()});
  }

  public convert_audio(audio: internal.Readable, close_function: () => void) {
    const ffmpeg_process = execa(ffmpeg,
      [
        '-loglevel',
        '8',
        '-hide_banner',
        '-i',
        'pipe:4',
        '-acodec',
        this.audioEncoder,
        '-vcodec',
        this.videoEncoder,
        '-y',
        this.output_file
      ], {windowsHide: true, stdio: ['pipe', 'pipe', 'pipe', 'pipe', 'pipe', 'pipe'] }
    );

    //@ts-ignore
    audio.pipe(ffmpeg_process.stdio[4]);

    let stdout_text = ""
    let stderr_text = ""
    ffmpeg_process.stdout.on('data', chunk => stdout_text+=chunk.toString())
    ffmpeg_process.stderr.on('data', chunk => stderr_text+=chunk.toString())

    ffmpeg_process.finally(() => {console.log({stdout_text, stderr_text}); close_function()});
  }

  public async cut_video(start: number, end: number, path: string, title: string, i: number, ext: string) {
    return new Promise((resolve, reject) => {
      const duration = end - start;
      const ffmpeg_process = execa(ffmpeg, [
        '-loglevel',
        this.loglevel ?? '32',
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

      let stdout_text = ""
      let stderr_text = ""
      ffmpeg_process.stdout.on('data', chunk => stdout_text+=chunk.toString())
      ffmpeg_process.stderr.on('data', chunk => stderr_text+=chunk.toString())

      ffmpeg_process.then(() => resolve({stdout_text, stderr_text}));
      ffmpeg_process.catch(() => reject({stdout_text, stderr_text}));
    });
  }
}
