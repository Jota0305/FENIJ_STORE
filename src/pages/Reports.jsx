import { useState } from 'react';
import { useSales } from '../context/SalesContext';
import { useProducts } from '../context/ProductContext';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  ShoppingBag,
  Calendar,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

function Reports() {
  const { tickets } = useSales();
  const { products } = useProducts();
  const [dateFilter, setDateFilter] = useState('today');

  // Filtrar tickets pagados
  const paidTickets = tickets.filter(t => t.status === 'PAGADO');

  // Obtener fecha de inicio según el filtro
  const getStartDate = () => {
    const now = new Date();
    switch (dateFilter) {
      case 'today':
        return new Date(now.setHours(0, 0, 0, 0));
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return weekAgo;
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return monthAgo;
      default:
        return new Date(0);
    }
  };

  // Filtrar ventas por fecha
  const filteredSales = paidTickets.filter(ticket => {
    const ticketDate = new Date(ticket.date);
    return ticketDate >= getStartDate();
  });

  // Calcular ingresos totales
  const totalRevenue = filteredSales.reduce((sum, ticket) => sum + ticket.total, 0);

  // Calcular número de ventas
  const totalSales = filteredSales.length;

  // Calcular ticket promedio
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Calcular productos más vendidos
  const getTopProducts = () => {
    const productSales = {};
    
    filteredSales.forEach(ticket => {
      ticket.items.forEach(item => {
        const key = `${item.brand} ${item.model} - ${item.color}`;
        if (!productSales[key]) {
          productSales[key] = {
            name: key,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[key].quantity += item.quantity;
        productSales[key].revenue += item.subtotal;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  const topProducts = getTopProducts();

  // Calcular productos con stock bajo
  const getLowStockProducts = () => {
    return products
      .map(product => ({
        ...product,
        totalStock: product.sizes.reduce((sum, size) => sum + size.stock, 0)
      }))
      .filter(product => product.totalStock > 0 && product.totalStock <= 5)
      .sort((a, b) => a.totalStock - b.totalStock);
  };

  const lowStockProducts = getLowStockProducts();

  // Calcular productos sin stock
  const outOfStockCount = products.filter(product => 
    product.sizes.every(size => size.stock === 0)
  ).length;

  // Obtener ventas por método de pago
  const getPaymentMethodStats = () => {
    const stats = {
      EFECTIVO: 0,
      TARJETA: 0,
      TRANSFERENCIA: 0
    };

    filteredSales.forEach(ticket => {
      if (ticket.paymentInfo && ticket.paymentInfo.method) {
        stats[ticket.paymentInfo.method] += ticket.total;
      }
    });

    return stats;
  };

  const paymentStats = getPaymentMethodStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Reportes</h1>
          <p className="text-gray-600 mt-1">Análisis de ventas y productos</p>
        </div>
        
        {/* Filtro de fecha */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="today">Hoy</option>
          <option value="week">Última Semana</option>
          <option value="month">Último Mes</option>
          <option value="all">Todo el Tiempo</option>
        </select>
      </div>

      {/* Cards de métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de ventas */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Ventas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalSales}</p>
            </div>
            <ShoppingBag className="text-blue-500" size={32} />
          </div>
        </div>

        {/* Ingresos totales */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                S/ {totalRevenue.toFixed(2)}
              </p>
            </div>
            <DollarSign className="text-green-500" size={32} />
          </div>
        </div>

        {/* Ticket promedio */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ticket Promedio</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                S/ {averageTicket.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="text-purple-500" size={32} />
          </div>
        </div>

        {/* Stock bajo */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stock Bajo</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {lowStockProducts.length}
              </p>
            </div>
            <AlertTriangle className="text-red-500" size={32} />
          </div>
        </div>
      </div>

      {/* Gráficos y tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos más vendidos */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="text-blue-600" size={24} />
            <h2 className="text-lg font-semibold text-gray-800">
              Top 5 Productos Más Vendidos
            </h2>
          </div>
          
          {topProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay datos de ventas</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="border-b border-gray-200 pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        {product.quantity} unidades vendidas
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">
                      S/ {product.revenue.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(product.quantity / topProducts[0].quantity) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ventas por método de pago */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="text-green-600" size={24} />
            <h2 className="text-lg font-semibold text-gray-800">
              Ventas por Método de Pago
            </h2>
          </div>
          
          <div className="space-y-4">
            {Object.entries(paymentStats).map(([method, amount]) => (
              <div key={method} className="border-b border-gray-200 pb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">{method}</span>
                  <span className="font-bold text-gray-900">
                    S/ {amount.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      method === 'EFECTIVO' ? 'bg-green-500' :
                      method === 'TARJETA' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}
                    style={{
                      width: totalRevenue > 0 ? `${(amount / totalRevenue) * 100}%` : '0%'
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {totalRevenue > 0 ? ((amount / totalRevenue) * 100).toFixed(1) : 0}% del total
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Productos con stock bajo */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="text-red-600" size={24} />
            <h2 className="text-lg font-semibold text-gray-800">
              Productos con Stock Bajo (≤ 5 unidades)
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tallas Disponibles
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lowStockProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">
                        {product.brand} {product.model}
                      </p>
                      <p className="text-sm text-gray-600">{product.color}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {product.sku}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        product.totalStock <= 2
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.totalStock} unidades
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {product.sizes
                        .filter(s => s.stock > 0)
                        .map(s => `${s.size} (${s.stock})`)
                        .join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resumen de inventario */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Package className="text-blue-600" size={24} />
          <h2 className="text-lg font-semibold text-gray-800">Resumen de Inventario</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Productos</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Productos con Stock</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {products.filter(p => p.sizes.some(s => s.stock > 0)).length}
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Sin Stock</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{outOfStockCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;