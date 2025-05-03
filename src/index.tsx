import AppRouter from '@/src/site/AppRouter';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

let container = document.getElementById("app")!;
let root = createRoot(container)
root.render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
