import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          ¡Bienvenido, {user?.username}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Has iniciado sesión correctamente en el sistema de ventas.
        </p>
      </div>
      
      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700">Ventas Hoy</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          <p className="text-sm text-gray-500 mt-1">S/ 0.00</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-700">Productos</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          <p className="text-sm text-gray-500 mt-1">En inventario</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-gray-700">Stock Bajo</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
          <p className="text-sm text-gray-500 mt-1">Productos</p>
        </div>
      </div>

      {/* Sección de acciones rápidas */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/sales')}
            className="bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Nueva Venta
          </button>
          <button 
            onClick={() => navigate('/products')}
            className="bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Agregar Producto
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;