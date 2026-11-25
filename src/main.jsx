import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ConsultProvider } from './context/ConsultContext';
import './theme/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConsultProvider>
        <App />
      </ConsultProvider>
    </BrowserRouter>
  </React.StrictMode>
);
