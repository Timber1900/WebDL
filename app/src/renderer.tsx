import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'tailwindcss/tailwind.css';
import App from './App';
import InfoQueueProvider from './contexts/InfoQueueContext';
import SettingsProvider from './contexts/SettingsContext';
import Titlebar from './Components/Titlebar';

ReactDOM.render(
  <React.StrictMode>
    <InfoQueueProvider>
      <SettingsProvider>
        <Titlebar />
        <App />
      </SettingsProvider>
    </InfoQueueProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

