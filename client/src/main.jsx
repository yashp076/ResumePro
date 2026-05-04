import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext.jsx';
import App from './App.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ResumeProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </ResumeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
