import React from 'react';
import ReactDOM from 'react-dom/client';

import { FullContextProvider } from './components/FullContext';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <FullContextProvider>
    <App />
  </FullContextProvider>,
  // </React.StrictMode>,
);
