import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import './scrollbar.css';
import App from './App';
import InfoQueueProvider from './contexts/InfoQueueContext';
import SettingsProvider from './contexts/SettingsContext';

ReactDOM.render(
  <React.StrictMode>
    <InfoQueueProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </InfoQueueProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
