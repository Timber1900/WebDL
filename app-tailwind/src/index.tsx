import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './scrollbar.css';
import App from './App';
import InfoQueueProvider from './Contexts/InfoQueueContext';
import SettingsProvider from './Contexts/SettingsContext';

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
