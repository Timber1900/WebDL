import YoutubeDlWrap from 'youtube-dl-wrap';
import { join } from 'path';
import OS from 'os';
import fs from 'fs';
import { Duration, Status } from '../../../Constants';

export const downloadLatestRealease = () => {
  return new Promise((res, rej) => {
    let last_check: `${number}` | number =
      (window.localStorage.getItem('ytdl-lastcheck') as `${number}`) ?? Date.now() - Duration.DAY;
    if (Date.now() - Number(last_check) >= Duration.DAY) {
      window.localStorage.setItem('ytdl-lastcheck', `${Date.now()}`);
      YoutubeDlWrap.getGithubReleases(1, 1)
        .then((val: any) => {
          let cur_ver: string | null = window.localStorage.getItem('ytdl-version');
          if (
            cur_ver !== val[0].tag_name ||
            !fs.existsSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'youtube-dl.exe'))
          ) {
            alert('Downloading latest youtube-dl...');
            window.localStorage.setItem('ytdl-version', val[0].tag_name);
            YoutubeDlWrap.downloadFromWebsite(
              join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'youtube-dl.exe'),
              'win32',
            )
              .then(() => {
                res(Status.SUCCESS);
                alert('Done downloading latest youtube-dl!');
                console.log('%c Done downloading latest version!', 'color: #6A8A35');
              })
              .catch((error: any) => {
                rej({ code: Status.ERR, error });
              });
          } else {
            res(Status.PASS);
          }
        })
        .catch((error: any) => {
          rej({ code: Status.ERR, error });
        });
    } else {
      res(Status.PASS);
    }
  });
};
