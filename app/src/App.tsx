import React, { useEffect } from 'react';
import GlobalStyles from './styles/global';
import Layout from './components/Layout';
import './logic/server/server';
import { downloadLatestRealease } from './logic/youtube-dl-wrap/downloadLatestRelease';
import { exec, spawn } from 'child_process';
import { getVersion, downloadFromGithub } from './logic/update';
import { join } from 'path';
import OS from 'os';

function App() {
  // useEffect(() => {
  //   new Promise((resolve, reject) => {
  //     const ls = exec(
  //       'for /F "tokens=3" %A in (\'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\WebDL" /v "Version"\') DO (Echo %A)',
  //     );

  //     ls.stdout.on('data', (data: any) => {
  //       if (data.toString().charAt(0) === 'v') {
  //         resolve(data.toString().trim());
  //       }
  //     });
  //   }).then(async (val) => {
  //     const [{ tag_name }] = await getVersion();
  //     if (tag_name !== val) {
  //       alert('Newer version found, downloading');
  //       await downloadFromGithub(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'WebDL.exe'));
  //       setTimeout(() => {
  //         spawn('cmd', ['/S', '/C', join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'WebDL.exe')], {
  //           detached: true,
  //           cwd: OS.homedir(),
  //           env: process.env,
  //         });
  //         window.close();
  //       }, 10000);
  //     }
  //   });

  //   downloadLatestRealease();
  // }, []);

  return (
    <>
      <Layout />
      <GlobalStyles />
    </>
  );
}

export default App;
