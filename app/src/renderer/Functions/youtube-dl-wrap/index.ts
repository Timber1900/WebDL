import YoutubeDlWrap from 'youtube-dl-wrap';
import { join } from 'path';
import { downloadPath } from '../../helpers/Constants';

export const youtubeDlWrap = new YoutubeDlWrap(join(downloadPath, process.platform === 'win32' ? 'youtube-dl.exe' : 'youtube-dl'));
