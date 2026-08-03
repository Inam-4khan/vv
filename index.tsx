
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './src/router/routes';
import { ToastProvider } from './src/context/ToastContext';
import { AppStateProvider } from './src/context/AppStateContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ToastProvider>
      <AppStateProvider>
        <RouterProvider router={router} />
      </AppStateProvider>
    </ToastProvider>
  </React.StrictMode>
);


