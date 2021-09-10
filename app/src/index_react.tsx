import React from 'react';
import ReactDOM from 'react-dom';
import './scrollbar.css';
import App from './App';
import InfoQueueProvider from './contexts/InfoQueueContext';
import SettingsProvider from './contexts/SettingsContext';
import Titlebar from './Components/Titlebar';

//@ts-ignore
if (module.hot) {
  //@ts-ignore
  module.hot.accept();
}

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
