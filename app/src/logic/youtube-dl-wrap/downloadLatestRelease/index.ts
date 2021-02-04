import YoutubeDlWrap from 'youtube-dl-wrap';
import { join } from 'path';
import OS from 'os';
import fs from 'fs';

export const downloadLatestRealease = () => {
  YoutubeDlWrap.getGithubReleases(1, 1).then((val: any) => {
    let cur_ver: string;

    try {
      const data = fs.readFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'version.json')).toString();
      cur_ver = JSON.parse(data).version;
    } catch (error) {
      fs.mkdir(join(OS.homedir(), 'AppData', 'Roaming', '.webdl'), () => {});
    }

    console.log({ cur: cur_ver, latest: val[0].tag_name });
    if (
      cur_ver !== val[0].tag_name ||
      !fs.existsSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'youtube-dl.exe'))
    ) {
      alert('Downloading latest youtube-dl...');
      fs.writeFileSync(
        join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'version.json'),
        JSON.stringify({ version: val[0].tag_name }),
      );
      YoutubeDlWrap.downloadFromWebsite(
        join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'youtube-dl.exe'),
        'win32',
      ).then(() => {
        alert('Done downloading latest youtube-dl!');
        console.log('%c Done downloading latest version!', 'color: #6A8A35');
      });
    }
  });
};
