import * as React from 'react';
import Layout from './Components/Layout'
import Titlebar from './Components/Titlebar'
import InfoQueueProvider from './contexts/InfoQueueContext'
import SettingsProvider from './contexts/SettingsContext'
import 'tailwindcss/tailwind.css';

const App = () => {
  return(
    <InfoQueueProvider>
      <SettingsProvider>
        <Titlebar />
        <Layout />
      </SettingsProvider>
    </InfoQueueProvider>
  )
}

export default App;
