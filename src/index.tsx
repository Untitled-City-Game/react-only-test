import AppRouter from '@/src/site/AppRouter';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
let container = document.getElementById("app")!;
let root = createRoot(container)
root.render(
  <StrictMode>
    <ErrorBoundary fallback="something went wrong in approuter">
      <AppRouter />
    </ErrorBoundary>
  </StrictMode>
);
