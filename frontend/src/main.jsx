import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n' // import i18n configuration
import { PatientProvider } from './context/PatientContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PatientProvider>
      <App />
    </PatientProvider>
  </StrictMode>,
)
