import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// VT323 — LED classic + Vietnamese
import '@fontsource/vt323/latin.css';
import '@fontsource/vt323/latin-ext.css';
import '@fontsource/vt323/vietnamese.css';

// Share Tech Mono — tech LED (latin)
import '@fontsource/share-tech-mono/latin.css';

// IBM Plex Mono — clean mono + Vietnamese
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-ext-400.css';
import '@fontsource/ibm-plex-mono/vietnamese-400.css';

// Space Mono — display mono + Vietnamese
import '@fontsource/space-mono/latin-400.css';
import '@fontsource/space-mono/latin-ext-400.css';
import '@fontsource/space-mono/vietnamese-400.css';

// Silkscreen — hard pixel
import '@fontsource/silkscreen/latin-400.css';
import '@fontsource/silkscreen/latin-ext-400.css';

// Press Start 2P — 8-bit arcade
import '@fontsource/press-start-2p/latin.css';
import '@fontsource/press-start-2p/latin-ext.css';

// Nova Mono — LCD feel
import '@fontsource/nova-mono/latin.css';
import '@fontsource/nova-mono/latin-ext.css';

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
