import https from 'https';
import fs from 'fs';
import OS from 'os';
import util from 'util';
import { exec, spawn } from 'child_process';
import { join } from 'path';
import { Status, Duration, downloadPath, GithubRelease } from '../Constants';
import { outerContext } from '../App';
import { downloadLatestRealease } from './youtube-dl-wrap/downloadLatestRelease';
import { InfoQueueContextData } from '../contexts/InfoQueueContext';

export const getVersion = (page = 1, perPage = 5): Promise<GithubRelease[]> => {
  return new Promise((resolve, reject) => {
    const apiURL = `https://api.github.com/repos/Timber1900/WebDL/releases?page=${page}&per_page=${perPage}`;
    https.get(apiURL, { headers: { 'User-Agent': 'node' } }, (response) => {
      let resonseString = '';
      response.setEncoding('utf8');
      response.on('data', (body) => (resonseString += body));
      response.on('error', (e) => reject(e));
      response.on('end', () => (response.statusCode === 200 ? resolve(JSON.parse(resonseString)) : reject(response)));
    });
  });
};

export const downloadFromGithub = async (filePath: string) => {
  const fileName = 'WebDL.exe';
  const version = (await getVersion()).filter(value => !value.prerelease)[0].tag_name;
  const fileURL = `https://github.com/Timber1900/WebDL/releases/download/${version}/${fileName}`;

  return await downloadFile(fileURL, filePath);
};

const downloadFile = (fileURL: string | null, filePath: string) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    while (fileURL) {
      const url = fileURL;
      let response: any = await new Promise((resolveRequest, rejectRequest) =>
        https.get(url, (httpResponse) => {
          httpResponse.on('error', (e) => reject(e));
          resolveRequest(httpResponse);
        }),
      );
      if (response.headers.location) fileURL = response.headers.location;
      else {
        fileURL = null;
        response.pipe(fs.createWriteStream(filePath));
        response.on('error', (e: any) => reject(e));
        response.on('end', () => (response.statusCode === 200 ? resolve(response) : reject(response)));
      }
    }
  });
};

export const getCurrentVersion = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const ls = exec(
      'for /F "tokens=3" %A in (\'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\WebDL" /v "Version"\') DO (Echo %A)',
    );
    ls.stdout?.on('data', (data: any) => {
      if (data.toString().charAt(0) === 'v') {
        const version = data.toString().trim();
        window.localStorage.setItem("curVer", version)
        resolve(version);
      }
    });
  })
}

export const downloadInstaller = ({ curInfo, updateInfo }: InfoQueueContextData) => {
  return new Promise((res, rej) => {
    getCurrentVersion()
      .then(async (val) => {
        let last_check: `${number}` | number =
          (window.localStorage.getItem('webdl-lastcheck') as `${number}`) ?? Date.now() - Duration.DAY;
        if (Date.now() - Number(last_check) >= Duration.DAY) {
          window.localStorage.setItem('webdl-lastcheck', `${Date.now()}`);
          const tag_name = (await getVersion()).filter(value => !value.prerelease)[0].tag_name;
          console.log(tag_name);
          if (tag_name !== val) {
            let currentInfo = 'Newer version found, downloading';
            alert('Newer version found, downloading');
            if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath);
            const promise = downloadFromGithub(join(downloadPath, 'WebDL.exe'))
              .then(() => {
                // eslint-disable-next-line no-restricted-globals
                if (confirm('Install newer version?')) {
                  spawn('cmd', ['/S', '/C', join(downloadPath, 'WebDL.exe')], {
                    detached: true,
                    cwd: OS.homedir(),
                    env: process.env,
                  });
                  nw.Window.get().close(true);
                } else {
                  res(Status.PASS);
                }
              })
              .catch((error) => {
                rej({ code: Status.ERR, error });
              });
            const InformUser = async () => {
              if (util.inspect(promise).includes('pending')) {
                if (currentInfo.includes('Newer version found, downloading')) {
                  const new_info =
                    currentInfo.substring(currentInfo.length - 3, currentInfo.length) === '...'
                      ? currentInfo.substring(0, currentInfo.length - 3)
                      : `${currentInfo}.`;
                  currentInfo = new_info;
                  updateInfo(new_info);
                }
                setTimeout(InformUser, 333);
              }
              updateInfo('Newer version found, downloading');
            };
            InformUser();
          } else {
            res(Status.PASS);
          }
        } else {
          res(Status.PASS);
        }
      })
      .catch((error) => {
        rej({ code: Status.ERR, error });
      });
  });
};

export const CheckUpdates = async () => {
  const codes: any[] = [];
  codes.push(await downloadLatestRealease());
  if(process.platform === 'win32') codes.push(await downloadInstaller(outerContext));
  return codes;
};
