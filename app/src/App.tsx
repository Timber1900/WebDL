import React, { useEffect } from 'react';
import GlobalStyles from './styles/global';
import Layout from './components/Layout';
import './logic/server/server';
import { CheckUpdates } from './logic/update';

function App() {
  useEffect(() => {
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
