import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/routes';
import { ToastProvider } from './context/ToastContext';
import { AppStateProvider } from './context/AppStateContext';

// Global error handlers for uncaught exceptions and unhandled promise rejections
window.onerror = (message, source, lineno, colno, error) => {
  console.error('[Global Error Handler]:', { message, source, lineno, colno, error });
};

window.onunhandledrejection = (event: PromiseRejectionEvent) => {
  console.error('[Global Unhandled Promise Rejection]:', event.reason);
};

if (process.env.NODE_ENV !== 'production') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
  }).catch((err) => {
    console.error('Failed to load @axe-core/react:', err);
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
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
}
