import fs, { chmodSync } from 'fs';
import { join } from 'path';
import { downloadPath, Duration, Status } from '../../helpers/Constants';
import { getGithubReleases } from './getGithubReleases';
import { downloadFromGithub } from './downloadFromGithub';

export const downloadLatestRealease = () => {
  return new Promise((res, rej) => {
    const last_check: `${number}` | number =
      (window.localStorage.getItem('ytdl-lastcheck') as `${number}`) ?? Date.now() - Duration.DAY;
    if (Date.now() - Number(last_check) >= Duration.DAY) {
      window.localStorage.setItem('ytdl-lastcheck', `${Date.now()}`);
      console.log("Checking for new releases...");
      getGithubReleases(1, 1)
        .then((val: any) => {
          const cur_ver: string | null = window.localStorage.getItem('ytdl-version');
          if (
            cur_ver !== val[0].tag_name ||
            !fs.existsSync(join(downloadPath, process.platform === 'win32' ? 'youtube-dl.exe' : 'youtube-dl'))
          ) {
            alert('Downloading latest youtube-dl...');
            window.localStorage.setItem('ytdl-version', val[0].tag_name);
            if(!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath);
            console.log(`Downloading youtube-dl v${val[0].tag_name}...`);
            downloadFromGithub(join(downloadPath, process.platform === 'win32' ? 'youtube-dl.exe' : 'youtube-dl'))
              .then(() => {
                if(process.platform === 'linux' || process.platform === 'darwin') chmodSync(join(downloadPath, 'youtube-dl'), 0o755);
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
