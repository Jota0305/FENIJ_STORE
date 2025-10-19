import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSales } from '../context/SalesContext';
import { useProducts } from '../context/ProductContext';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tickets } = useSales();
  const { products } = useProducts();

  // Calcular ventas de hoy
  const getTodaySales = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayTickets = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.date);
      return ticket.status === 'PAGADO' && ticketDate >= today;
    });

    return {
      count: todayTickets.length,
      total: todayTickets.reduce((sum, ticket) => sum + ticket.total, 0)
    };
  };

  // Contar productos con stock
  const getProductsWithStock = () => {
    return products.filter(product => 
      product.sizes.some(size => size.stock > 0)
    ).length;
  };

  // Contar productos con stock bajo (≤ 5 unidades)
  const getLowStockCount = () => {
    return products.filter(product => {
      const totalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);
      return totalStock > 0 && totalStock <= 5;
    }).length;
  };

  const todaySales = getTodaySales();
  const productsWithStock = getProductsWithStock();
  const lowStockCount = getLowStockCount();

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
          <p className="text-3xl font-bold text-blue-600 mt-2">{todaySales.count}</p>
          <p className="text-sm text-gray-500 mt-1">S/ {todaySales.total.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-700">Productos</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{productsWithStock}</p>
          <p className="text-sm text-gray-500 mt-1">Con stock disponible</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-gray-700">Stock Bajo</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{lowStockCount}</p>
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

      {/* Alertas de stock bajo */}
      {lowStockCount > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-semibold">Atención:</span> Tienes {lowStockCount} producto(s) con stock bajo.{' '}
                <button 
                  onClick={() => navigate('/reports')}
                  className="underline font-semibold hover:text-yellow-900"
                >
                  Ver detalles
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Resumen de tickets pendientes */}
      {tickets.filter(t => t.status === 'PENDIENTE').length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Hay {tickets.filter(t => t.status === 'PENDIENTE').length} ticket(s) pendiente(s) de pago.{' '}
                <button 
                  onClick={() => navigate('/cashier')}
                  className="underline font-semibold hover:text-blue-900"
                >
                  Ir a Caja
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;