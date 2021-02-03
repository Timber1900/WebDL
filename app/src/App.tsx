import React from 'react';
import GlobalStyles from './styles/global';
import Layout from './components/Layout';
import './logic/server/server';

function App() {
  return (
    <>
      <Layout />
      <GlobalStyles />
    </>
  );
}

export default App;
