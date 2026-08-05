import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/vt323/latin.css';
import '@fontsource/vt323/latin-ext.css';
import '@fontsource/vt323/vietnamese.css';
import './styles/global.css';
import App from './App';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element #root not found');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
