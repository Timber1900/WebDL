import React, { useEffect } from 'react';
import GlobalStyles from './styles/global';
import Layout from './components/Layout';
import './logic/server/server';
import { downloadLatestRealease } from './logic/youtube-dl-wrap/downloadLatestRelease';
import { downloadInstaller } from './logic/update';

function App() {
  useEffect(() => {
    (async () => {
      await downloadLatestRealease();
      await downloadInstaller();
    })();
  }, []);

  return (
    <>
      <Layout />
      <GlobalStyles />
    </>
  );
}

export default App;
