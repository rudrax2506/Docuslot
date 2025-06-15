import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvier from './context/AdminContext.jsx'
import DoctorContextProvier from './context/DoctorContext.jsx'
import AppContextProvier from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminContextProvier>
      <DoctorContextProvier>
        <AppContextProvier>
          <App />
        </AppContextProvier>
      </DoctorContextProvier>
    </AdminContextProvier>

  </BrowserRouter>,
)
