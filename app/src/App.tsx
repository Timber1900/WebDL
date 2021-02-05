import React, { useEffect } from 'react';
import GlobalStyles from './styles/global';
import Layout from './components/Layout';
import './logic/server/server';
import { downloadLatestRealease } from './logic/youtube-dl-wrap/downloadLatestRelease';
import { exec, spawn } from 'child_process';
import { getVersion, downloadFromGithub } from './logic/update';
import { join } from 'path';
import OS from 'os';
import util from 'util';
import { curInfo, updateInfo } from './components/InfoLabel';

function App() {
  useEffect(() => {
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
      const [{ tag_name }] = await getVersion();
      if (tag_name !== val) {
        alert('Newer version found, downloading');
        const promise = downloadFromGithub(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'WebDL.exe')).then(() => {
          setTimeout(() => {
            spawn('cmd', ['/S', '/C', join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'WebDL.exe')], {
              detached: true,
              cwd: OS.homedir(),
              env: process.env,
            });
            window.close();
          }, 10000);
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
      }
    });

    downloadLatestRealease();
  }, []);

  return (
    <>
      <Layout />
      <GlobalStyles />
    </>
  );
}

export default App;
