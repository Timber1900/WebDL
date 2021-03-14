import https from 'https';
import fs from 'fs';
import { exec, spawn } from 'child_process';
import { join } from 'path';
import OS from 'os';
import util from 'util';
import { curInfo, updateInfo } from '../../components/InfoLabel';
import { Status, Duration } from '../../Constants';

export const getVersion = (page = 1, perPage = 1): any => {
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
  const version = (await getVersion())[0].tag_name;
  const fileURL = `https://github.com/Timber1900/WebDL/releases/download/${version}/${fileName}`;

  return await downloadFile(fileURL, filePath);
};

const downloadFile = (fileURL: string, filePath: string) => {
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

export const downloadInstaller = () => {
  return new Promise((res, rej) => {
    new Promise((resolve, reject) => {
      const ls = exec(
        'for /F "tokens=3" %A in (\'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\WebDL" /v "Version"\') DO (Echo %A)',
      );
      ls.stdout.on('data', (data: any) => {
        if (data.toString().charAt(0) === 'v') {
          resolve(data.toString().trim());
        }
      });
    }).then(async (val) => {
      let last_check: `${number}` | number =
        (window.localStorage.getItem('webdl-lastcheck') as `${number}`) ?? Date.now() - Duration.DAY;
      if (Date.now() - Number(last_check) >= Duration.DAY) {
        window.localStorage.setItem('webdl-lastcheck', `${Date.now()}`);
        const [{ tag_name }] = await getVersion();
        if (tag_name !== val) {
          alert('Newer version found, downloading');
          const promise = downloadFromGithub(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'WebDL.exe'))
            .then(() => {
              // eslint-disable-next-line no-restricted-globals
              if (confirm('Install newer version?')) {
                spawn('cmd', ['/S', '/C', join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'WebDL.exe')], {
                  detached: true,
                  cwd: OS.homedir(),
                  env: process.env,
                });
                window.close();
              } else {
                res(Status.PASS);
              }
            })
            .catch((error) => {
              rej({ code: Status.ERR, error });
            });
          const updateTest = async () => {
            if (util.inspect(promise).includes('pending')) {
              if (curInfo.includes('Newer version found, downloading')) {
                const new_info =
                  curInfo.substring(curInfo.length - 3, curInfo.length) === '...'
                    ? curInfo.substring(0, curInfo.length - 3)
                    : `${curInfo}.`;
                updateInfo(new_info);
              }
              setTimeout(updateTest, 333);
            }
          };
          updateTest();
        } else {
          res(Status.PASS);
        }
      } else {
        res(Status.PASS);
      }
    });
  });
};
