import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Sales from './pages/Sales'
import Cashier from './pages/Cashier'

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
      />
      
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

      <Route 
        path="/sales" 
        element={
          isAuthenticated ? (
            <Layout>
              <Sales />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } 
      />

      <Route 
        path="/cashier" 
        element={
          isAuthenticated ? (
            <Layout>
              <Cashier />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } 
      />
      
      <Route 
        path="*" 
        element={<Navigate to="/login" />} 
      />
    </Routes>
  )
}

export default App