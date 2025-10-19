import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Ruta de Login (sin Layout) */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
      />
      
      {/* Rutas protegidas (con Layout) */}
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? (
            <Layout>
              <Dashboard />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } 
      />

      <Route 
        path="/products" 
        element={
          isAuthenticated ? (
            <Layout>
              <Products />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } 
      />
      
      {/* Ruta por defecto */}
      <Route 
        path="*" 
        element={<Navigate to="/login" />} 
      />
    </Routes>
  )
}

export default App