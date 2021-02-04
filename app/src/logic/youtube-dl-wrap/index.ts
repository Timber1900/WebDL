import YoutubeDlWrap from 'youtube-dl-wrap';
import { join } from 'path';
import OS from 'os';

export const youtubeDlWrap = new YoutubeDlWrap(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'youtube-dl.exe'));
