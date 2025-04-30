import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DappMyMusicProvider } from './context/DappMyMusicContext';

createRoot(document.getElementById('root')).render(
  <DappMyMusicProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </DappMyMusicProvider>,
)
