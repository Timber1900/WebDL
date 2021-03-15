import React, { useEffect } from 'react';
import GlobalStyles from './styles/global';
import Layout from './components/Layout';
import './logic/server/server';
import { CheckUpdates } from './logic/update';
import { setUpMinimize } from './logic/tray';
function App() {
  useEffect(() => {
    setUpMinimize();
    CheckUpdates();
  }, []);

  return (
    <>
      <Layout />
      <GlobalStyles />
    </>
  );
}

export default App;
