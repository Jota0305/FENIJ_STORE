import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProductProvider } from './context/ProductContext'
import { SalesProvider } from './context/SalesContext'
import { CustomerProvider } from './context/CustomerContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CustomerProvider>
            <SalesProvider>
              <App />
            </SalesProvider>
          </CustomerProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)