import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import InfoQueueProvider from './contexts/InfoQueueContext';

ReactDOM.render(
  <React.StrictMode>
    <InfoQueueProvider>
      <App />
    </InfoQueueProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
